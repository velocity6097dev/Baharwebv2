const mongoose = require('mongoose');

const invoiceTemplateSchema = new mongoose.Schema({
    templateName: { type: String, required: true, unique: true },
    invoiceType: { type: String, enum: ['fuel', 'stamping', 'other'], default: 'fuel' },
    subject: { type: String, default: '' },
    
    // We can store the structure so it's easy to query later
    columns: [{ 
        headerName: String, 
        columnType: String // e.g., 'qty', 'rate', 'amount'
    }],
    
    deductions: [{ 
        description: String, 
        operator: String, 
        value: String 
    }],

    // This stores the EXACT visual layout of the tables and spacing
    htmlData: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('InvoiceTemplate', invoiceTemplateSchema);