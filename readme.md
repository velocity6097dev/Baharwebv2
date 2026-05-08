
# ⛽ Bahar Web v2

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Welcome to **Bahar Web v2**, a comprehensive business process automation and administrative portal designed to streamline operations for Bahar Service Station. This system facilitates the automated generation, tracking, and management of fuel and stamping invoices, official letters, and operational templates.

## ✨ Key Features

* 🧾 **Invoice Management**: Dedicated modules for generating detailed Fuel Invoices and Stamping Invoices (`fuel-invoice.html`, `stamping-invoice.html`).
* ✉️ **Official Letter Drafting**: Integrated interface for generating and managing standardized business letters (`letter.html`).
* 🛠️ **Dynamic Template Builder**: An auto-builder interface allowing admins to create, edit, and save custom MongoDB-backed document templates (`builder.html`, `auto-builder.js`).
* 📊 **Admin Dashboard**: Centralized panel for operational oversight and quick navigation (`panel.html`, `dashboard.js`).
* ☁️ **Cloud-Ready**: Fully configured for Vercel deployment (`vercel.json`) with a decoupled REST API backend.

## 🗂️ Project Structure

```text
📦 Baharwebv2
 ┣ 📂 Backend                 # Node.js / Express API Server
 ┃ ┣ 📂 models                # Mongoose Database Schemas
 ┃ ┃ ┣ 📜 InvoiceTemplate.js  # Schema for invoice data
 ┃ ┃ ┗ 📜 LetterTemplate.js   # Schema for letter data
 ┃ ┣ 📂 routes                # Express API Routes
 ┃ ┃ ┗ 📜 templates.js        # CRUD operations for templates
 ┃ ┣ 📜 package.json          # Backend dependencies
 ┃ ┗ 📜 server.js             # Main server entry point
 ┣ 📂 frontend                # Client-side Application
 ┃ ┣ 📂 css                   # Stylesheets
 ┃ ┃ ┣ 📜 builder.css         
 ┃ ┃ ┣ 📜 global.css          
 ┃ ┃ ┣ 📜 panel.css           
 ┃ ┃ ┗ 📜 ribbon.css          
 ┃ ┣ 📂 js                    # Client-side Logic
 ┃ ┃ ┣ 📜 api.js              # Fetch wrappers & API calls
 ┃ ┃ ┣ 📜 auto-builder.js     # Template builder logic
 ┃ ┃ ┣ 📜 dashboard.js        # Panel interactions
 ┃ ┃ ┣ 📜 header.js           
 ┃ ┃ ┣ 📜 pad-header.js       
 ┃ ┃ ┗ 📜 ribbon.js           
 ┃ ┗ 📂 pages                 # HTML Views
 ┃ ┃ ┣ 📜 builder.html        
 ┃ ┃ ┣ 📜 fuel-invoice.html   
 ┃ ┃ ┣ 📜 index.html          
 ┃ ┃ ┣ 📜 letter.html         
 ┃ ┃ ┣ 📜 panel.html          
 ┃ ┃ ┣ 📜 stamping-invoice.html 
 ┃ ┃ ┗ 📜 templates.html      
 ┗ 📜 vercel.json             # Vercel Serverless Configuration
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:

* [Node.js](https://nodejs.org/) (v16.x or higher recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/velocity6097/baharwebv2.git](https://github.com/velocity6097/baharwebv2.git)
cd baharwebv2

```


2. **Setup the Backend:**
Navigate to the backend directory and install the required dependencies:
```bash
cd Backend
npm install

```


3. **Environment Variables:**
Create a `.env` file in the `Backend` directory and add your MongoDB connection string and preferred port:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

```


4. **Start the Server:**
```bash
node server.js

```


*The server should now be running on `http://localhost:5000`.*

5. **Launch the Frontend:**
You can serve the `frontend` folder using any static file server (like VS Code's Live Server extension) or simply open `frontend/pages/index.html` in your browser. Ensure that `frontend/js/api.js` is pointing to the correct local API endpoint (e.g., `http://localhost:5000`) during development.

## 🌐 Deployment

This project includes a `vercel.json` file, making it ready for seamless deployment to [Vercel](https://vercel.com/).

* The backend API will be deployed as serverless functions.
* The static HTML/CSS/JS frontend will be served via Vercel's Edge Network.
* Don't forget to configure your `MONGO_URI` in the Vercel dashboard environment variables!

## 🛠️ Built By

Developed by **velocity6097**.

```

```
