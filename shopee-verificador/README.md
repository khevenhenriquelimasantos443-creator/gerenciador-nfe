# 🛍️ Shopee — Verificador de Anúncios em Massa

Extensão do Chrome que verifica **todos os seus anúncios da Shopee de uma vez só** e mostra, para cada produto:

| Coluna | O que mostra |
|---|---|
| SKU | SKU do anúncio (o "pai" ou, se não houver, os SKUs das variações) |
| EAN/GTIN | Código de barras cadastrado dentro do anúncio (todas as variações) |
| Em promoção? | Sim/Não |
| Preço promocional | Valor com desconto |
| Nome da promoção | Em qual promoção o produto está (ex.: desconto da loja) |
| Desconto (%) | Percentual de desconto calculado |
| Estoque atual | Soma de todas as variações |
| Vendas (30 dias / total) | Quando o Seller Center disponibiliza o dado |
| Preço original e atual, status, link | — |

Tudo pode ser **exportado para planilha** (abre direto no Excel/Google Sheets) ou copiado com um clique.

> 🔒 **Privacidade:** a extensão usa a sua própria sessão logada do Seller Center, dentro do seu navegador. Nenhum dado é enviado para servidores externos.

---

## 📦 Como instalar (2 minutos)

1. Baixe/copie a pasta `shopee-verificador` para o seu computador.
2. Abra o Chrome e digite na barra de endereço: `chrome://extensions`
3. Ative o **Modo do desenvolvedor** (botão no canto superior direito).
4. Clique em **"Carregar sem compactação"** (Load unpacked).
5. Selecione a pasta `shopee-verificador`.
6. Pronto! O ícone ✔️ laranja aparece na barra do Chrome (fixe ele clicando no alfinete 📌).

## ▶️ Como usar

1. Faça login no **[Shopee Seller Center](https://seller.shopee.com.br)**.
2. Abra a página **Meus Produtos** e espere a lista carregar
   *(isso ajuda a extensão a "aprender" o caminho certo das APIs — recomendado na primeira vez)*.
3. Clique no ícone da extensão.
4. Clique em **🔍 Verificar todos os anúncios**.
5. Aguarde a varredura (ela passa por todas as páginas de produtos automaticamente).
6. Use os filtros, ou clique em:
   - **⬇️ Baixar planilha (Excel/CSV)** — gera `anuncios_shopee_DATA.csv` (abre no Excel com acentos corretos, separador `;`);
   - **📋 Copiar p/ colar no Excel** — copia tudo, é só dar Ctrl+V numa planilha aberta.

> 💡 Os filtros do popup (busca, "só com promoção", "só estoque zerado") também valem para a exportação: se filtrar antes de baixar, a planilha sai filtrada.

## 📊 Dashboard

Depois de uma varredura, clique em **📊 Abrir dashboard** no popup. Ele abre uma página com:

- Cards de resumo (anúncios, em promoção, esgotados, unidades, vendas);
- **Campeões de venda** — os 12 mais vendidos, com alerta vermelho ⛔ nos que estão esgotados (venda parada!);
- Distribuição de **estoque por faixa** e de **faixas de preço**;
- **Promoções** — participação e os mais vendidos SEM promoção (candidatos a campanha);
- Tabela completa com busca, filtros, ordenação e exportação da lista filtrada.

O dashboard sempre mostra a **última varredura** salva no navegador.

## 🔎 Enriquecimento automático (v1.1)

A API de listagem da Shopee nem sempre entrega preço original, nome da promoção e vendas
por período. A partir da v1.1, a extensão **aprende esses dados enquanto você navega**
pelo Seller Center (Meus Produtos, Central de Promoções): as respostas que a própria
página recebe são mineradas localmente e completam a próxima varredura. Quanto mais
você navega antes de verificar, mais completa fica a planilha.

## 🏷️ SKU e EAN (v1.2)

O **SKU** vem direto da listagem. O **EAN/GTIN** só existe dentro de cada anúncio, então a
extensão entra anúncio por anúncio para buscá-lo (opção marcada por padrão no popup):

- **1ª varredura**: demora alguns minutos (respeita um intervalo entre requisições);
- **Varreduras seguintes**: quase instantâneas — os códigos ficam em **cache por 30 dias**;
- Cadastrou um EAN novo? Abra o anúncio no Seller Center que a extensão captura na hora
  (enriquecimento passivo), ou aguarde o cache expirar;
- Na planilha, o EAN sai protegido como texto (não vira "7,89E+12" no Excel);
- Anúncio com várias variações: os EANs saem separados por " / " e os SKUs por " | ".

## ❓ Problemas comuns

| Problema | Solução |
|---|---|
| "Recarregue a página" | Aperte F5 na aba do Seller Center e abra a extensão de novo (acontece logo após instalar). |
| "Não consegui acessar a lista de produtos" | Abra a página **Meus Produtos**, espere carregar, e tente de novo. A extensão captura automaticamente a URL certa da API. |
| Vendas aparecem como "—" | A API da lista de produtos nem sempre traz vendas por período. Quando disponível, a coluna "Vendas (total)" é preenchida; a de 30 dias aparece quando o Seller Center envia esse dado. |
| Nome da promoção = "não identificado" | O produto tem desconto ativo (detectado pelo preço), mas ele vem de uma campanha da própria Shopee (ex.: Oferta Relâmpago da plataforma), que não aparece na lista de descontos da loja. |
| Erro após atualização da Shopee | Os endpoints internos da Shopee mudam de vez em quando. Abra "Detalhes técnicos" na tela de erro e me mande o texto para eu atualizar a extensão. |

## 🗂️ Arquivos

```
shopee-verificador/
├── manifest.json   # configuração da extensão (Manifest V3)
├── popup.html/js/css  # interface (botão, tabela, exportação)
├── content.js      # coletor: varre as páginas de produtos e promoções
├── injected.js     # captura as URLs de API que o próprio Seller Center usa
└── icons/          # ícones
```

## ⚠️ Aviso

Ferramenta de uso pessoal para consultar **os seus próprios anúncios**, usando a sessão que você já tem aberta no navegador. Não automatiza compras, não altera nada na sua loja (só leitura) e respeita um intervalo entre requisições para não sobrecarregar a Shopee.
