const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const db = new sqlite3.Database('./passwords.db');

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS passwords (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            password TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `);

});

app.post('/save-password', (req, res) => {

    const { password } = req.body;

    db.run(

        'INSERT INTO passwords (password) VALUES (?)',

        [password],

        (err) => {

            if (err) {

                console.log(err);

                res.status(500).send(
                    'Error saving password'
                );

            } else {

                res.send('Password saved!');

            }

        }

    );

});

app.get('/passwords', (req, res) => {

    db.all(

        'SELECT * FROM passwords ORDER BY id DESC',

        [],

        (err, rows) => {

            if (err) {

                console.log(err);

                res.status(500).send(
                    'Error loading passwords'
                );

            } else {

                res.json(rows);

            }

        }

    );

});

app.listen(PORT, () => {

    console.log(
        `Server started on http://localhost:${PORT}`
    );

});