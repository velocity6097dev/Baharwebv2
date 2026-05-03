const express = require('express');
const router = express.Router();
const LetterTemplate = require('../models/LetterTemplate');
const InvoiceTemplate = require('../models/InvoiceTemplate');

// --- INVOICE ROUTES ---

// 1. Save a new Invoice Template (or update existing)
router.post('/invoice', async (req, res) => {
    try {
        const { templateName, invoiceType, htmlData } = req.body;
        
        // Use findOneAndUpdate with upsert: true. 
        // If the name exists, it overwrites it. If it doesn't, it creates a new one.
        const savedInvoice = await InvoiceTemplate.findOneAndUpdate(
            { templateName: templateName },
            { invoiceType, htmlData },
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, message: 'Invoice Saved!', template: savedInvoice });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Get all Invoice Templates (For your "Select Template" screen)
router.get('/invoice', async (req, res) => {
    try {
        // We only send back the names and dates to load the menu faster
        const templates = await InvoiceTemplate.find().select('templateName updatedAt invoiceType');
        res.status(200).json(templates);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. Load a specific Invoice Template's HTML
router.get('/invoice/:name', async (req, res) => {
    try {
        const template = await InvoiceTemplate.findOne({ templateName: req.params.name });
        if (!template) return res.status(404).json({ message: "Template not found" });
        res.status(200).json(template);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- LETTER ROUTES (Exact same logic, different database collection) ---

router.post('/letter', async (req, res) => { /* Same as above, using LetterTemplate */ });
router.get('/letter', async (req, res) => { /* Same as above */ });
router.get('/letter/:name', async (req, res) => { /* Same as above */ });

module.exports = router;