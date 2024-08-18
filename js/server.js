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

app.post('/task', (req, res) => {
    const newTask = req.body; 
    const tasksFilePath = path.join(__dirname, '../js/tasks.json'); // Ruta al archivo JSON
    fs.readFile(tasksFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo');
        }

        let tasks = JSON.parse(data);
        tasks.push(newTask);
        fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error al escribir el archivo');
            }
            res.send('Tarea creada con éxito');
        });
    });
});

// Ruta para manejar la eliminación de tareas
app.delete('/task', (req, res) => {
    const id = req.query.id; // Extraer el ID de la query string
    const tasksFilePath = path.join(__dirname, '../js/tasks.json'); // Ruta al archivo JSON

    fs.readFile(tasksFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo');
        }

        let tasks = JSON.parse(data);
        const taskIndex = tasks.findIndex(task => task._id == id);

        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1); // Eliminar la tarea del array

            fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al escribir el archivo');
                }

                res.send('Tarea eliminada con éxito');
            });
        } else {
            res.status(404).send('Tarea no encontrada');
        }
    });
});

// Ruta para manejar la actualización de tareas
app.patch('/task', (req, res) => {
    const { _task, _detail, _date, _time } = req.body;
    const id = req.query.id; // Extraer el id de la query string
    const tasksFilePath = path.join(__dirname, '../js/tasks.json'); // Ruta al archivo JSON

    fs.readFile(tasksFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo');
        }

        let tasks = JSON.parse(data);
        const taskIndex = tasks.findIndex(task => task._id == id);

        if (taskIndex !== -1) {
            tasks[taskIndex] = { _id: id, _task, _detail, _date, _time }; // Actualizar la tarea

            fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al escribir el archivo');
                }

                res.send('Tarea actualizada con éxito');
            });
        } else {
            res.status(404).send('Tarea no encontrada');
        }
    });
});
// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor en ejecución en el puerto 3000');
});