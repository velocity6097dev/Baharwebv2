const mongoose = require('mongoose');

const letterTemplateSchema = new mongoose.Schema({
    templateName: { type: String, required: true, unique: true },
    subject: { type: String, default: 'No Subject' },
    toAddress: { type: String, default: '' },
    // This stores the EXACT visual layout of your Word page
    htmlData: { type: String, required: true } 
}, { timestamps: true }); // Automatically adds createdAt and updatedAt dates

module.exports = mongoose.model('LetterTemplate', letterTemplateSchema);