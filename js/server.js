const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

// Servir archivos estáticos desde las carpetas js y css
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));

// Ruta para servir archivos HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/task', (req, res) => {
    res.sendFile(path.join(__dirname, '../task.html'));
});

// Cargar tareas desde el archivo JSON
function loadTasks() {
    const tasksFilePath = path.join(__dirname, '../js/tasks.json');
    if (fs.existsSync(tasksFilePath)) {
        const data = fs.readFileSync(tasksFilePath);
        return JSON.parse(data);
    }
    return [];
}

// Guardar tareas en el archivo JSON
function saveTasks(tasks) {
    const tasksFilePath = path.join(__dirname, '../js/tasks.json');
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
}

let taskCounter = 0;

// Manejar la solicitud POST para crear una tarea
app.post('/task', (req, res) => {
    const { _task, _detail, _date, _time } = req.body;

    let tasks = loadTasks();
    const newId = ++taskCounter;
    const newTask = {
        _id: newId,
        _task,
        _detail,
        _date,
        _time
    };

    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask); // Devuelve la nueva tarea creada
});

// Ruta para manejar la eliminación de tareas
app.delete('/task', (req, res) => {
    const id = parseInt(req.query.id, 10); // Extraer el ID de la query string

    let tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task._id === id);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1); // Eliminar la tarea del array
        saveTasks(tasks);
        res.send('Tarea eliminada con éxito');
    } else {
        res.status(404).send('Tarea no encontrada');
    }
});

// Ruta para manejar la actualización de tareas
app.patch('/task', (req, res) => {
    const { _task, _detail, _date, _time, _id } = req.body;
    const taskId = parseInt(_id, 10);

    let tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task._id === taskId);

    if (taskIndex !== -1) {
        // Actualiza solo los campos permitidos, el ID se mantiene inmutable
        tasks[taskIndex] = { _id: taskId, _task, _detail, _date, _time };
        saveTasks(tasks);
        res.status(200).json({ message: 'Tarea actualizada con éxito' });
    } else {
        res.status(404).json({ message: 'Tarea no encontrada' });
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor en ejecución en el puerto 3000');
});
