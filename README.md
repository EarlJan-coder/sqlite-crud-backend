# Task API

A simple RESTful API for managing tasks built with Express.js. This API supports full **CRUD** operations (Create, Read, Update, Delete) and includes filtering capabilities.

## What is CRUD?

- **C**reate - Add new tasks
- **R**ead - View all tasks or specific tasks
- **U**pdate - Modify existing tasks
- **D**elete - Remove tasks

## Prerequisites

Before you begin, make sure you have installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (comes with Node.js)

Check your versions by running:

```bash
node --version
npm --version
```

## Installation

1. Clone or download this project

2. Open a terminal in the project folder

3. Install dependencies:

```bash
npm install
```

## Running the Server

Start the development server:

```bash
npm run dev
```

You should see:

```
Server running on port: http://localhost:3000
```

The server will automatically restart when you make changes (thanks to nodemon).

## API Endpoints

### Base URL

```
http://localhost:3000
```

---

### Health Check

Check if the server is running.

```
GET /health
```

**Response:**

```json
{
  "status": "ok"
}
```

---

### List All Tasks

Get all tasks in the system.

```
GET /tasks
```

**Response:**

```json
[
  {
    "id": 1,
    "title": "Code",
    "done": true
  },
  {
    "id": 2,
    "title": "Study",
    "done": true
  },
  {
    "id": 3,
    "title": "Eat",
    "done": false
  }
]
```

---

### Filter Tasks

Filter tasks by completion status, search by title, or both.

```
GET /tasks?done=true
GET /tasks?search=code
GET /tasks?done=false&search=eat
```

**Query Parameters:**

| Parameter | Type | Description | Example Values |
|-----------|------|-------------|----------------|
| `done` | string | Filter by completion status | `true`, `false` |
| `search` | string | Search tasks by title (case-insensitive) | `code`, `study` |

**Examples:**

1. Get only completed tasks:

```bash
curl http://localhost:3000/tasks?done=true
```

2. Get only incomplete tasks:

```bash
curl http://localhost:3000/tasks?done=false
```

3. Search for tasks containing "code":

```bash
curl http://localhost:3000/tasks?search=code
```

4. Combine filters - incomplete tasks containing "ea":

```bash
curl http://localhost:3000/tasks?done=false&search=ea
```

**Response when no tasks match:**

```json
{
  "error": "No tasks found matching the criteria"
}
```

---

### Get Single Task

Get a specific task by its ID.

```
GET /tasks/:id
```

**Example:**

```bash
curl http://localhost:3000/tasks/1
```

**Response:**

```json
{
  "id": 1,
  "title": "Code",
  "done": true
}
```

**Error if task not found:**

```json
{
  "error": "Task 1 not found"
}
```

---

### Create New Task

Add a new task to the list.

```
POST /tasks/new
```

**Request Body:**

```json
{
  "title": "Buy groceries"
}
```

> Note: The `done` field is automatically set to `false` for new tasks.

**Example:**

```bash
curl -X POST http://localhost:3000/tasks/new -H "Content-Type: application/json" -d '{"title": "Buy groceries"}'
```

**Response (201 Created):**

```
Buy groceries has been added to the tasks
```

**Error if title is missing:**

```json
{
  "error": "Task title can not be empty"
}
```

---

### Update Task

Update an existing task's title or completion status.

```
PUT /tasks/update/:id
```

**Request Body (include only fields you want to update):**

```json
{
  "title": "Updated title",
  "done": true
}
```

**Examples:**

1. Update only the title:

```bash
curl -X PUT http://localhost:3000/tasks/update/1 -H "Content-Type: application/json" -d '{"title": "New title"}'
```

2. Mark task as complete:

```bash
curl -X PUT http://localhost:3000/tasks/update/1 -H "Content-Type: application/json" -d '{"done": true}'
```

3. Update both title and status:

```bash
curl -X PUT http://localhost:3000/tasks/update/1 -H "Content-Type: application/json" -d '{"title": "Done!", "done": true}'
```

**Response:**

```
Task with id: 1 has been updated
```

**Error if task not found:**

```
Task not found
```

---

### Delete Task

Remove a task from the system.

```
DELETE /tasks/delete/:id
```

**Example:**

```bash
curl -X DELETE http://localhost:3000/tasks/delete/1
```

**Response (204 No Content):**

No response body on success.

**Error if task not found:**

```
Task not found
```

---

## Swagger Documentation

Interactive API documentation is available at:

```
http://localhost:3000/docs
```

Open this URL in your browser to explore and test the API visually.

## Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /tasks | List all tasks |
| GET | /tasks?done=true | Get completed tasks |
| GET | /tasks?done=false | Get incomplete tasks |
| GET | /tasks?search=text | Search tasks by title |
| GET | /tasks/:id | Get task by ID |
| POST | /tasks/new | Create new task |
| PUT | /tasks/update/:id | Update task |
| DELETE | /tasks/delete/:id | Delete task |

## Troubleshooting

**Port already in use:**

If you see `EADDRINUSE`, another process is using port 3000. Either stop that process or change the port in `server.js`.

**Cannot find module:**

Run `npm install` again to reinstall dependencies.

**Server not restarting:**

Make sure you ran `npm run dev` (not just `node server.js`) to use nodemon for auto-restart.
# sqlite-crud-backend
