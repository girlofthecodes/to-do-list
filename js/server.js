const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);

    fs.readFile('tasks.csv', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        const rows = data.split('\n');
        const header = rows[0];
        const filteredRows = rows.filter(row => {
            const [id] = row.split(',');
            return parseInt(id, 10) !== taskId;
        });

        const updatedData = [header, ...filteredRows].join('\n');
        
        fs.writeFile('tasks.csv', updatedData, 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error writing file');
            }
            res.sendStatus(200);
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
