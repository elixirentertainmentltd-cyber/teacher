# Teach Me a Lesson

Free UK educational resources by We Are Elixir.

## Hostinger CMS deployment

The admin area at `/admin` now includes MySQL-backed subject/type/category/stage/year management, resource create/edit/delete, publishing, PDF/image upload, and a server-side MySQL connection test. The public library reads published resources from MySQL. The original logo/header/footer remain in place.

**Deployment prerequisites:**
1. Confirm Hostinger supports the Next.js 15 Node.js runtime and persistent writable server storage.
2. Back up the existing database and files. Run `database/001_tml_cms.sql` on the designated MySQL database using phpMyAdmin. The migration is not automatically executed.
3. Set the environment variables in `.env.example` using Hostinger's secure server configuration. The upload directory must be absolute, persistent, writable by the application and outside public_html. Never send or commit passwords.
4. Run `npm install`, `npm run typecheck`, `npm run build` and deploy the app.
5. Sign in at `/admin`, visit Database settings, test connection, create subjects/types/stages and publish a test PDF. Confirm the file remains available after redeployment.

**Security:** Database credentials are read only from server-side environment variables. They are not editable through a browser form: initial secure bootstrap is necessary. Direct uploads accept verified PDF, PNG, JPEG and WebP files up to 20 MB. Unpublished files require an admin session to download. Set HTTPS, backups, login rate limiting, malware scanning and storage quotas before opening uploads to multiple staff.

**Known gaps:** No database credential saving from the UI, no multi-user roles, no visual homepage editor, no media deletion or full media library, no category hierarchy editor, no migration of any previously stored GitHub catalogue, and no transactional resource/stage save. The existing public filter controls have default static subject/type lists, so newly added classifications may not yet appear as filter choices. This is an initial working CMS, not a complete Twinkl-style platform.

Do not merge to production until the Hostinger environment and MySQL schema are verified, build checks pass and upload/download workflows are tested.
