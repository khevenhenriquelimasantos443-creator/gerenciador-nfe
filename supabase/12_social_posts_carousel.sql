-- social_posts.kind ganha 'carousel' — post de feed do Instagram com várias
-- imagens (2 a 10), publicado como um carrossel único. Documenta só a
-- mudança incremental (ver comentário em 11_social_posts_tiktok.sql sobre
-- por que a tabela em si não está aqui).
alter table social_posts drop constraint social_posts_kind_check;
alter table social_posts add constraint social_posts_kind_check
  check (kind = any (array['feed'::text, 'story'::text, 'reels'::text, 'tiktok'::text, 'carousel'::text]));

-- Só usada quando kind='carousel': array JSON com o caminho (no bucket
-- 'social') de cada slide, em ordem. image_path continua NOT NULL e guarda
-- o primeiro slide, por compatibilidade com telas que só leem essa coluna
-- (a miniatura da fila no admin, por exemplo).
alter table social_posts add column if not exists image_paths jsonb;
comment on column social_posts.image_paths is 'Só para kind=carousel: array JSON com os caminhos (no bucket social) de cada slide, em ordem. image_path guarda o primeiro slide, por compatibilidade com telas que só leem essa coluna.';
