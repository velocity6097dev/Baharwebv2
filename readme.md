```

---

## ⚙️ Setup & Installation

### **1. Backend Configuration**
1.  Enter the Backend directory: `cd Backend`[cite: 2].
2.  Install dependencies: `npm install`[cite: 2].
3.  Create a `.env` file and define your credentials:
    ```env
    PORT=5000
    MONGO_URI=mongodb_connection_string
    ```
4.  Launch server: `npm start`[cite: 2].

### **2. Frontend Launch**
Since the frontend uses vanilla web technologies, you can open `frontend/pages/index.html` directly in any modern browser or use a local development server like Live Server[cite: 2].

---

## 📄 API Reference

*   `GET /api/templates`: Retrieve list of all available templates[cite: 2].
*   `POST /api/invoices`: Submit and store a new station invoice[cite: 2].
*   `GET /api/letters`: Access saved correspondence history[cite: 2].

---
<p align="center">
  <b>Developed for velocity6097dev / Bahar Service Station - Kolkata</b>Here is an enhanced `README.md` for **BaharWeb V2**, incorporating badges, technology logos, and a clean layout based on your project files[cite: 1, 2].

---

# BaharWeb V2
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="ExpressJS" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
</p>

BaharWeb V2 is a specialized internal management portal developed for **Bahar Service Station**, Kolkata[cite: 2]. As an authorized dealer for **Bharat Petroleum Corp Ltd**, this system streamlines administrative workflows by providing a digital suite for generating professional documentation[cite: 2].

## 🚀 Key Features

*   **📄 Document Generation**: Automated creation of **Fuel Invoices**, **Stamping Invoices**, and **Official Letters**[cite: 2].
*   **🛠️ Interactive Builder**: A dedicated UI component for real-time document construction and editing[cite: 1, 2].
*   **📂 Template Architecture**: Backend models for `InvoiceTemplate` and `LetterTemplate` ensure consistency across all station communications[cite: 1, 2].
*   **📱 Responsive Panel**: Mobile-optimized dashboard for staff to manage administrative tasks on the go[cite: 1, 2].
*   **⚡ Modern Backend**: Built with a RESTful Node.js architecture utilizing Mongoose for schema-based data modeling[cite: 1, 2].

---

## 🛠️ Technology Stack

### **Frontend**
| Tech | Description |
| :--- | :--- |
| **HTML5/CSS3** | Core structure and custom styling for UI elements like Ribbons and Panels[cite: 1, 2]. |
| **Vanilla JavaScript** | Modular scripts handling API interactions and dynamic UI logic[cite: 1, 2]. |

### **Backend**
| Tech | Description |
| :--- | :--- |
| **Node.js** | Scalable runtime for the application environment[cite: 1, 2]. |
| **Express.js** | Minimalist web framework for routing and template management[cite: 1, 2]. |
| **MongoDB/Mongoose** | NoSQL database for flexible storage of invoice and letter data[cite: 1, 2]. |
| **Dotenv** | Secure environment variable management[cite: 1, 2]. |

---

## 📂 Project Structure
```text
Baharwebv2-main/
├── Backend/
│   ├── models/           # Mongoose schemas (Invoices & Letters)
│   ├── routes/           # API route handlers
│   └── server.js         # Entry point[cite: 1, 2]
└── frontend/
    ├── css/              # Modular stylesheets (Ribbon, Panel, Builder)
    ├── js/               # API clients and UI controllers
    └── pages/            # View templates (fuel-invoice, stamping, index)[cite: 1, 2]
```

---

## ⚙️ Setup & Installation

### **1. Backend Configuration**
1.  Enter the Backend directory: `cd Backend`[cite: 2].
2.  Install dependencies: `npm install`[cite: 2].
3.  Create a `.env` file and define your credentials:
    ```env
    PORT=5000
    MONGO_URI=mongodb_connection_string
    ```
4.  Launch server: `npm start`[cite: 2].

### **2. Frontend Launch**
Since the frontend uses vanilla web technologies, you can open `frontend/pages/index.html` directly in any modern browser or use a local development server like Live Server[cite: 2].

---

## 📄 API Reference

*   `GET /api/templates`: Retrieve list of all available templates[cite: 2].
*   `POST /api/invoices`: Submit and store a new station invoice[cite: 2].
*   `GET /api/letters`: Access saved correspondence history[cite: 2].

---
<p align="center">
  <b>Developed for velocity6097dev / Bahar Service Station - Kolkata</b>[cite: 1, 2]
</p>
```
