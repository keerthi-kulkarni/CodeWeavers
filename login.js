const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const port = 4090;
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

const loginSchema = new mongoose.Schema({
    Usernameoremail: { type: String, unique: true },
    password: String,
});
const Users = mongoose.model('User', loginSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/post', async (req, res) => {
    const { Usernameoremail, password } = req.body;
    try {
        const newUsers = new Users({ Usernameoremail, password });
        await newUsers.save();
        res.send('User logined successfully!');
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send("Username or email already exists.");
        }
        console.error(error);
        res.status(500).send("An error occurred while submitting the form. Please try again.");
    }
});

app.listen(port, () => {
    console.log(Server is running on http://localhost:${port});
});