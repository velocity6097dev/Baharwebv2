// frontend/js/api.js

// Use a relative path! Vercel's vercel.json will catch anything 
// starting with '/api' and route it to your Backend/server.js automatically.
const API_BASE_URL = "/api/templates"; 

const TemplateAPI = {
    // -----------------------------------------
    // FETCHING DATA (For the Dashboard)
    // -----------------------------------------
    getInvoices: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/invoice`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error("Error fetching invoice templates:", error);
            return [];
        }
    },
    
    getLetters: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/letter`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error("Error fetching letter templates:", error);
            return [];
        }
    },

    // -----------------------------------------
    // SAVING DATA
    // -----------------------------------------
    createInvoice: async (invoiceData) => {
        console.log("Saving to MongoDB...", invoiceData);
        try {
            // Hitting the specific invoice endpoint 
            const response = await fetch(`${API_BASE_URL}/invoice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoiceData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("Database sync failed:", error);
            throw error; 
        }
    },
    renameTemplate: async (docType, oldName, newName) => {
        // docType should be 'invoice' or 'letter'
        const response = await fetch(`${API_BASE_URL}/${docType}/${encodeURIComponent(oldName)}`, {
            method: 'PUT', // Or PATCH
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newTemplateName: newName })
        });
        if (!response.ok) throw new Error('Failed to rename template');
        return await response.json();
    },

    deleteTemplate: async (docType, templateName) => {
        // docType should be 'invoice' or 'letter'
        const response = await fetch(`${API_BASE_URL}/${docType}/${encodeURIComponent(templateName)}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete template');
        return await response.json();
    }
};


// -----------------------------------------
// UI ATTACHMENT FUNCTION
// (Bind this to your Save/Submit button)
// -----------------------------------------
async function saveInvoice() {
    // Safely get DOM elements
    const clientNameEl = document.getElementById('clientName');
    const fuelTypeEl = document.getElementById('fuelType');
    const quantityEl = document.getElementById('quantity');

    if (!clientNameEl || !fuelTypeEl || !quantityEl) {
        console.error("Missing form fields! Check your HTML IDs.");
        alert("Cannot save: Form fields are missing.");
        return;
    }

    // Structure the data to match your backend model
    const data = {
        templateName: `Invoice-${document.getElementById('clientName').value}-${Date.now()}`, // Useful if your schema requires a unique name
        type: "Fuel",
        clientName: clientNameEl.value,
        fuelType: fuelTypeEl.value,
        quantity: quantityEl.value,
        date: new Date().toISOString()
    };

    try {
        const result = await TemplateAPI.createInvoice(data);
        console.log("Saved!", result);
        alert("Invoice saved to database successfully!");
        
        // Optional: clear the form or redirect the user after saving
        // window.location.href = "index.html";
    } catch (error) {
        alert("Failed to connect to the database. Check the console for errors.");
    }
}