// Import required packages
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path module

// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON data in the body of requests

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public'))); // Ensure your index.html is in the 'public' directory

// MySQL Database connection
const db = mysql.createConnection({
    host: 'localhost', // Your MySQL host, usually 'localhost'
    user: 'root',      // Your MySQL username
    password: '',      // Your MySQL password
    database: 'date_website' // Your MySQL database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Simple route to check server status
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve index.html on root route
});

// API to store date confirmation (Yes/No)
app.post('/submit-answer', (req, res) => {
    const { wantsDate } = req.body;
    const query = 'INSERT INTO date_responses (wants_date) VALUES (?)';

    db.query(query, [wantsDate], (err, result) => {
        if (err) {
            console.error('Error saving answer:', err);
            return res.status(500).send('Database error');
        }
        res.status(200).send({ id: result.insertId });
    });
});

// API to store date and time
app.post('/submit-date-time', (req, res) => {
    const { id, date, time } = req.body;
    const query = 'UPDATE date_responses SET date = ?, time = ? WHERE id = ?';

    db.query(query, [date, time, id], (err) => {
        if (err) {
            console.error('Error saving date/time:', err);
            return res.status(500).send('Database error');
        }
        res.status(200).send('Date and time saved');
    });
});

// API to store meal choice
app.post('/submit-meal', (req, res) => {
    const { id, mealChoice } = req.body;
    const query = 'UPDATE date_responses SET meal_choice = ? WHERE id = ?';

    db.query(query, [mealChoice, id], (err) => {
        if (err) {
            console.error('Error saving meal choice:', err);
            return res.status(500).send('Database error');
        }
        res.status(200).send('Meal choice saved');
    });
});

// Set the port for the server to run
const PORT = process.env.PORT || 3000; // Use environment variable for PORT
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
