const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Sample Route
app.get('/', (req, res) => {
    res.send('Welcome to Campus Marketplace API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
