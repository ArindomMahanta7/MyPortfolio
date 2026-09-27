# Build Order — Portfolio & Blog Backend

Follow this sequence exactly. Each file only depends on files created **above** it.

**Pattern for every feature slice:** `validator → service → controller → route`

---

## Phase 1: Project Setup (root files)

| # | File | What To Do |
|---|------|-----------|
| 1 | `package.json` | Set `"type": "module"`. Fix scripts (`dev`, `start`, `db:generate`, `db:migrate`, `db:push`, `db:studio`, `test`, `lint`, `format`). Install deps: `express drizzle-orm pg bcrypt jsonwebtoken zod helmet cors express-rate-limit morgan dotenv cloudinary multer slugify` + dev: `jest supertest eslint prettier`. |
| 2 | `.env` / `.env.example` | Verify all keys exist: `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`, Cloudinary keys, `CLIENT_URL`. |
| 3 | `.eslintrc.json` | ES modules + Node globals, unused-var and error-prone rules. |
| 4 | `.prettierrc` | Consistent formatting (semicolons, quotes, width). |
| 5 | `drizzle.config.js` | Schema `./src/schema/*.js`, out `./drizzle/migrations`, dialect `postgresql`, url from `DATABASE_URL`. |
| 6 | folders | `src/{config,schema,utils,middlewares,controllers,services,validators,routes}`, `drizzle/migrations`, `uploads`, `tests/{unit/services,unit/utils,integration,fixtures}` |

---

## Phase 2: Config — `src/config/`

| # | File | What To Do | Depends On |
|---|------|-----------|-----------|
| 7 | `env.js` | Load + validate env vars, fail fast, export frozen config. | — |
| 8 | `db.js` | Create `postgres` client, wrap with `drizzle()` + schema, export `db`. | `env.js` |
| 9 | `logger.js` | Morgan request logger, dev/prod formats. | — |
| 10 | `cloudinary.js` | Configure Cloudinary SDK from env keys. | `env.js` |

---

## Phase 3: Database — `src/schema/`

Create in this order (FKs reference earlier tables):

| # | File | Table |
|---|------|-------|
| 11 | `user.schema.js` | `users` |
| 12 | `category.schema.js` | `categories` |
| 13 | `tag.schema.js` | `tags` |
| 14 | `post.schema.js` | `posts` (FK → users, categories) |
| 15 | `postTag.schema.js` | `posts_tags` (FK → posts, tags) |
| 16 | `comment.schema.js` | `comments` (FK → posts) — anonymous, instant |
| 17 | `like.schema.js` | `post_likes` (FK → posts, UNIQUE postId+ipAddress) |
| 18 | `project.schema.js` | `projects` |
| 19 | `contact.schema.js` | `contacts` |
| 20 | `newsletter.schema.js` | `newsletter` |
| 21 | `view.schema.js` | `views` (FK → posts, projects) + indexes |
| 22 | `relations.js` | All Drizzle relations |
| 23 | `index.js` | Re-export everything |

```bash
# ⚙️ AFTER step 23:
npm run db:generate    # generate SQL from schemas
npm run db:migrate     # apply to database
npm run db:studio      # verify tables visually
```

---

## Phase 4: Utils — `src/utils/`

No dependencies — safe to build anytime before middlewares.

| # | File | What To Do |
|---|------|-----------|
| 24 | `ApiError.js` | Custom error: statusCode, errorCode, errors, isOperational. |
| 25 | `ApiResponse.js` | Uniform `{ success, message, data }` envelope builders. |
| 26 | `asyncHandler.js` | Wrap async handlers → forward rejections to error middleware. |
| 27 | `constants.js` | Post statuses, roles, rate limits, MIME types, defaults. |
| 28 | `slugify.js` | Title → URL-safe slug + uniqueness suffix helper. |
| 29 | `readingTime.js` | Content → minutes (words ÷ 200, min 1). |
| 30 | `pagination.js` | page/limit/total → `{ page, limit, total, pages, hasNext, hasPrev }`. |

---

## Phase 5: Middlewares — `src/middlewares/`

| # | File | What To Do | Depends On |
|---|------|-----------|-----------|
| 31 | `errorHandler.middleware.js` | Format ApiError / PG errors / JWT errors → JSON. | `ApiError`, `env` |
| 32 | `notFound.middleware.js` | 404 catch-all. | `ApiResponse` |
| 33 | `validate.middleware.js` | `validate(schema)` factory using Zod → 422 on fail. | — |
| 34 | `auth.middleware.js` | Verify Bearer JWT, load user, set `req.user`. | `db`, `env`, `ApiError` |
| 35 | `authorize.middleware.js` | `authorize(...roles)` → 403 if role mismatch. | `ApiError` |
| 36 | `rateLimiter.middleware.js` | apiLimiter (100/15m), authLimiter (10/15m), commentLimiter (5/h). | `express-rate-limit` |
| 37 | `sanitize.middleware.js` | Trim strings, lowercase emails, strip harmful chars. | — |
| 38 | `upload.middleware.js` | Multer memory storage, image MIME filter, 5 MB limit. | `multer`, `ApiError` |

---

## Phase 6: App Wiring — server boots

| # | File | What To Do |
|---|------|-----------|
| 39 | `src/app.js` | Express app: Helmet → CORS → json → Morgan → rate limit → sanitize → mount `/api` routes → notFound → errorHandler. Export, no `listen()`. |
| 40 | `src/routes/index.js` | Skeleton router — mount feature routers one by one as they're built. |
| 41 | `src/server.js` | Entry: validate env → connect DB (fail fast) → `app.listen(PORT)`. |

```bash
# ✅ CHECKPOINT: npm run dev → server boots, DB connects
```

---

## Phase 7: Feature Slices

Repeat for each feature: **validator → service → controller → routes**, then test before moving on.

### 7A. Auth
| # | File |
|---|------|
| 42 | `validators/auth.validator.js` |
| 43 | `services/auth.service.js` |
| 44 | `controllers/auth.controller.js` |
| 45 | `routes/auth.routes.js` |

✅ Test: register (first admin), login, refresh, `/me`.

### 7B. Blog Posts + Categories/Tags + Likes
| # | File |
|---|------|
| 46 | `validators/post.validator.js` |
| 47 | `services/post.service.js` *(biggest file — CRUD, search, filters, slug, reading time, tags)* |
| 48 | `controllers/post.controller.js` *(also category/tag CRUD + like handlers)* |
| 49 | `routes/post.routes.js` |

✅ Test: post CRUD, search/filter/pagination.

| # | File |
|---|------|
| 50 | `services/like.service.js` *(toggle: insert/delete row + likeCount sync)* |

✅ Test: like → unlike → one-per-IP enforcement.

### 7C. Comments (anonymous, instant)
| # | File |
|---|------|
| 51 | `validators/comment.validator.js` |
| 52 | `services/comment.service.js` |
| 53 | `controllers/comment.controller.js` |
| 54 | `routes/comment.routes.js` |

✅ Test: comment appears instantly; rate limit blocks 6th in an hour.

### 7D. Projects
| # | File |
|---|------|
| 55 | `validators/project.validator.js` |
| 56 | `services/project.service.js` |
| 57 | `controllers/project.controller.js` |
| 58 | `routes/project.routes.js` |

✅ Test: project CRUD, public list.

### 7E. Contact
| # | File |
|---|------|
| 59 | `validators/contact.validator.js` |
| 60 | `services/contact.service.js` |
| 61 | `controllers/contact.controller.js` |
| 62 | `routes/contact.routes.js` |

### 7F. Newsletter
| # | File |
|---|------|
| 63 | `validators/newsletter.validator.js` |
| 64 | `services/newsletter.service.js` |
| 65 | `controllers/newsletter.controller.js` |
| 66 | `routes/newsletter.routes.js` |

### 7G. Uploads
| # | File |
|---|------|
| 67 | `services/image.service.js` |
| 68 | `routes/upload.routes.js` |

✅ Test: upload image → get Cloudinary URL → delete it.

### 7H. Analytics
| # | File |
|---|------|
| 69 | `services/analytics.service.js` |
| 70 | `controllers/analytics.controller.js` |
| 71 | `routes/analytics.routes.js` |

✅ Test: view recording, dashboard stats.

---

## Phase 8: Tests & Polish

| # | File | What To Do |
|---|------|-----------|
| 72 | `tests/setup.js` + `tests/teardown.js` | Connect/clean test database. |
| 73 | `tests/fixtures/seed.js` | Seed admin, categories, tags, posts, projects. |
| 74 | `tests/integration/*.test.js` | auth → posts → likes → comments → projects → contact → newsletter. |
| 75 | `README.md` | Setup steps, env vars, scripts. |

---

## Quick Reference

```
Phase 1-2  →  server config + DB connection
Phase 3    →  tables exist (generate + migrate)
Phase 4-5  →  helpers + middleware ready
Phase 6    →  ✅ server boots (first checkpoint)
Phase 7    →  features one slice at a time (test each)
Phase 8    →  tests + docs
```

**Rule:** never start a layer before the layer it imports from is done:
`routes → controller → service → schema` (imports flow downward).
