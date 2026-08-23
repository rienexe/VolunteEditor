# VolunteEditor - Backend

## Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

---

## Getting Started

### Project Setup

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Compile and Minify for Production

```sh
npm run build
```

The server will start on **http://localhost:3000** by default.  
You can override the port by setting the `PORT` environment variable:
```bash
PORT=8080 npm start
```

---

## Sitemap

All API routes are prefixed with `/api`.

### Authentication
| Method | Endpoint         | Description          |
|--------|-----------------|----------------------|
| POST   | `/api/auth/login` | Log in as a volunteer or organisation user |

### Organisations
| Method | Endpoint                        | Description                                         |
|--------|---------------------------------|-----------------------------------------------------|
| GET    | `/api/organisations`            | List all organisations (supports `?withTaskCount=true`) |
| GET    | `/api/organisations/:identifier` | Get a single organisation by ID or slug             |
| POST   | `/api/organisations/:orgId`     | Create or update an organisation                    |

### Organisation Profiles
| Method | Endpoint                                | Description                                   |
|--------|-----------------------------------------|-----------------------------------------------|
| GET    | `/api/organisations/profiles/:identifier` | Get an organisation's rich block-content profile by ID or slug |
| POST   | `/api/organisations/profiles/:orgId`     | Save an organisation's profile                |

### Tasks
| Method | Endpoint                           | Description                                           |
|--------|------------------------------------|-------------------------------------------------------|
| GET    | `/api/tasks`                       | List all tasks                                        |
| GET    | `/api/tasks/:identifier`           | Get a task by slug, or all tasks for an organisation  |
| POST   | `/api/tasks/:slug`                 | Create or update a task                               |
| POST   | `/api/tasks/update-workflow-slugs` | Batch-update workflow slug references on tasks        |
| PATCH  | `/api/tasks/:slug/block-content`   | Update only the block content of a task               |
| DELETE | `/api/tasks/:slug`                 | Delete a task                                         |
| GET    | `/api/tasks/:slug/volunteers`      | List volunteers assigned to a task                    |
| POST   | `/api/tasks/:slug/volunteers`      | Assign volunteer(s) to a task                         |
| DELETE | `/api/tasks/:slug/volunteers`      | Remove volunteer(s) from a task                       |

### Task Schemas
| Method | Endpoint                       | Description                                              |
|--------|--------------------------------|----------------------------------------------------------|
| GET    | `/api/tasks/schemas`           | List all task schemas                                    |
| GET    | `/api/tasks/schemas/:identifier` | Get a task schema by slug or by organisation ID        |
| POST   | `/api/tasks/schemas/:slug`     | Create or update a task schema                           |
| DELETE | `/api/tasks/schemas/:slug`     | Delete a task schema                                     |

### Workflows
| Method | Endpoint                     | Description                                              |
|--------|------------------------------|----------------------------------------------------------|
| GET    | `/api/workflows`             | List all workflows                                       |
| GET    | `/api/workflows/:identifier` | Get a workflow by slug or by organisation ID             |
| POST   | `/api/workflows/:slug`       | Create or update a workflow                              |
| DELETE | `/api/workflows/:slug`       | Delete a workflow                                        |

### Utility Endpoints
| Method | Endpoint          | Description                                             |
|--------|-------------------|---------------------------------------------------------|
| POST   | `/upload`         | Upload an image file (returns hosted URL)               |
| POST   | `/upload/:type`   | Upload a typed image (`logo` or `general`)              |
| GET    | `/fetchUrl`       | Fetch metadata for a given URL (`?url=...`)             |

---

## Data Storage

The application uses **flat JSON files** as its data store, located in the `data/` directory:

| File                        | Contents                         |
|-----------------------------|----------------------------------|
| `data/users.json`           | Organisation and volunteer users |
| `data/organisations.json`   | Organisation records             |
| `data/organisation-profiles.json` | Profiles for organisations       |
| `data/tasks.json`           | Volunteer tasks                  |
| `data/task-schemas.json`    | Task schemas                     |
| `data/workflows.json`       | Workflows                        |

> **Note:** Uploaded images are stored under `public/images/uploads/`.

---

## 🛠️ Tech Stack

| Technology    | Purpose |
|---------------|---|
| Node.js       | Runtime environment |
| Express       | Web framework & routing |
| Morgan        | HTTP request logging |
| CORS          | Cross-Origin Resource Sharing |
| cookie-parser | Cookie parsing middleware |
| Multer        | Multipart file upload handling |
| Sharp         | Image processing |
| Axios         | HTTP client |
| Cheerio       | Server-side HTML parsing |
| uuid          | Unique ID generation (e.g. filenames) |
| slugify       | URL slug generation |
| debug         | Debug logging utility |
