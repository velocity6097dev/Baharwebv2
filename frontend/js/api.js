// frontend/js/api.js

const API_BASE_URL = "http://localhost:5000/api"; // We will build this backend next

async function saveInvoice() {
    const data = {
        type: "Fuel",
        clientName: document.getElementById('clientName').value,
        fuelType: document.getElementById('fuelType').value,
        quantity: document.getElementById('quantity').value,
        date: new Date().toISOString()
    };

    console.log("Mock Saving to MongoDB...", data);
    alert("Data packaged for MongoDB! (Backend connection pending)");

    /* 
    // This is the actual code that will run once the backend is up:
    try {
        const response = await fetch(`${API_BASE_URL}/templates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log("Saved!", result);
    } catch (error) {
        console.error("Database sync failed", error);
    }
    */
}