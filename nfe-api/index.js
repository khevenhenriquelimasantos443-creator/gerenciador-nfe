// =============================================================================
// Gerenciador NFe — API do módulo de Cadastro de Produtos
// =============================================================================
// Cobre: Seções, Grupos, Subgrupos, Produtos e Ajuste manual de custo
// (Escopo seções 1.1 a 1.4 de ESCOPO-MODULO-ESTOQUE-FISCAL.md)
//
// Auth: header `Authorization: Bearer <API_TOKEN>` obrigatório em toda rota.
// Placeholder até o Módulo 4 (Usuários e Permissões / RBAC) existir de verdade.
// D1 binding: DB
// =============================================================================

const JSON_HEADERS = { "Content-Type": "application/json" };

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }));

    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length === 0) {
      return cors(json({ ok: true, service: "gerenciador-nfe-api" }));
    }

    const auth = request.headers.get("Authorization") || "";
    if (auth !== `Bearer ${env.API_TOKEN}`) {
      return cors(json({ ok: false, error: "Não autorizado" }, 401));
    }

    try {
      // /secoes, /secoes/:id
      if (parts[0] === "secoes") return cors(await handleHierarchy(request, env, "secoes", parts, []));
      // /grupos, /grupos/:id
      if (parts[0] === "grupos") return cors(await handleHierarchy(request, env, "grupos", parts, [{ col: "secao_id", table: "secoes" }]));
      // /subgrupos, /subgrupos/:id
      if (parts[0] === "subgrupos") return cors(await handleHierarchy(request, env, "subgrupos", parts, [{ col: "grupo_id", table: "grupos" }]));
      // /produtos, /produtos/:id, /produtos/:id/ajuste, /produtos/:id/historico
      if (parts[0] === "produtos") return cors(await handleProdutos(request, env, parts));

      return cors(json({ ok: false, error: "Rota não encontrada" }, 404));
    } catch (err) {
      return cors(json({ ok: false, error: String(err?.message || err) }, 500));
    }
  },
};

function cors(response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(response.body, { status: response.status, headers });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

// =============================================================================
// Seções / Grupos / Subgrupos — mesmo shape (código, descrição, status)
// =============================================================================
async function handleHierarchy(request, env, table, parts, parents) {
  const id = parts[1] ? Number(parts[1]) : null;

  if (request.method === "GET" && !id) {
    const { results } = await env.DB.prepare(`SELECT * FROM ${table} ORDER BY codigo`).all();
    return json({ ok: true, data: results });
  }

  if (request.method === "POST") {
    const body = await request.json();
    if (!body.codigo || !body.descricao) return json({ ok: false, error: "codigo e descricao são obrigatórios" }, 400);
    for (const p of parents) {
      if (!body[p.col]) return json({ ok: false, error: `${p.col} é obrigatório` }, 400);
    }
    const cols = ["codigo", "descricao", "status", ...parents.map((p) => p.col)];
    const vals = [body.codigo, body.descricao, body.status || "ativo", ...parents.map((p) => body[p.col])];
    const placeholders = cols.map(() => "?").join(", ");
    const res = await env.DB.prepare(`INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders})`)
      .bind(...vals)
      .run();
    return json({ ok: true, id: res.meta.last_row_id });
  }

  if (!id) return json({ ok: false, error: "id obrigatório" }, 400);

  if (request.method === "PUT") {
    const body = await request.json();
    const fields = ["codigo", "descricao", "status", ...parents.map((p) => p.col)].filter((f) => body[f] !== undefined);
    if (fields.length === 0) return json({ ok: false, error: "Nada para atualizar" }, 400);
    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const vals = fields.map((f) => body[f]);
    await env.DB.prepare(`UPDATE ${table} SET ${setClause} WHERE id = ?`)
      .bind(...vals, id)
      .run();
    return json({ ok: true });
  }

  if (request.method === "DELETE") {
    try {
      await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
      return json({ ok: true });
    } catch {
      return json({ ok: false, error: "Não é possível excluir: existem registros vinculados" }, 409);
    }
  }

  return json({ ok: false, error: "Método não suportado" }, 405);
}

// =============================================================================
// Produtos
// =============================================================================
async function handleProdutos(request, env, parts) {
  const id = parts[1] ? Number(parts[1]) : null;
  const sub = parts[2] || null;

  if (request.method === "GET" && !id) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const status = url.searchParams.get("status");
    let sql = `
      SELECT p.*, s.descricao AS secao_nome, g.descricao AS grupo_nome, sg.descricao AS subgrupo_nome
      FROM produtos p
      JOIN secoes s ON s.id = p.secao_id
      JOIN grupos g ON g.id = p.grupo_id
      JOIN subgrupos sg ON sg.id = p.subgrupo_id
      WHERE 1=1`;
    const binds = [];
    if (q) {
      sql += ` AND (p.descricao LIKE ? OR p.sku LIKE ? OR p.codigo_barras LIKE ?)`;
      binds.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (status) {
      sql += ` AND p.status = ?`;
      binds.push(status);
    }
    sql += ` ORDER BY p.atualizado_em DESC`;
    const { results } = await env.DB.prepare(sql).bind(...binds).all();
    return json({ ok: true, data: results });
  }

  if (request.method === "POST" && !id) {
    const result = await criarProduto(request, env);
    return json(result, result.ok ? 200 : 400);
  }

  if (!id) return json({ ok: false, error: "id obrigatório" }, 400);

  if (request.method === "GET" && sub === "historico") {
    const { results } = await env.DB.prepare(
      `SELECT * FROM historico_produto WHERE produto_id = ? ORDER BY criado_em DESC`
    )
      .bind(id)
      .all();
    return json({ ok: true, data: results });
  }

  if (request.method === "GET" && !sub) {
    const produto = await env.DB.prepare(
      `SELECT p.*, s.descricao AS secao_nome, g.descricao AS grupo_nome, sg.descricao AS subgrupo_nome
       FROM produtos p
       JOIN secoes s ON s.id = p.secao_id
       JOIN grupos g ON g.id = p.grupo_id
       JOIN subgrupos sg ON sg.id = p.subgrupo_id
       WHERE p.id = ?`
    )
      .bind(id)
      .first();
    if (!produto) return json({ ok: false, error: "Produto não encontrado" }, 404);
    return json({ ok: true, data: produto });
  }

  if (request.method === "PUT" && !sub) {
    const result = await atualizarProduto(id, request, env);
    return json(result, result.ok ? 200 : 400);
  }

  if (request.method === "POST" && sub === "ajuste") {
    const result = await ajustarCusto(id, request, env);
    return json(result, result.ok ? 200 : (result.error === "Produto não encontrado" ? 404 : 400));
  }

  if (request.method === "DELETE" && !sub) {
    await env.DB.prepare(`DELETE FROM historico_produto WHERE produto_id = ?`).bind(id).run();
    await env.DB.prepare(`DELETE FROM produtos WHERE id = ?`).bind(id).run();
    return json({ ok: true });
  }

  return json({ ok: false, error: "Rota não encontrada" }, 404);
}

async function proximoSku(env) {
  const row = await env.DB.prepare(`SELECT seq FROM sqlite_sequence WHERE name = 'produtos'`).first();
  const next = (row?.seq || 0) + 1;
  return `PRD-${String(next).padStart(6, "0")}`;
}

async function criarProduto(request, env) {
  const body = await request.json();
  const required = ["descricao", "secao_id", "grupo_id", "subgrupo_id"];
  for (const f of required) {
    if (!body[f]) return { ok: false, error: `${f} é obrigatório` };
  }

  const sku = body.sku && body.sku.trim() ? body.sku.trim() : await proximoSku(env);
  const custoCompra = Number(body.custo_compra) || 0;
  const markupPct = Number(body.markup_pct) || 0;
  const custoMedio = custoCompra;
  const precoManual = body.preco_manual ? 1 : 0;
  const precoVenda = precoManual && body.preco_venda != null
    ? Number(body.preco_venda)
    : round2(custoMedio * (1 + markupPct / 100));

  const res = await env.DB.prepare(
    `INSERT INTO produtos (
      sku, codigo_barras, descricao, descricao_resumida, unidade_medida, unidade_compra,
      fator_conversao, marca, categoria_fiscal, secao_id, grupo_id, subgrupo_id, status,
      custo_compra, custo_medio, custo_reposicao, markup_pct, preco_venda, preco_manual
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      sku,
      body.codigo_barras || null,
      body.descricao,
      body.descricao_resumida || null,
      body.unidade_medida || "UN",
      body.unidade_compra || null,
      Number(body.fator_conversao) || 1,
      body.marca || null,
      body.categoria_fiscal || null,
      body.secao_id,
      body.grupo_id,
      body.subgrupo_id,
      body.status || "ativo",
      custoCompra,
      custoMedio,
      custoCompra,
      markupPct,
      precoVenda,
      precoManual
    )
    .run();

  return { ok: true, id: res.meta.last_row_id, sku };
}

async function atualizarProduto(id, request, env) {
  const body = await request.json();
  const editable = [
    "codigo_barras", "descricao", "descricao_resumida", "unidade_medida", "unidade_compra",
    "fator_conversao", "marca", "categoria_fiscal", "secao_id", "grupo_id", "subgrupo_id", "status",
  ];
  const fields = editable.filter((f) => body[f] !== undefined);
  if (fields.length === 0) return { ok: false, error: "Nada para atualizar" };

  const setClause = [...fields.map((f) => `${f} = ?`), `atualizado_em = datetime('now')`].join(", ");
  const vals = fields.map((f) => body[f]);
  await env.DB.prepare(`UPDATE produtos SET ${setClause} WHERE id = ?`).bind(...vals, id).run();
  return { ok: true };
}

// Ajuste manual de custo/preço — escopo 1.4: motivo obrigatório + log de auditoria
async function ajustarCusto(id, request, env) {
  const body = await request.json();
  if (!body.motivo || !body.motivo.trim()) return { ok: false, error: "Motivo é obrigatório" };
  if (!body.usuario || !body.usuario.trim()) return { ok: false, error: "Usuário é obrigatório" };

  const produto = await env.DB.prepare(`SELECT * FROM produtos WHERE id = ?`).bind(id).first();
  if (!produto) return { ok: false, error: "Produto não encontrado" };

  const campo = body.campo === "preco_venda" ? "preco_venda" : "custo_medio";
  const valorNovo = Number(body.valor_novo);
  if (Number.isNaN(valorNovo)) return { ok: false, error: "valor_novo inválido" };
  const valorAnterior = produto[campo];

  await env.DB.prepare(`INSERT INTO historico_produto (produto_id, campo, valor_anterior, valor_novo, motivo, usuario) VALUES (?, ?, ?, ?, ?, ?)`)
    .bind(id, campo, String(valorAnterior), String(valorNovo), body.motivo.trim(), body.usuario.trim())
    .run();

  let novoCustoMedio = produto.custo_medio;
  let novoPrecoVenda = produto.preco_venda;

  if (campo === "custo_medio") {
    novoCustoMedio = valorNovo;
    if (!produto.preco_manual) novoPrecoVenda = round2(valorNovo * (1 + produto.markup_pct / 100));
  } else {
    novoPrecoVenda = valorNovo;
  }

  await env.DB.prepare(
    `UPDATE produtos SET custo_medio = ?, preco_venda = ?, atualizado_em = datetime('now') WHERE id = ?`
  )
    .bind(novoCustoMedio, novoPrecoVenda, id)
    .run();

  return { ok: true };
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
