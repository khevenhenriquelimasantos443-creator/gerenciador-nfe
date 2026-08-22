# Voz padrão para vídeos do Finn (TikTok/Reels com narração)

Aprovada pelo Kheven em 22/08/2026 — usar esta configuração em qualquer
vídeo futuro que precise de narração em português, a não ser que ele peça
outra coisa explicitamente.

- **Serviço:** HIggsfield MCP, tool `generate_audio`
- **Model:** `text2speech_v2`
- **Variant:** `elevenlabs` (o motor da ElevenLabs lida melhor com sotaque
  brasileiro que o `seed_audio`/ByteDance puro — testado e comparado ao vivo)
- **voice_type:** `preset`
- **voice_id:** `3c2b83c0-2e0a-5ae8-998a-a5fe71b7eccd` (nome "Helena" no
  catálogo da HIggsfield)

## Tom de voz

Formal, sem gíria. Nada de "mano", "bora", "segue a gente" — o Kheven
pediu explicitamente um registro mais institucional. Frases curtas, sem
vírgula demais (pausas de vírgula às vezes saem estranhas nesse motor —
prefira ponto final ou exclamação a vírgula pra separar ideias).

## Limitação conhecida

Este sandbox não tem acesso de rede pra baixar o .mp3 gerado (CloudFront
bloqueado pelo proxy). O áudio aprovado precisa ser baixado pelo usuário
no próprio dispositivo e reenviado como anexo no chat pra virar arquivo
local processável.
