# Backend Documentation — Personal Developer Portfolio & Blog Platform

Base URL (dev): `http://localhost:5000/api`
Auth header: `Authorization: Bearer <access_token>`

---

## 0. System Access Model

| Area | Visitors (no login) | Admin (you, login required) |
|------|--------------------|-----------------------------|
| Portfolio / Projects | Browse all projects | Create / edit / delete |
| Blog posts | Read **published** posts only | Create / edit / publish / delete (drafts visible only here) |
| Likes | Anonymous, IP-based toggle (1 like per post) | — |
| Comments | Anonymous (name only), visible **instantly** | Delete abusive comments |
| Contact form | Submit a message | Read inbox / mark read / delete |
| Newsletter | Subscribe / unsubscribe | View / remove subscribers **+ send newsletter blasts via Brevo** |
| Dashboard & uploads | — | Full access |

**Auth exists only for you (single admin).** Visitors never log in anywhere.

---

## 1. File Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   ├── cloudinary.js
│   │   └── logger.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── post.controller.js
│   │   ├── project.controller.js
│   │   ├── comment.controller.js
│   │   ├── contact.controller.js
│   │   ├── newsletter.controller.js
│   │   └── analytics.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── authorize.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── rateLimiter.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   ├── notFound.middleware.js
│   │   └── sanitize.middleware.js
│   │
│   ├── schema/
│   │   ├── user.schema.js
│   │   ├── post.schema.js
│   │   ├── category.schema.js
│   │   ├── tag.schema.js
│   │   ├── postTag.schema.js
│   │   ├── comment.schema.js
│   │   ├── like.schema.js
│   │   ├── project.schema.js
│   │   ├── contact.schema.js
│   │   ├── newsletter.schema.js
│   │   ├── view.schema.js
│   │   ├── relations.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   ├── project.routes.js
│   │   ├── comment.routes.js
│   │   ├── contact.routes.js
│   │   ├── newsletter.routes.js
│   │   ├── analytics.routes.js
│   │   ├── upload.routes.js
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── post.service.js
│   │   ├── project.service.js
│   │   ├── comment.service.js
│   │   ├── like.service.js
│   │   ├── contact.service.js
│   │   ├── newsletter.service.js
│   │   ├── analytics.service.js
│   │   ├── image.service.js
│   │   └── email.service.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── post.validator.js
│   │   ├── project.validator.js
│   │   ├── comment.validator.js
│   │   ├── contact.validator.js
│   │   └── newsletter.validator.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── slugify.js
│   │   ├── readingTime.js
│   │   ├── pagination.js
│   │   └── constants.js
│   │
│   ├── app.js
│   └── server.js
│
├── drizzle/
│   └── migrations/
│
├── uploads/
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth.test.js
│   │   ├── posts.test.js
│   │   ├── projects.test.js
│   │   ├── comments.test.js
│   │   ├── contact.test.js
│   │   └── newsletter.test.js
│   ├── fixtures/
│   │   └── seed.js
│   ├── setup.js
│   └── teardown.js
│
├── .env
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── drizzle.config.js
├── package.json
└── README.md
```

---

## 2. What To Do In Each File / Folder

### 2.1 Root Files

| File | What To Do |
|------|-----------|
| `package.json` | Set `"type": "module"`. Add scripts: `dev` (nodemon), `start`, `db:generate`, `db:migrate`, `db:push`, `db:studio`, `test`, `lint`, `format`. List all runtime and dev dependencies. |
| `drizzle.config.js` | Point Drizzle Kit at `./src/schema/*.js`, output migrations to `./drizzle/migrations`, dialect `postgresql`, read connection URL from `DATABASE_URL`. |
| `.env` | Hold all real secrets: `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`, Cloudinary keys, `CLIENT_URL`, Brevo keys (`BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`), `ADMIN_EMAIL`. Never commit this file. |
| `.env.example` | Same keys as `.env` but with placeholder values only. This is the template teammates copy from. |
| `.gitignore` | Ignore `node_modules/`, `.env*`, `uploads/`, `coverage/`, logs, OS junk files. |
| `.eslintrc.json` | Configure ESLint for ES modules + Node globals; enforce unused-var and error-prone rules. |
| `.prettierrc` | Fix formatting rules (semicolons, quotes, print width) so all files look identical. |
| `README.md` | Document setup steps, required env vars, available npm scripts, and how to run the server and tests. |

### 2.2 `src/config/`

Central place for anything that connects the app to an outside system. Nothing in here contains business logic.

| File | What To Do |
|------|-----------|
| `env.js` | Load `.env` via `dotenv`, validate that every required variable exists and is well-formed (fail fast on boot if something is missing), then export a frozen config object. |
| `db.js` | Create the `postgres` client from `DATABASE_URL`, wrap it with `drizzle()` passing the full schema, and export the single `db` instance used everywhere else. |
| `cloudinary.js` | Configure the Cloudinary SDK with cloud name/API key/API secret from env, and export the configured client. |
| `logger.js` | Set up Morgan (or equivalent) request logging, split/dev vs prod output format, and export the logger middleware. |

### 2.3 `src/schema/`

Table definitions only. Each file defines one table (columns, types, defaults, constraints, indexes) and exports it. No queries live here.

| File | What To Do |
|------|-----------|
| `user.schema.js` | Define the `users` table: id (uuid PK), name, unique email, hashed password, role (default `admin`), avatar, bio, isActive, lastLogin, created/updated timestamps. |
| `post.schema.js` | Define `posts`: title, unique slug, excerpt, content, coverImage, `authorId` FK → users (cascade), `categoryId` FK → categories (restrict), status (`draft`/`published`/`archived`), publishedAt, readingTime, SEO fields (seoTitle, seoDescription, ogImage), isFeatured, viewCount, likeCount (denormalized, default 0), timestamps. |
| `category.schema.js` | Define `categories`: unique name, unique slug, description, denormalized `postCount`, createdAt. |
| `tag.schema.js` | Define `tags`: unique name, unique slug, createdAt. |
| `postTag.schema.js` | Define the `posts_tags` junction table: `postId` + `tagId` composite key, both FK with cascade delete. |
| `comment.schema.js` | Define `comments`: id (uuid PK), `postId` FK → posts (cascade), `name` (display name, 1–100 chars), `content` (1–2000 chars), `createdAt`. **No email, no approval/spam flags** — comments are anonymous and instantly visible. |
| `like.schema.js` | Define `post_likes`: id (uuid PK), `postId` FK → posts (cascade), `ipAddress` (varchar 45, IPv6-safe), `createdAt`. Add a **UNIQUE constraint on (`postId`, `ipAddress`)** — this is what guarantees one like per IP per post. Index on `postId` for fast counts. |
| `project.schema.js` | Define `projects`: title, unique slug, description, longDescription, jsonb `technologies`, thumbnail, jsonb `screenshots`, githubUrl, liveDemoUrl, jsonb `features`, category, isFeatured, startDate, endDate, viewCount, timestamps. |
| `contact.schema.js` | Define `contacts`: name, email, subject, message, `isRead` (default false), createdAt. |
| `newsletter.schema.js` | Define `newsletter`: unique email, status (`active`/`unsubscribed`), subscribedAt, unsubscribedAt. |
| `view.schema.js` | Define `views`: optional `postId` FK and `projectId` FK (set null on delete), ipAddress, userAgent, referrer, createdAt. Add indexes on `postId`, `projectId`, `createdAt`. |
| `relations.js` | Declare all Drizzle relations: user→posts, post→author/category/comments/tags/likes, category→posts, tag↔post via junction, comment→post, like→post. |
| `index.js` | Re-export every table (and relations) so the rest of the app imports from one place. |

### 2.4 `src/middlewares/`

Small, reusable functions that run before controllers. Each file exports one middleware (or a factory that returns one).

| File | What To Do |
|------|-----------|
| `auth.middleware.js` | Read the `Authorization: Bearer` header, verify the access token, load the user from DB, reject if missing/expired/invalid/inactive, otherwise attach `req.user` and call `next()`. |
| `authorize.middleware.js` | Export a factory `authorize(...roles)` that returns 403 when `req.user.role` is not in the allowed roles list. |
| `validate.middleware.js` | Export a factory `validate(schema)` that parses `req.body`/`req.query`/`req.params` with the given Zod schema and returns a 422 response with field-level details on failure. |
| `upload.middleware.js` | Configure Multer with memory storage, a file filter allowing only JPEG/PNG/GIF/WebP, and a 5 MB single-file limit. |
| `rateLimiter.middleware.js` | Export three limiters: general API (100 req/15 min), auth (10 req/15 min), comments (5 req/hour). All return the standard error JSON shape. |
| `errorHandler.middleware.js` | Global `(err, req, res, next)` handler. Format `ApiError`s directly; translate Postgres unique/FK violations and JWT errors into proper status codes; log unknown errors and return 500 (hide messages in production). |
| `notFound.middleware.js` | Catch-all for unmatched routes; respond 404 with the standard error JSON. |
| `sanitize.middleware.js` | Trim strings, lowercase emails, and strip harmful characters from all incoming inputs before validation. |

**Order they must run in:** Helmet → CORS → `express.json` → Morgan → rate limiter → route middleware (auth → authorize → validate → upload) → controller → error handler.

### 2.5 `src/routes/`

Only two jobs: map method + path to a controller, and attach the right middleware chain. No logic beyond that.

| File | What To Do |
|------|-----------|
| `index.js` | Mount every route module under its prefix: `/api/auth`, `/api/posts`, `/api/projects`, `/api/categories`, `/api/tags`, `/api/comments`, `/api/contact`, `/api/newsletter`, `/api/analytics`, `/api/upload`, plus `/api/admin/*`. |
| `auth.routes.js` | Wire register/login/refresh/logout with `authLimiter`; wire `me`, password change with `authenticate` + `validate`. |
| `post.routes.js` | Public reads (list, featured, by-slug) with validators; **like toggle** `POST /api/posts/:postId/like` and status `GET /api/posts/:postId/like` (public, no auth); admin create/update/delete/publish with `authenticate` + `authorize('admin')`. Include category and tag CRUD routes here or in their own mounted sub-router. |
| `project.routes.js` | Public list/featured/by-slug reads; admin create/update/delete behind auth + role check. |
| `comment.routes.js` | Public: `GET /api/posts/:postId/comments` (all comments, newest first) and `POST /api/posts/:postId/comments` (instant submission, behind `commentLimiter` — 5/hour/IP). Admin: `DELETE /api/admin/comments/:id` behind auth. No approve/spam routes — visibility is instant. |
| `contact.routes.js` | Public POST submit; admin GET list, PATCH read, DELETE behind auth. |
| `newsletter.routes.js` | Public subscribe/unsubscribe; admin list/delete; **admin `POST /api/admin/newsletter/send`** (the "Send Newsletter" button) — all admin routes behind `authenticate` + `authorize('admin')`. |
| `analytics.routes.js` | Public/implicit view-recording route; admin dashboard-stats route behind auth. |
| `upload.routes.js` | Admin-only `POST /api/upload` (Multer + image service) and `DELETE /api/upload/:publicId`. |

### 2.6 `src/controllers/`

Extract request data, call exactly one service method, and send back an `ApiResponse`. Never touch the database directly, never hold business rules.

| File | What To Do |
|------|-----------|
| `auth.controller.js` | Handle register, login, refresh, logout, get profile, update profile, change password. Set/clear the refresh-token HTTP-only cookie on login/refresh/logout. |
| `post.controller.js` | Handle list (parse pagination/filter/sort query), get-by-slug, get-by-id, create, update, delete, publish, featured — plus the **like handlers**: read `req.ip`, call the like service toggle, return `{ liked, likeCount }`. Also the category and tag CRUD handlers if kept in this module. |
| `project.controller.js` | Handle list, featured, get-by-slug, create, update, delete. |
| `comment.controller.js` | Handle public submit (instant), public list-per-post (with `postId` param), and admin delete. No approval handlers exist anymore. |
| `contact.controller.js` | Handle public submit, admin list (filter unread), mark-as-read, delete. |
| `newsletter.controller.js` | Handle subscribe, unsubscribe, admin list, admin remove, and **admin send**: read `{ subject, content }` from the body, call the service, respond with `{ sent, failed }` counts. |
| `analytics.controller.js` | Handle view recording (pull IP/user-agent/referrer from the request) and returning dashboard stats. |

### 2.7 `src/services/`

All business logic and every database call lives here. Each file exports a singleton service object. Throw `ApiError` on failures so the error middleware formats them.

| File | What To Do |
|------|-----------|
| `auth.service.js` | Register only the first user (reject registration once any user exists), check email uniqueness, bcrypt-hash passwords (12 rounds), verify on login, update `lastLogin`, generate access + refresh JWTs, and strip `password` from every returned user. |
| `post.service.js` | Create posts (generate unique slug, compute reading time, insert tag links, increment category `postCount`, set `publishedAt` on publish); list posts with status/category/tag/featured filters, ILIKE search, sorting, pagination, and author/category/tags eager-loading (every payload includes `likeCount`); get by slug (increment view count); update (re-slug on title change, recompute reading time, replace tag links); delete (decrement category count, likes cascade); fetch featured posts. |
| `project.service.js` | Create with unique slug; list with category/featured filters, sorting, pagination; get by slug (increment view count); update; delete; fetch featured projects. |
| `comment.service.js` | Verify the target post exists and is **published** before inserting; store the comment (name + content) so it is visible immediately; fetch all comments for a post newest-first; delete any comment by id (admin cleanup). Abuse is controlled by the rate limiter (5/hour/IP), not moderation. |
| `like.service.js` | Toggle a like for `(postId, ipAddress)`: if a row exists → delete it (unlike) and decrement `posts.likeCount`; otherwise insert a row (catch unique-violation races) and increment `likeCount`. Return current `{ liked, likeCount }`. Also expose `hasLiked(postId, ip)` for the status check. |
| `contact.service.js` | Insert submitted messages; list with pagination and unread filter; mark as read; delete. |
| `newsletter.service.js` | Subscribe (reactivate unsubscribed rows, reject duplicate active subs); unsubscribe (set status + timestamp); list subscribers with status filter and pagination; remove a subscriber; **`sendNewsletter(subject, content)`**: fetch all `status = 'active'` subscribers, loop and call `email.service` for each, catch per-recipient failures, and return `{ sent, failed }` counts. Rejects with 400 if there are no active subscribers. |
| `analytics.service.js` | Record a view row (IP, user agent, referrer) and bump `viewCount` on the post/project; compute dashboard stats: totals for posts, projects, comments, active subscribers, unread messages, views in last 30 days, and top 5 posts by views. |
| `image.service.js` | Upload a buffer to Cloudinary (folder, max 1920×1080, auto quality/format) and return `{ url, publicId }`; delete an image by `publicId`, swallowing/logs failures so deletes never break. |
| `email.service.js` | **All outgoing email goes through Brevo's REST API using native `fetch`** (no extra packages). `sendBrevoEmail({ to, toName, subject, html })` → `POST https://api.brevo.com/v3/smtp/email` with `api-key: BREVO_API_KEY` header and sender taken from `BREVO_SENDER_EMAIL`/`BREVO_SENDER_NAME`. Also exposes `sendNewsletterBlast(subject, html, subscribers)` (loop over recipients, count failures) and `sendContactNotification(message)` (notify `ADMIN_EMAIL` of new contact form submissions). Returns early / no-ops gracefully if `BREVO_API_KEY` is unset so the app still boots in development. |

### 2.8 `src/validators/`

Zod schemas only, one file per resource. Each schema validates `body`, `query`, and/or `params`. Used by `validate.middleware.js`.

| File | What To Do |
|------|-----------|
| `auth.validator.js` | Register schema (name 1–100, valid lowercase email, password ≥8 with upper/lower/digit); login schema; update-profile and change-password schemas. |
| `post.validator.js` | Create/update post schema (title ≤200, excerpt ≤500, content required, optional image URLs, `categoryId` uuid, `tagIds` uuid array, status enum, SEO fields ≤60/≤160, isFeatured); list query schema (page, limit, search, categoryId, tagId, status, featured, sort). |
| `project.validator.js` | Create/update project schema (title ≤150, description ≤500, technologies array min 1, optional URLs, features array, category required, dates optional, isFeatured). |
| `comment.validator.js` | Comment schema: `name` 1–100 chars (required), `content` 1–2000 chars (required), `postId` uuid in params. **No email field.** |
| `contact.validator.js` | Contact schema: name ≤100, valid email, subject ≤200, message 1–5000. |
| `newsletter.validator.js` | Subscribe/unsubscribe schema: valid email in body. **Send schema:** `subject` (required, 1–150 chars), `content` (required, HTML body). |
| _(like validation)_ | Lives in `post.validator.js`: `postId` must be a valid uuid in params for the like toggle/status routes. |

### 2.9 `src/utils/`

Pure, dependency-light helpers reused across the app. No HTTP, no Express objects (except where noted).

| File | What To Do |
|------|-----------|
| `ApiError.js` | Custom error class carrying `statusCode`, machine-readable `errorCode`, optional field `errors`, and an `isOperational` flag so the error handler knows it is safe to show. |
| `ApiResponse.js` | Helper that builds the uniform envelope `{ success, message, data }` (and the error variant) so every endpoint responds identically. |
| `asyncHandler.js` | Wrap async route handlers so rejected promises are automatically forwarded to the error middleware. |
| `slugify.js` | Turn any title into a lowercase, strict, URL-safe slug; include a uniqueness-suffix helper if two titles collide. |
| `readingTime.js` | Estimate reading minutes from post content (e.g., word count ÷ 200), minimum 1. |
| `pagination.js` | Given `page`, `limit`, `total` build the `{ page, limit, total, pages, hasNext, hasPrev }` object and clamp `limit` to a max of 50. |
| `constants.js` | App-wide constants: post statuses, roles, rate-limit numbers, allowed image MIME types, default pagination values, error codes. |

### 2.10 `src/app.js` and `src/server.js`

| File | What To Do |
|------|-----------|
| `app.js` | Build and export the Express app: load config, apply Helmet → CORS (whitelist `CLIENT_URL`, credentials on) → `express.json` → Morgan → global rate limiter → sanitize → mount `/api` routes → register `notFound` then `errorHandler`. No `listen()` here. |
| `server.js` | Entry point: import `app`, verify env vars, connect to PostgreSQL (fail fast if unreachable), then `app.listen(PORT)` and log the URL. Handle process-level `unhandledRejection`/`uncaughtException` shutdowns. |

### 2.11 `drizzle/` and `uploads/`

| Folder | What To Do |
|--------|-----------|
| `drizzle/migrations/` | Auto-generated SQL migration files from `npm run db:generate`. Never hand-edit; commit them so deploys can replay them. |
| `uploads/` | Temporary local storage for Multer files before they go to Cloudinary. Gitignored; safe to wipe at any time. |

### 2.12 `tests/`

| File / Folder | What To Do |
|---------------|-----------|
| `setup.js` | Create a connection to a dedicated `portfolio_test` database before all tests; close it after. |
| `teardown.js` | Drop/clean the test database and remove leftover data after the suite finishes. |
| `fixtures/seed.js` | Seed helper functions that insert a known admin, categories, tags, posts, and projects so tests have deterministic data. |
| `unit/services/` | Test each service method in isolation with a seeded test DB (create post ⇒ slug + reading time correct, delete ⇒ category count decremented, etc.). |
| `unit/utils/` | Test pure helpers: slug generation, reading time, pagination math, `ApiError` shape. |
| `integration/*.test.js` | Supertest against the real Express app. Cover auth (register first admin, reject second, login success/failure), posts (CRUD, search, filter, pagination, auth guards), **likes (toggle, one-per-IP enforcement, unlike)**, projects, **comments (instant visibility, rate limit, admin delete)**, contact, newsletter. Clean tables between tests. |

---

## 3. API Endpoints

### 3.1 Authentication — `/api/auth`

| Method | Endpoint | Auth | What It Does |
|--------|----------|------|--------------|
| POST | `/api/auth/register` | No | Creates the first and only admin account. Rejects with 403 once any user exists, rejects duplicate emails with 409, hashes the password, returns the user plus access + refresh tokens. |
| POST | `/api/auth/login` | No | Validates email/password, compares the bcrypt hash, updates `lastLogin`, and returns the user with a new access token while setting the refresh token as an HTTP-only cookie. |
| POST | `/api/auth/refresh` | Cookie | Reads the refresh token from the cookie, verifies it, and issues a fresh short-lived access token without requiring credentials again. |
| POST | `/api/auth/logout` | Yes | Clears the refresh-token cookie so the session ends on the client. |
| GET | `/api/auth/me` | Yes | Returns the current authenticated user's profile with the password field stripped. |
| PATCH | `/api/auth/me` | Yes | Updates the current user's name, avatar, and bio; returns the updated profile. |
| PATCH | `/api/auth/password` | Yes | Verifies the old password, hashes and stores the new one, and invalidates other sessions if applicable. |

### 3.2 Blog Posts — Public

| Method | Endpoint | Auth | What It Does |
|--------|----------|------|--------------|
| GET | `/api/posts` | No | Returns published posts with pagination and support for `?page`, `?limit`, `?search`, `?categoryId`, `?tagId`, `?featured`, `?sort=-publishedAt`. Each post includes its author, category, and tags. Only ever exposes `published` status to public callers. |
| GET | `/api/posts/featured` | No | Returns the most recent posts flagged `isFeatured: true` and published, capped at a small limit (default 5). Used by the homepage. |
| GET | `/api/posts/slug/:slug` | No | Fetches one full post by its SEO slug, including author, category, tags, SEO fields, and reading time; increments the view counter; 404 if not found or not published. |

### 3.3 Blog Posts — Admin

| Method | Endpoint | Auth | What It Does |
|--------|----------|------|--------------|
| GET | `/api/admin/posts` | Admin | Lists all posts regardless of status (draft/published/archived) for the dashboard, with pagination and a `?status` filter. |
| GET | `/api/admin/posts/:id` | Admin | Fetches a single post by ID (including drafts) for editing; 404 if missing. |
| POST | `/api/posts` | Admin | Creates a post: generates a unique slug, computes reading time, links tags, increments the category's post count, sets `publishedAt` when status is `published`. Returns 409 on slug collision. |
| PATCH | `/api/posts/:id` | Admin | Updates post fields; re-generates the slug if the title changed, recomputes reading time if content changed, replaces all tag links if `tagIds` provided, and stamps `updatedAt`. |
| PATCH | `/api/posts/:id/publish` | Admin | Sets status to `published` and stamps `publishedAt`; used by the publish/unpublish toggle in the dashboard. |
| DELETE | `/api/posts/:id` | Admin | Deletes the post (cascading comments, likes, and tag links) and decrements the category's post count. Returns the deleted record. |

### 3.4 Categories & Tags

| Method | Endpoint | Auth | What It Does |
|--------|----------|------|--------------|
| GET | `/api/categories` | No | Lists all categories with their slug and `postCount`, used for blog filter UI. |
| POST | `/api/categories` | Admin | Creates a category with an auto-generated unique slug; 409 if the name already exists. |
| PATCH | `/api/categories/:id` | Admin | Renames a category (re-slugs) or edits its description. |
| DELETE | `/api/categories/:id` | Admin | Deletes the category; blocked with 400/`restrict` if posts still reference it. |
| GET | `/api/tags` | No | Lists all tags (id, name, slug) for tag-cloud and filter UI. |
| POST | `/api/tags` | Admin | Creates a tag with a unique slug; 409 on duplicate name. |
| DELETE | `/api/tags/:id` | Admin | Deletes the tag and its junction rows (cascade). |

### 3.5 Projects

| Method | Endpoint | Auth | What It Does |
|--------|----------|------|--------------|
| GET | `/api/projects` | No | Returns projects paginated with optional `?category`, `?featured`, and `?sort` filters. |
| GET | `/api/projects/featured` | No | Returns up to 5 projects flagged as featured, newest first — for the portfolio landing section. |
| GET | `/api/projects/:slug` | No | Returns one full project by slug (technologies, screenshots, features, links) and increments its view count; 404 if missing. |
| POST | `/api/projects` | Admin | Creates a project with a unique slug from the title; 409 on collision. |
| PATCH | `/api/projects/:id` | Admin | Updates any project field and stamps `updatedAt`; 404 if the project does not exist. |
| DELETE | `/api/projects/:id` | Admin | Deletes the project and returns it; 404 if missing. |

### 3.6 Comments — Anonymous & Instant

No login, no email, no moderation queue. Visitors type a display name and their message; it appears publicly right away. Rate limiting (5/hour/IP) is the spam guard. You can delete any comment.

| Method | Endpoint | Auth | What It Does |
|--------|----------|------|--------------|
| GET | `/api/posts/:postId/comments` | No | Returns **all** comments for a post, newest first, each with just `name`, `content`, and `createdAt`. 404 if the post doesn't exist or isn't published. |
| POST | `/api/posts/:postId/comments` | No (rate-limited 5/hour/IP) | Accepts `{ name, content }`, verifies the post is published, stores the comment, and returns 201. The comment is **visible immediately** — there is nothing to approve. |
| DELETE | `/api/admin/comments/:id` | Admin | Permanently removes a comment (for abuse/junk cleanup); 404 if not found. |

### 3.7 Likes — Anonymous & IP-Based

One like per IP per post, toggleable. No cookies, no login — the server keys off the request IP. The visitor's current like state travels with every post payload as `likeCount` (and `liked` on the detail/status endpoints).

| Method | Endpoint | Auth | What It Does |
|--------|----------|------|--------------|
| POST | `/api/posts/:postId/like` | No | **Toggle.** If this IP hasn't liked the post → inserts a `post_likes` row and increments `posts.likeCount`. If it already has → removes the row and decrements the count. Returns `{ liked: true/false, likeCount }`. Handles race conditions by catching the unique-constraint violation. |
| GET | `/api/posts/:postId/like` | No | Returns the current IP's state for that post: `{ liked: boolean, likeCount }`. The frontend uses this on page load to render the heart filled/empty. |

**Notes:**
- `GET /api/posts` and `GET /api/posts/slug/:slug` include `likeCount` in every post payload.
- Deleting a post cascades and removes all its likes.

### 3.8 Contact

| Method | Endpoint | Auth | What It Does |
|--------|----------|------|--------------|
| POST | `/api/contact` | No (rate-limited) | Accepts a visitor's name, email, subject, and message, stores it as unread, optionally triggers an email notification, and returns 201. |
| GET | `/api/admin/contact` | Admin | Returns all messages newest-first with pagination and an `?unread=true` filter; used by the inbox view. |
| PATCH | `/api/admin/contact/:id/read` | Admin | Flips `isRead` to true so it no longer counts as unread; 404 if missing. |
| DELETE | `/api/admin/contact/:id` | Admin | Deletes a message from the inbox; 404 if missing. |

### 3.9 Newsletter (sending via Brevo)

| Method | Endpoint | Auth | What It Does |
|--------|----------|------|--------------|
| POST | `/api/newsletter/subscribe` | No | Subscribes an email. If already active → 409; if previously unsubscribed → reactivates the same row; otherwise inserts a new active subscriber. |
| POST | `/api/newsletter/unsubscribe` | No | Sets the subscriber's status to `unsubscribed` and stamps `unsubscribedAt`. Returns 404 for unknown emails, 400 if already unsubscribed. |
| GET | `/api/admin/newsletter` | Admin | Lists subscribers with pagination and optional `?status=active\|unsubscribed` filter. |
| DELETE | `/api/admin/newsletter/:id` | Admin | Permanently removes a subscriber from the list. |
| POST | `/api/admin/newsletter/send` | Admin | **The "Send Newsletter" button.** Accepts `{ subject, content }` (HTML), fetches all `active` subscribers, sends one email each through Brevo's REST API, and returns `{ sent, failed }` counts. 400 if no active subscribers. |

**How sending works:**
```
You publish & review a post → dashboard "Send Newsletter" button
  → POST /api/admin/newsletter/send  { subject, content }
  → newsletter.service: SELECT * FROM newsletter WHERE status = 'active'
  → email.service: POST https://api.brevo.com/v3/smtp/email   (per recipient)
       headers: { 'api-key': BREVO_API_KEY', 'content-type': 'application/json' }
       body:    { sender, to, subject, htmlContent }
  → response: { sent: 42, failed: 1 }
```

**Notes:**
- Sending is **manual only** — publishing a post does NOT auto-email anyone (prevents accidental blasts).
- Brevo free tier = **300 emails/day** — check `sent`/`failed` counts; failures are logged, never crash the request.
- Requires `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` in `.env` (key from Brevo dashboard → SMTP & API → API Keys).
- Verify your sender email in Brevo before real sends, otherwise deliverability suffers.

### 3.10 Uploads

| Method | Endpoint | Auth | What It Does |
|--------|----------|------|--------------|
| POST | `/api/upload` | Admin | Accepts a single image (JPEG/PNG/GIF/WebP, max 5 MB) via multipart form, uploads it to Cloudinary with resize/quality transforms, and returns `{ url, publicId }` for use in posts/projects. |
| DELETE | `/api/upload/:publicId` | Admin | Destroys the image on Cloudinary by its public ID. Failures are logged but do not break the request. |

### 3.11 Analytics

| Method | Endpoint | Auth | What It Does |
|--------|----------|------|--------------|
| POST | `/api/analytics/view` | No | Records a view for a post or project with IP, user agent, and referrer, and increments the corresponding `viewCount`. |
| GET | `/api/admin/analytics/stats` | Admin | Returns dashboard stats: total published posts, total projects, total comments, active subscribers, unread messages, views in the last 30 days, and the top 5 posts by view count. |

---

## 4. Cross-Cutting Conventions

- **Response envelope:** every success is `{ success: true, message, data }`; every failure is `{ success: false, message, error: { code, details? } }`.
- **Status codes:** 200 success GET/PATCH/DELETE, 201 success POST, 400 bad request, 401 auth, 403 forbidden, 404 missing, 409 duplicate, 422 validation, 429 rate limited, 500 unexpected.
- **Pagination params:** `page` (default 1), `limit` (default 10, max 50), plus `search`, `sort` (`-field` = descending).
- **Admin routes:** all under `/api/admin/*` and always behind `authenticate` + `authorize('admin')`.
- **Layer rule:** routes → controllers → services → schema. Controllers never touch `db`; services never touch `req`/`res`.
