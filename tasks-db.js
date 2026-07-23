import Database from "better-sqlite3"

const db = new Database('tasks.db')
console.log('Opened database file: tasks.db')

db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title NOT NULL,
        done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0,1))
    );
`).run()
console.log('Table "tasks" verified or created successfully')

const row = db.prepare('SELECT COUNT(*) AS count FROM tasks').get()

if (row.count === 0) {
  console.log('Table is empty. Seeding three example tasks...');

  const insertStatement = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  const seedTransaction = db.transaction((tasksList) => {
    for (const task of tasksList) {
      insertStatement.run(task.title, task.done);
    }
  });

  seedTransaction([
    { title: 'Buy groceries', done: 0 },
    { title: 'Clean the house', done: 1 },
    { title: 'Call the doctor', done: 0 }
  ]);

  console.log('Example tasks successfully added.');
}else{
    console.log(`Table already contains ${row.count} tasks. Skipping seed step`)
}
