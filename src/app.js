const express = require('express');
const { exec } = require('child_process');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

// VULNERABILITY: Hardcoded secrets (Secret Scanning will catch this)
const AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
const DB_PASSWORD = "supersecretadminpassword123";

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: DB_PASSWORD,
  database: 'testdb'
});

app.use(express.json());

app.get('/api/users', (req, res) => {
    const username = req.query.username;
    // VULNERABILITY: SQL Injection (SAST will catch this)
    // Directly concatenating user input into a SQL query.
    const query = "SELECT * FROM users WHERE username = '" + username + "'";

    // Note: Not actually connecting to a DB to keep the app runnable locally without setup.
    res.send(`Executed query: ${query}`);
});

app.post('/api/ping', (req, res) => {
    const ip = req.body.ip;
    
    // VULNERABILITY: OS Command Injection (SAST will catch this)
    // Directly executing user input in a shell environment.
    exec('ping -c 4 ' + ip, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error: ${error.message}`);
        }
        if (stderr) {
            return res.status(500).send(`Stderr: ${stderr}`);
        }
        res.send(`<pre>${stdout}</pre>`);
    });
});

app.get('/', (req, res) => {
    res.send('Vulnerable Node.js App Running. Do not deploy to production!');
});

app.listen(port, () => {
    console.log(`Vulnerable app listening at http://localhost:${port}`);
    console.log(`Using AWS Key: ${AWS_ACCESS_KEY_ID}`); // Simulated usage
});
