require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;


// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the connection string from the .env file
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const populationSchema = new mongoose.Schema({
  lastUpdated: Number,
  totalPopulation: Number,
  populationByDistrict: Object,
  statusByDistrict: Object,
});

const Population = mongoose.model('Population', populationSchema);

// Endpoint to save population data
app.post('/api/savePopulation', async (req, res) => {
  try {
    const populationData = new Population(req.body);
    await populationData.save();
    res.status(201).send('Data saved successfully');
  } catch (error) {
    res.status(500).send('Error saving data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
