# VolunteEditor - Frontend

## Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- A running instance of the **VolunteEditor Backend** API

---

## Getting Started

See [Vite Configuration Reference](https://vite.dev/config/).

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

---

## Sitemap

| Path | Name | Description                                     | Access |
|------|------|-------------------------------------------------|--------|
| `/` | Home | Homepage                                        | Public |
| `/organisation/list` | Organisation List | List of all Organisations                       | Public |
| `/organisation/:slug` | Organisation | Organisation's Landingpage                      | Public |
| `/task/list` | Task List | List of all Tasks                               | Public |
| `/task/:slug` | Task | Single task's details page                      | Public |
| `/org-admin` | Organisation Dashboard | Dashboard for Organisations                     | Organisation role |
| `/org-admin/organisation/editor` | Organisation Editor | Editor for the organisation's landingpage       | Organisation role |
| `/org-admin/task/editor/:slug?` | Task Editor | Editor for tasks                                | Organisation role |
| `/org-admin/task/editor/schema/:slug?` | Task Schema Editor | Editor for task schemas                         | Organisation role |
| `/org-admin/workflow/editor/:slug?` | Workflow Editor | Editor for workflows                            | Organisation role |
| `/org-admin/workflow/task-assignment` | Workflow Task Assignment | Editor for assigning tasks to a workflow | Organisation role |

> **Note:** Routes marked as *Organisation role* are protected and require the user to be authenticated with an `organisation` role. Unauthorized access redirects to the home page.

---

## Tech Stack

| Category | Technology                                                                                                                   |
|---|------------------------------------------------------------------------------------------------------------------------------|
| Framework | Vue 3                                                                                                                        |
| Build tool | Vite                                                                                                                         |
| Routing | Vue Router                                                                                                                   |
| HTTP client | Axios                                                                                                                        |
| UI | [Bootstrap 5](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/)                                                               |
| Rich text editor | [Editor.js](https://github.com/codex-team/editor.js) [(with various plugins)](https://github.com/editor-js/awesome-editorjs) |
| Flow/graph editor | [Vue Flow](https://github.com/bcakmakoglu/vue-flow)                                                                          |
| Drag & drop | [vue.draggable.next](https://github.com/SortableJS/vue.draggable.next)                                                       |
