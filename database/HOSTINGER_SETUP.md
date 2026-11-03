# Hostinger MySQL CMS migration plan

This is the **first migration step**, not a deployed CMS. The SQL schema in `database/001_tml_cms.sql` is not yet applied to Hostinger. Do not run it against an unrelated existing database without checking table collisions and making a backup.

## Architecture
- Next.js 15 app with server-side MySQL access through a connection pool using a dedicated least-privilege database account. Do not expose DB credentials to the browser.
- Hostinger persistent storage for files if the Node.js app has a durable writable directory; otherwise use Hostinger-compatible object storage. Never store uploads in ephemeral Next.js build directories.
- Database stores subjects, resource types, hierarchical categories, stages, years, resource metadata, media metadata, publishing state and site settings.
- Admin interface needs CRUD for all taxonomy entities, media uploads, resource drafts/publishing, homepage content, and audit logging.
- Preserve public free access, logo at top left, and company name and link in footer.

## Safety requirements
- Verify Hostinger supports a long-running Next.js Node server and a persistent writable upload path.
- Configure server-only `TML_DB_HOST`, `TML_DB_PORT`, `TML_DB_NAME`, `TML_DB_USER`, `TML_DB_PASSWORD`, and `TML_UPLOAD_DIR` in hosting settings.
- Keep database credentials out of GitHub and the client. Use prepared statements and strict authorization on every mutation.
- Validate file signatures, file types, file sizes, storage paths and extension. Randomise stored filenames; serve downloads safely; block executable uploads.
- Add rate limiting, CSRF protections, audit logs and a multi-user admin authentication strategy before general rollout.
- Back up database and files before migration. Test restore and deployment on staging.

## Next implementation milestones
1. Confirm actual Hostinger Node.js runtime and persistent upload path.
2. Connect MySQL with a server-only adapter and migration runner.
3. Replace GitHub-backed catalogue and admin API with SQL CRUD.
4. Add authenticated direct uploads, previews, downloads, edit/delete and media manager.
5. Add dynamic taxonomy management, homepage controls, and publishing workflow.
6. Test migration, permissions, upload/download, rollback and build before merging.
