# Task API

A small Express and SQLite task API with CRUD routes, filtering, and Swagger docs.

## Overview

The app uses a local SQLite database file called `tasks.db`. On first run it creates the `tasks` table and seeds three example tasks if the table is empty.

## Requirements

- Node.js 18 or higher
- npm

## Install

```bash
npm install
```

## Run

Start the development server with:

```bash
npm run dev
```

The server listens on port `3000`.

## Endpoints

Base URL: `http://localhost:3000`

### `GET /`

Returns basic app metadata.

Response:

```json
{
  "name": "Task API",
  "version": "1.0",
  "endpoints": ["/tasks"]
}
```

### `GET /health`

Health check endpoint.

Response:

```json
{
  "status": "ok"
}
```

### `GET /tasks`

Returns all tasks.

Query parameters:

- `done=true` to return completed tasks
- `done=false` to return incomplete tasks
- `search=<text>` to search task titles with `LIKE`
- Both filters can be combined

Examples:

```bash
curl http://localhost:3000/tasks
curl http://localhost:3000/tasks?done=true
curl http://localhost:3000/tasks?search=code
curl http://localhost:3000/tasks?done=false&search=ea
```

Response:

```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "done": 0
  }
]
```

If no rows match, the route returns an empty array.

### `GET /tasks/:id`

Returns a single task by ID.

Example:

```bash
curl http://localhost:3000/tasks/1
```

Successful response:

```json
{
  "id": 1,
  "title": "Buy groceries",
  "done": 0
}
```

If the task does not exist, the API returns:

```json
{
  "error": "Task 1 not found"
}
```

### `POST /tasks/new`

Creates a new task.

Request body:

```json
{
  "title": "Buy groceries",
  "done": false
}
```

The `title` field is required. The `done` field is optional and accepts `true`, `false`, `1`, or `0`. When omitted, `done` defaults to `0`.

Example:

```bash
curl -X POST http://localhost:3000/tasks/new -H "Content-Type: application/json" -d '{"title":"Buy groceries"}'
```

Success response is the created task object with status `201`.

Example response:

```json
{
  "id": 4,
  "title": "Buy groceries",
  "done": 0
}
```

Validation errors:

```json
{
  "error": "Task title can not be empty"
}
```

```json
{
  "error": "done must be true/false or 0/1"
}
```

### `PUT /tasks/update/:id`

Updates an existing task.

Request body can include `title`, `done`, or both:

```json
{
  "title": "Updated title",
  "done": true
}
```

Examples:

```bash
curl -X PUT http://localhost:3000/tasks/update/1 -H "Content-Type: application/json" -d '{"title":"New title"}'
curl -X PUT http://localhost:3000/tasks/update/1 -H "Content-Type: application/json" -d '{"done":true}'
curl -X PUT http://localhost:3000/tasks/update/1 -H "Content-Type: application/json" -d '{"title":"Done!","done":true}'
```

Validation and not-found responses:

```json
{
  "error": "Task not found"
}
```

```json
{
  "error": "Nothing to update"
}
```

```json
{
  "error": "Task title can not be empty"
}
```

```json
{
  "error": "done must be true/false or 0/1"
}
```

Successful response is the updated task object.

### `DELETE /tasks/delete/:id`

Deletes a task by ID.

Example:

```bash
curl -X DELETE http://localhost:3000/tasks/delete/1
```

Success returns status `204` with no response body.

If the task does not exist, the API returns:

```json
{
  "error": "Task not found"
}
```

## Swagger Docs

Interactive API documentation is available at:

```bash
http://localhost:3000/docs
```

## Quick Reference

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | / | App metadata |
| GET | /health | Health check |
| GET | /tasks | List or filter tasks |
| GET | /tasks/:id | Get a task by ID |
| POST | /tasks/new | Create a task |
| PUT | /tasks/update/:id | Update a task |
| DELETE | /tasks/delete/:id | Delete a task |

## Notes

- Task rows store `done` as `0` or `1` in SQLite.
- The database is created automatically if it does not exist.
- Example seed data is only added when the table is empty.
