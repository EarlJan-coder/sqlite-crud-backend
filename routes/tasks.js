import express from 'express'
import db from '../tasks-db.js'

const router = express.Router()

const normalizeDone = (value) => {
    if(value === undefined) return undefined
    if(value === true || value === 1 || value === "1") return 1
    if(value === false || value === 0 || value === "0") return 0
    return null
}

// Return all tasks or Filter task by **DONE** status and/or search by title
router.get("/", (req, res) => {
    const { done, search } = req.query

    let query = "SELECT * FROM tasks WHERE 1=1"
    const params = []

    if (done === "true") {
        query += " AND done = 1"
    } else if(done === "false"){
        query += " AND done = 0"
    }

    if (search) {
        query += " AND title LIKE ?"
        params.push(`%${search}%`)
    }

    const rows = db.prepare(query).all(...params)
    res.json(rows)
})

// Return id specified task
router.get("/:id", (req,res) => {
    const { id } = req.params

    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id)

    if (!task) {
        return res.status(404).json({ error: `Task ${id} not found` })
    }

    res.send(task)
})

// Create task
router.post("/new", (req, res) => {
    const { title, done } = req.body

    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Task title can not be empty" })
    }

    const doneValue = normalizeDone(done)
    if (done !== undefined && doneValue === null) {
        return res.status(400).json({ error: "done must be true/false or 0/1" })
    }

    const result = db
    .prepare("INSERT INTO tasks (title, done) VALUES (?, ?)")
    .run(title.trim(), doneValue ?? 0)

    const newTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid)

    res.status(201).json(newTask)
})

// Delete task
router.delete("/delete/:id", (req, res) => {
    const { id } = req.params

    const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(id)

    if (result.changes===0) {
        return res.status(404).json({ error: "Task not found" })
    }

    res.status(204).end()
})

// Update task
router.put("/update/:id", (req, res) => {
    const { id } = req.params
    const { title, done } = req.body

    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id)
    if (!task) {
        return res.status(404).json({ error: "Task not found" })
    }
    if (title === undefined && done === undefined) {
        return res.status(400).json({ error: "Nothing to update" })
    }
    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
        return res.status(400).json({ error: "Task title can not be empty" })
    }

    const doneValue = normalizeDone(done)
    if (done !== undefined && doneValue === null) {
        return res.status(400).json({ error: "done must be true/false or 0/1" })
    }

    const nextTitle = title !== undefined ? title.trim() : task.title
    const nextDone = done !== undefined ? doneValue : task.done

    db.prepare("UPDATE tasks SET title = ?, done = ?, WHERE id = ?").run(nextTitle, nextDone, id)

    const updatedTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id)
    res.json(updatedTask)
})


export default router