require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

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

app.get('/api/getPopulation', async (req, res) => {
  try {
    const populationData = await Population.find(); 
    res.json(populationData);
  } catch (error) {
    res.status(500).send('Error retrieving data');
  }
});