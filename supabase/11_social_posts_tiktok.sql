-- social_posts.kind ainda não tinha 'tiktok' — a tabela em si nunca entrou
-- no repositório como migração (foi criada direto no projeto), então este
-- arquivo documenta só a mudança incremental, não o CREATE TABLE inteiro.
alter table social_posts drop constraint social_posts_kind_check;
alter table social_posts add constraint social_posts_kind_check
  check (kind = any (array['feed'::text, 'story'::text, 'reels'::text, 'tiktok'::text]));

-- publish_id que a Content Posting API do TikTok devolve — coluna própria,
-- não reaproveita ig_media_id (é de outra plataforma, o nome enganaria).
alter table social_posts add column if not exists tiktok_publish_id text;
