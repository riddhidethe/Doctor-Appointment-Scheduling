const mysql = require('mysql');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'HTML')));
app.use("/CSS", express.static("CSS"));
app.use("/ASSETS", express.static(path.join(__dirname, "ASSETS")));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RJAH#1234@md',
    database: 'doctor_appointment'
});

connection.connect(function (error) {
    if (error) {
        console.error("Connection Error:", error);
        throw error;
    } else {
        console.log("Connection Successful!");
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "HTML", 'mainpage1.html'));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "HTML", 'login.html'));
});

app.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    connection.query("SELECT * FROM users WHERE username = ? AND password = ?", [email, password], (error, results, fields) => {
        if (error) {
            console.error("Error in login query:", error);
            res.redirect('/login');
        } else {
            console.log("Email:", email);
            console.log("Password:", password);
            console.log("Login query results:", results);

            if (results.length > 0) {
                req.session.loggedIn = true;
                res.redirect('/');
            } else {
                console.log("Invalid username or password");
                res.redirect('/signup');
            }
        }
    });
});

app.get('/checkLoginStatus', function (req, res) {
    res.json({ loggedIn: req.session.loggedIn });
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "HTML", 'signup.html'));
});

app.post('/signup', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var con_password = req.body.con_password;

    if (password === con_password) {
        connection.query("INSERT INTO users (username,password) VALUES (?, ?)", [email, password], function (error, results, fields) {
            if (error) {
                console.error("Error in signup query:", error);
                res.redirect('/signup');
            } else {
                res.redirect('/registration');
            }
        });
    } else {
        console.error("Passwords do not match");
        res.redirect('/signup');
    }
});

app.get("/registration", (req, res) => {
    res.sendFile(path.join(__dirname, "HTML", 'registration.html'));
});

app.post('/registration', (req, res) => {
    var name = req.body.name;
    var contact = req.body.contact;
    var dob = req.body.dob;
    var b_group = req.body.b_group;
    var history = req.body.history;
    var p_email = req.body.email;
    var city = req.body.city;
    var gender = req.body.gender;
    var age = req.body.age;

    connection.query("INSERT INTO doctor_appointment.patientregistration (name, email, contact, gender, age, dob, city, bloodGroup, medicalHistory ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [name, p_email, contact, gender, age, dob, city, b_group, history], function (error, results, fields) {
        if (error) {
            console.error("Error in registration:", error);
            res.status(500).send("Error occurred during registration. Please try again.");
            return;
        } else {
            console.log("Registration successful for:", name);
            res.redirect('/login');
        }
    });
});

app.get('/search', (request, response) => {
    const query = request.query.q;

    let sql = '';

    if (query != '') {
        sql = `SELECT * FROM doctors WHERE doctor_name LIKE '%${query}%' OR speciality LIKE '%${query}%' OR email LIKE '%${query}%' OR hospital_name LIKE '%${query}%'`;
    } else {
        sql = `SELECT * FROM doctors ORDER BY doctor_id`;
    }
    

    connection.query(sql, (error, results) => {
        if (error) throw error;
        response.send(results);
    });
});

app.post('/practice', (req, res) => {
    var date = req.body.date;
    var timeSlot = req.body.timeSlot;
    var reason = req.body.reason;

    if (!timeSlot) {
        return res.status(400).json({ error: 'Time slot is required' });
    }

    // Check if the slot is already booked
    connection.query('SELECT * FROM doctor_appointment.appointments WHERE date = ? AND time_slot = ?', [date, timeSlot], function (error, results, fields) {
        if (error) {
            console.error("Error in checking slot:", error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'The selected time slot on this date is already booked' });
        }

        // Insert the new appointment
        connection.query('INSERT INTO doctor_appointment.appointments (date, time_slot, reason) VALUES (?, ?, ?)', [date, timeSlot, reason], function (error, results, fields)  {
            if (error) {
                console.error("Error in insertion:", error);
                return res.status(500).json({ error: 'Database insertion failed' });
            }
            console.log("Appointment booked successfully");
            res.status(200).json({ success: true });
        });
    });
});

app.listen(4500, () => {
    console.log('Server is running on port 4500');
});
