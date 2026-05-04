// frontend/js/api.js

// Use a relative path! Vercel's vercel.json will catch anything 
// starting with '/api' and route it to your Backend/server.js automatically.
const API_BASE_URL = "/api"; 

async function saveInvoice() {
    const data = {
        type: "Fuel",
        clientName: document.getElementById('clientName').value,
        fuelType: document.getElementById('fuelType').value,
        quantity: document.getElementById('quantity').value,
        date: new Date().toISOString()
    };

    console.log("Saving to MongoDB...", data);

    try {
        // I also noticed your previous error tried to hit '/api/templates/invoice', 
        // so adjust this endpoint if your backend specifically requires '/templates/invoice' instead of just '/templates'
        const response = await fetch(`${API_BASE_URL}/templates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        console.log("Saved!", result);
        alert("Invoice saved to database successfully!");
        
    } catch (error) {
        console.error("Database sync failed", error);
        alert("Failed to connect to the database. Check the console for errors.");
    }
}
