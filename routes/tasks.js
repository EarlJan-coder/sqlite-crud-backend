import express from 'express'
import db from '../tasks-db.js'

const router = express.Router()

// Return all tasks or Filter task by **DONE** status and/or search by title
router.get("/", (req, res) => {
    const rows = db.prepare('SELECT * FROM tasks').all()
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
    const task = req.body

    if (!task.title) {
        return res.status(400).json({ error: "Task title can not be empty" })
    }

    tasks.push({ id:tasks.length + 1, ...task, done: false })

    res.status(201).json(`${task.title} has been added to the tasks`)
})

// Delete task
router.delete("/delete/:id", (req, res) => {
    const { id } = req.params

    const taskExists = tasks.some((task) => task.id === Number(id))

    if (!taskExists) {
        return res.status(404).send("Task not found")
    }

    tasks = tasks.filter((task) => task.id !== Number(id))

    res.status(204).end()
})

// Update task
router.put("/update/:id", (req, res) => {
    const { id } = req.params
    const { title, done } = req.body

    const task = tasks.find((task) => task.id === Number(id))

    if (!task) {
        return res.status(404).send("Task not found")
    }

    if(title !==undefined) task.title = title
    if(done !==undefined) task.done = done

    res.send(`Task with id: ${id} has been updated`)
})


export default router