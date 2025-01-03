const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const port = 3080;
const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/login', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful");
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema({
    Firstname: String,
    Lastname: String,
    email: { type: String, unique: true },
    phone: { type: String, default: null },
    password: String,
});
const Users = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/post', async (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;
    try {
        const newUsers = new Users({
            Firstname: firstname,
            Lastname: lastname,
            email,
            phone,
            password,
        });
        await newUsers.save();
        res.send('User registered successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while submitting the form. Please try again.");
    }
});

app.listen(port, () => {
    console.log(Server running on port ${port});
});