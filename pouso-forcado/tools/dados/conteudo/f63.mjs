// Fase 63 (1.44.0): PneumaticCraft: Repressurized 8.2 (o mais novo, 1.21.1; TeamPneumatic, GPLv3). Números de
// PneumaticValues e dos combustíveis do mod (scripts/config.ts PNEUMATIC; script em scripts/maquinas/pneumatic.ts).
// - Compressor de Ar Avançado: 50 mL/t (5× o comum) com o mesmo combustível, 10.000 mL.
// - Compressor Líquido: baldes de combustível líquido viram ar: biodiesel e combustível 1.000.000 mL (taxa 0,8),
//   petróleo 200.000 (0,25), etanol 400.000 (1); o balde volta vazio.
// - Câmara de Pressão: receitas novas do mod (gelo, gelo compacto e gelo azul, pedra comprimida, farinha e a pá de
//   turbina).
const PN = { mod: "PneumaticCraft" };

export default {
  fase: 63,
  mod: "PneumaticCraft",
  itens: [{ id: "pa_turbina_pneumatica", pt: "Pá de Turbina", en: "Turbine Blade", icone: "barra:#e8c040", ...PN }],
  blocos: [
    { id: "compressor_ar_avancado", pt: "Compressor de Ar Avançado", en: "Advanced Air Compressor", tipo: "maquina", luz: "vermelho", glifo: "chama", comp: "cl:compressor_ar", tick: 20, ...PN },
    { id: "compressor_liquido", pt: "Compressor Líquido", en: "Liquid Compressor", tipo: "maquina", luz: "amarelo", glifo: "gota", comp: "cl:compressor_ar", tick: 20, ...PN },
    { id: "pedra_comprimida", pt: "Pedra Comprimida", en: "Compressed Stone", tipo: "cubo", cor: "#6a6a70", padrao: "ladrilho", dureza: 4, resistencia: 20, girar: false, ...PN },
  ],
  receitas: [
    { id: "compressor_ar_avancado", tipo: "shaped", padrao: ["III", "ICI", "ITI"], chave: { I: "cl:lingote_ferro_comprimido", C: "cl:compressor_ar", T: "cl:tubo_pressao_avancado" }, resultado: "cl:compressor_ar_avancado" },
    { id: "compressor_liquido", tipo: "shaped", padrao: ["IBI", "ICI", "ITI"], chave: { I: "cl:lingote_ferro_comprimido", B: "minecraft:bucket", C: "cl:compressor_ar", T: "cl:tubo_pressao" }, resultado: "cl:compressor_liquido" },
  ],
  textos: {
    "cl.missao.pnc_pressao10.titulo": ["10 bar", "10 bar"], "cl.missao.pnc_pressao10.desc": ["Chegue a 10 bar com o Compressor Avançado e tubos avançados.", "Reach 10 bar with the Advanced Compressor and advanced tubes."],
    "cl.missao.pnc_liquido.titulo": ["Compressor Líquido", "Liquid Compressor"], "cl.missao.pnc_liquido.desc": ["Faça pressão queimando combustível líquido no Compressor Líquido.", "Make pressure burning liquid fuel in the Liquid Compressor."],
    "cl.missao.pnc_gelo_azul.titulo": ["Gelo azul", "Blue ice"], "cl.missao.pnc_gelo_azul.desc": ["Faça gelo azul na Câmara de Pressão (4 gelos compactos a 2,5 bar).", "Make blue ice in the Pressure Chamber (4 packed ice at 2.5 bar)."],
  },
};
