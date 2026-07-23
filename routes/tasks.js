import express from 'express'
const router = express.Router()

const app = express()

let tasks = [
    {
        "id": 1,
        "title": "Code",
        "done": true,
    },
    {
        "id": 2,
        "title": "Study",
        "done": true,
    },
    {
        "id": 3,
        "title":"Eat",
        "done": false,
    },
]
// Return all tasks or Filter task by **DONE** status and/or search by title
router.get("/", (req, res) => {
    const { done, search } = req.query

    let filtered = tasks

    if (done !== undefined) {
        filtered = filtered.filter((task) => task.done === (done === 'true'))
    }
    
    if (search !== undefined) {
        filtered = filtered.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    }

    if (filtered.length === 0 && (done !== undefined || search !== undefined)) {
        return res.status(404).json({ error: "No tasks found matching the criteria" })
    }

    res.send(filtered)
})

// Return id specified task
router.get("/:id", (req,res) => {
    const { id } = req.params

    const findTaskId = tasks.find((task) => task.id === Number(id)) 
    if (!findTaskId) {
       return res.status(404).json({error: `Task ${id} not found`})
    }

    res.send(findTaskId)
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