const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define Schema & Model
const LayoutSchema = new mongoose.Schema({
    userId: String,
    layout: Array
});
const Layout = mongoose.model('Layout', LayoutSchema);

// Save Layout
app.post('/save-layout', async (req, res) => {
    const { userId, layout } = req.body;
    try {
        await Layout.findOneAndUpdate(
            { userId },
            { layout },
            { upsert: true, new: true }
        );
        res.json({ message: 'Layout saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving layout' });
    }
});

// Load Layout
app.get('/load-layout/:userId', async (req, res) => {
    try {
        const layout = await Layout.findOne({ userId: req.params.userId });
        res.json({ layout });
    } catch (error) {
        res.status(500).json({ error: 'Error loading layout' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));