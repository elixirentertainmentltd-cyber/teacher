# Teach Me a Lesson

A free UK learning-resource website from We Are Elixir.

## Fresh start

All previously shipped game and worksheet pages and generators have been removed from the active website code. The public library starts empty, ready for new original resources. Git history preserves the previous implementations if they are ever needed for reference.

The approved logo remains at the top left; Teachrex is a separate mascot illustration. The footer displays Teach Me a Lesson by We Are Elixir and links to https://weareelixir.co.uk/.

## Admin content manager

Visit `/admin` to sign in and create resource entries with title, description, subject, type, stages, year groups, category, link, and draft/published status.

**Hosting setup required**: set `TML_ADMIN_PASSWORD` (at least 16 characters), `TML_SESSION_SECRET` (at least 32 random characters), and `TML_GITHUB_TOKEN` (fine-grained Contents read/write permission for this repository). Optional `TML_CONTENT_REPO` defaults to `elixirentertainmentltd-cyber/teacher`. Configure these in the hosting environment, never in the repository. The server reads/writes `data/resources.json` on `main` via the GitHub API. Publishing requires a writable GitHub token and a hosting platform that supports Next.js server routes.

Admin functionality currently supports creating draft or published *link-based* entries. It does not yet support uploads, edits, deletion, user accounts or roles. These should be added before a larger content team uses it. Secure the hosting endpoint with HTTPS, rate limiting/WAF protections and secret rotation. Never put admin credentials in client-side code.

Public resources are free to access without login. The catalogue is empty until an admin adds and publishes an entry.

## Local checks

```bash
npm install
npm run typecheck
npm run build
```

Do not deploy without confirming the hosting platform supports the Next.js server APIs, configuring the required environment variables, and testing login, draft/publish, navigation, mobile layout and GitHub content writes.
