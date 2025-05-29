const express = require('express');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const { category, isActive = true } = req.query;
    
    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (category) {
      query.category = category;
    }

    const services = await Service.find(query).sort({ category: 1, name: 1 });
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new service (admin only)
router.post('/', auth, async (req, res) => {
  try {
    // This would typically require admin role check
    // For now, allowing any authenticated user
    
    const {
      name,
      description,
      category,
      basePrice,
      duration,
      icon,
      tags,
      requirements
    } = req.body;

    const service = new Service({
      name,
      description,
      category,
      basePrice,
      duration,
      icon,
      tags,
      requirements
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Service with this name already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Update service (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const allowedUpdates = [
      'name', 'description', 'category', 'basePrice', 
      'duration', 'isActive', 'icon', 'tags', 'requirements'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json(updatedService);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 