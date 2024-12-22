const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MongoDB Connection
//u7JI0layU7spttXh
mongoose
  .connect('mongodb+srv://admin:u7JI0layU7spttXh@cluster0.em8sd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema and Model
const wasteSchema = new mongoose.Schema({
  wasteId: { type: String, required: true },
  collectionCompany: { type: String, required: true },
  totalWeight: { type: Number, required: true },
  owner: { type: String, required: true },
});

const Waste = mongoose.model('Waste', wasteSchema);

// Routes

// Create a new waste entry
app.post('/api/waste', async (req, res) => {
  try {
    const { wasteId, collectionCompany, totalWeight, owner } = req.body;
    const newWaste = new Waste({ wasteId, collectionCompany, totalWeight, owner });
    await newWaste.save();
    res.status(201).json({ message: 'Waste created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create waste', details: error.message });
  }
});

app.get('/api/waste', async (req, res) => {
  const { wasteId } = req.query; // Fetch wasteId from query params

  try {
    let wasteData;

    if (wasteId) {
      // If wasteId is provided, fetch that specific waste entry
      wasteData = await Waste.findOne({ wasteId });

      if (!wasteData) {
        return res.status(404).json({ error: 'Waste not found' });
      }
    } else {
      // If wasteId is not provided, fetch all waste entries
      wasteData = await Waste.find();
    }

    res.status(200).json(wasteData); // Return the waste data as JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch waste data', details: error.message });
  }
});

// Serve the All Waste HTML page
app.get('/all-waste', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'all-waste.html'));
});


// Get all waste or filter by wasteId
app.get('/api/waste', async (req, res) => {
  const { wasteId } = req.query; // Fetch wasteId from query params

  if (!wasteId) {
    return res.status(400).json({ error: 'Waste ID is required' });
  }

  try {
    const waste = await Waste.findOne({ wasteId }); // Find one entry by wasteId

    if (!waste) {
      return res.status(404).json({ error: 'Waste not found' });
    }

    res.status(200).json(waste); // Return the waste data as JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch waste data', details: error.message });
  }
});

// Get waste data (all or by wasteId)
app.get('/api/waste', async (req, res) => {
  const { wasteId } = req.query; // Fetch wasteId from query params

  try {
    let wasteData;

    if (wasteId) {
      // If wasteId is provided, fetch that specific waste entry
      wasteData = await Waste.findOne({ wasteId });
    } else {
      // If wasteId is not provided, fetch all waste entries
      wasteData = await Waste.find();
    }

    if (!wasteData) {
      return res.status(404).json({ error: 'Waste not found' });
    }

    res.status(200).json(wasteData); // Return the waste data as JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch waste data', details: error.message });
  }
});


// Delete a waste entry by wasteId
app.post('/deleteWaste', async (req, res) => {
  const { wasteId } = req.body;

  if (!wasteId) {
    return res.status(400).json({ message: 'Waste ID is required' });
  }

  try {
    // Find and delete the waste
    const deletedWaste = await Waste.findOneAndDelete({ wasteId });

    if (!deletedWaste) {
      return res.status(404).json({ message: 'Waste not found with this ID' });
    }

    res.status(200).json({ message: 'Waste deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete waste', details: error.message });
  }
});

app.post('/buyWaste', (req, res) => {
  // Logic to handle buying waste
  res.json({ message: 'Waste bought successfully.' });
});

app.post('/createProduct', (req, res) => {
  // Logic to handle creating a product
  res.json({ message: 'Product created successfully.' });
});

app.get('/readProduct', (req, res) => {
  // Logic to handle reading a product
  res.json({ id: 'Product-01', name: 'Sample Product' });
});

app.post('/deleteProduct', (req, res) => {
  // Logic to handle deleting a product
  res.json({ message: 'Product deleted successfully.' });
});

app.get('/viewAllProducts', (req, res) => {
  // Logic to handle viewing all products
  res.json({ products: ['Product-01', 'Product-02', 'Product-03'] });
});




// Start Server
const PORT = process.env.PORT || 27017; // Use dynamic port if specified
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


