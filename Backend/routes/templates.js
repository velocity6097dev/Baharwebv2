// const express = require('express');
// const router = express.Router();
// const LetterTemplate = require('../models/LetterTemplate');
// const InvoiceTemplate = require('../models/InvoiceTemplate');

// // --- INVOICE ROUTES ---

// // 1. Save a new Invoice Template (or update existing)
// router.post('/invoice', async (req, res) => {
//     try {
//         const { templateName, invoiceType, htmlData } = req.body;
        
//         // Use findOneAndUpdate with upsert: true. 
//         // If the name exists, it overwrites it. If it doesn't, it creates a new one.
//         const savedInvoice = await InvoiceTemplate.findOneAndUpdate(
//             { templateName: templateName },
//             { invoiceType, htmlData },
//             { new: true, upsert: true }
//         );
//         res.status(200).json({ success: true, message: 'Invoice Saved!', template: savedInvoice });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// // 2. Get all Invoice Templates (For your "Select Template" screen)
// router.get('/invoice', async (req, res) => {
//     try {
//         // We only send back the names and dates to load the menu faster
//         const templates = await InvoiceTemplate.find().select('templateName updatedAt invoiceType');
//         res.status(200).json(templates);
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// // 3. Load a specific Invoice Template's HTML
// router.get('/invoice/:name', async (req, res) => {
//     try {
//         const template = await InvoiceTemplate.findOne({ templateName: req.params.name });
//         if (!template) return res.status(404).json({ message: "Template not found" });
//         res.status(200).json(template);
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// // --- LETTER ROUTES (Exact same logic, different database collection) ---

// router.post('/letter', async (req, res) => { /* Same as above, using LetterTemplate */ });
// router.get('/letter', async (req, res) => { /* Same as above */ });
// router.get('/letter/:name', async (req, res) => { /* Same as above */ });

// module.exports = router;
const express = require('express');
const router = express.Router();

const InvoiceTemplate = require('../models/InvoiceTemplate');
const LetterTemplate = require('../models/LetterTemplate');

// ==========================================
// INVOICE TEMPLATE ROUTES (/api/templates/invoice)
// ==========================================

router.get('/invoice', async (req, res) => {
    try {
        const templates = await InvoiceTemplate.find().select('templateName createdAt invoiceType');
        res.json(templates);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch invoice templates" });
    }
});

router.get('/invoice/:name', async (req, res) => {
    try {
        const template = await InvoiceTemplate.findOne({ templateName: req.params.name });
        if (!template) return res.status(404).json({ error: "Template not found" });
        res.json(template);
    } catch (err) {
        res.status(500).json({ error: "Error fetching template" });
    }
});

router.post('/invoice', async (req, res) => {
    try {
        const { templateName, invoiceType, subject, columns, deductions, htmlData } = req.body;
        await InvoiceTemplate.findOneAndUpdate(
            { templateName }, 
            { 
                invoiceType: invoiceType || 'fuel',
                subject: subject || '',
                columns: columns || [],
                deductions: deductions || [],
                htmlData 
            }, 
            { upsert: true, new: true }
        );
        res.json({ success: true, message: "Invoice saved successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error saving invoice" });
    }
});

router.put('/invoice/:name', async (req, res) => {
    try {
        const { newTemplateName } = req.body;
        const updated = await InvoiceTemplate.findOneAndUpdate(
            { templateName: req.params.name },
            { templateName: newTemplateName }
        );
        
        // Added safety check
        if (!updated) return res.status(404).json({ error: "Original template not found to rename" });
        
        res.json({ success: true });
    } catch (err) {
        // If the new name already exists, MongoDB throws a duplicate key error (code 11000)
        if (err.code === 11000) return res.status(400).json({ error: "Template with that name already exists" });
        res.status(500).json({ error: "Failed to rename invoice" });
    }
});

router.delete('/invoice/:name', async (req, res) => {
    try {
        const deleted = await InvoiceTemplate.findOneAndDelete({ templateName: req.params.name });
        
        // Added safety check
        if (!deleted) return res.status(404).json({ error: "Template not found to delete" });
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete invoice" });
    }
});

// ==========================================
// LETTER TEMPLATE ROUTES (/api/templates/letter)
// ==========================================

router.get('/letter', async (req, res) => {
    try {
        const templates = await LetterTemplate.find().select('templateName createdAt subject');
        res.json(templates);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch letter templates" });
    }
});

router.get('/letter/:name', async (req, res) => {
    try {
        const template = await LetterTemplate.findOne({ templateName: req.params.name });
        if (!template) return res.status(404).json({ error: "Template not found" });
        res.json(template);
    } catch (err) {
        res.status(500).json({ error: "Error fetching template" });
    }
});

router.post('/letter', async (req, res) => {
    try {
        const { templateName, subject, toAddress, htmlData } = req.body;
        await LetterTemplate.findOneAndUpdate(
            { templateName }, 
            { 
                subject: subject || 'No Subject',
                toAddress: toAddress || '',
                htmlData 
            }, 
            { upsert: true, new: true }
        );
        res.json({ success: true, message: "Letter saved successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error saving letter" });
    }
});

router.put('/letter/:name', async (req, res) => {
    try {
        const { newTemplateName } = req.body;
        const updated = await LetterTemplate.findOneAndUpdate(
            { templateName: req.params.name },
            { templateName: newTemplateName }
        );
        
        // Added safety check
        if (!updated) return res.status(404).json({ error: "Original template not found to rename" });
        
        res.json({ success: true });
    } catch (err) {
        // Duplicate key check
        if (err.code === 11000) return res.status(400).json({ error: "Template with that name already exists" });
        res.status(500).json({ error: "Failed to rename letter" });
    }
});

router.delete('/letter/:name', async (req, res) => {
    try {
        const deleted = await LetterTemplate.findOneAndDelete({ templateName: req.params.name });
        
        // Added safety check
        if (!deleted) return res.status(404).json({ error: "Template not found to delete" });
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete letter" });
    }
});

module.exports = router;