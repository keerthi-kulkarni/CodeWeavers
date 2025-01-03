const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const port = 3050;
const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/Report', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful");
});

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: { type: String, default: null }
});

const reportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    debris_type: String,
    description: String,
    latitude: String,
    longitude: String,
    location: String,
    assistance: String,
    assistance_description: String,
    additional_comments: String,
    created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Report = mongoose.model('Report', reportSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'report.html'));
});

app.post('/post', async (req, res) => {
    const {
        name, email, phone, debris_type, description,
        latitude, longitude, location, assistance,
        assistance_description, additional_comments
    } = req.body;

    try {
        // Save the user
        const newUser = new User({
            name,
            email,
            phone
        });

        const savedUser = await newUser.save();

        // Save the report
        const newReport = new Report({
            user: savedUser._id,
            debris_type,
            description,
            latitude,
            longitude,
            location,
            assistance,
            assistance_description,
            additional_comments
        });

        await newReport.save();
        res.send('Report submitted successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send("Report submitted successfully");
    }
});

app.listen(port, () => {
    console.log("Server Started on port " + port);
});