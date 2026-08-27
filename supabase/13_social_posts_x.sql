-- social_posts.kind ganha 'x' — posts de texto (com foto opcional) no X
-- (Twitter), publicados via API do Buffer (não direto na API do X, que
-- passou a cobrar por post em 2026 — ver finn-serve/CONFIGURAR-X.md).
-- Documenta só a mudança incremental (ver comentário em
-- 11_social_posts_tiktok.sql sobre por que a tabela em si não está aqui).
alter table social_posts drop constraint social_posts_kind_check;
alter table social_posts add constraint social_posts_kind_check
  check (kind = any (array['feed'::text, 'story'::text, 'reels'::text, 'tiktok'::text, 'carousel'::text, 'x'::text]));

-- Posts de texto puro não têm imagem — image_path vira opcional só pra
-- kind='x' (todo outro kind continua exigindo, na regra da aplicação).
alter table social_posts alter column image_path drop not null;
