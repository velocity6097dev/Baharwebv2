// frontend/js/header.js
document.addEventListener("DOMContentLoaded", () => {
    const headerHTML = `
        <div class="logo" style="display: flex; align-items: center; gap: 10px;">
            <i data-lucide="fuel" style="color: var(--primary-color); width: 28px; height: 28px;"></i>
            <h2 style="margin: 0;">Bahar Service Station</h2>
        </div>
        <nav class="nav-links" style="display: flex; align-items: center; gap: 20px;">
            <a href="panel.html" style="display: flex; align-items: center; gap: 6px; text-decoration: none;">
                <i data-lucide="layout-dashboard" style="width: 18px; height: 18px;"></i> Dashboard
            </a>
            <a href="fuel-invoice.html" style="display: flex; align-items: center; gap: 6px; text-decoration: none;">
                <i data-lucide="receipt" style="width: 18px; height: 18px;"></i> Fuel Invoice
            </a>
            <a href="letter.html" style="display: flex; align-items: center; gap: 6px; text-decoration: none;">
                <i data-lucide="file-type-2" style="width: 18px; height: 18px;"></i> Letter Builder
            </a>
            <a href="tracker.html" style="display: flex; align-items: center; gap: 6px; text-decoration: none;">
                <i data-lucide="activity" style="width: 18px; height: 18px;"></i> Tracker
            </a>
            <button id="open-pad-btn" class="pad-btn" style="display: flex; align-items: center; gap: 6px;">
                <i data-lucide="clipboard-pen" style="width: 16px; height: 16px;"></i> Quick Pad
            </button>
            <span id="sync-status" style="color: #10b981; font-size: 0.85rem; font-weight: bold; display: flex; align-items: center; gap: 4px;">
                <i data-lucide="cloud-lightning" style="width: 16px; height: 16px;"></i> Synced
            </span>
        </nav>

        <!-- The Slide-Out Pump Pad -->
        <div id="pump-pad-drawer" class="side-pad hidden no-print">
            <div class="pad-header" style="display: flex; align-items: center; justify-content: space-between;">
                <h3 style="display: flex; align-items: center; gap: 8px; margin: 0;">
                    <i data-lucide="calculator"></i> Station Quick Pad
                </h3>
                <button id="close-pad-btn" class="close-btn" style="display: flex; align-items: center; justify-content: center; background: none; border: none; color: white; cursor: pointer;">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="pad-content">
                <textarea placeholder="Type quick notes, meter readings, or shift calculations here..." id="quick-memo"></textarea>
                
                <h4>Quick Fuel Calc</h4>
                <input type="number" id="pad-liters" placeholder="Liters">
                <input type="number" id="pad-rate" placeholder="Rate (₹)">
                <button onclick="calculatePad()" style="width: 100%; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <i data-lucide="sigma" style="width: 16px; height: 16px;"></i> Calculate Total
                </button>
                <h3 id="pad-total" style="margin-top: 15px; color: var(--primary-color);">Total: ₹0.00</h3>
            </div>
        </div>
        <div id="pad-overlay" class="overlay hidden no-print"></div>
    `;

    const headerContainer = document.getElementById("universal-header");
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;
        headerContainer.classList.add("no-print"); 
        
        // This command tells Lucide to scan the newly injected HTML and draw the icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.warn("Lucide script missing! Add <script src='https://unpkg.com/lucide@latest'></script> to your HTML.");
        }
    }

    // Pump Pad Logic
    const openBtn = document.getElementById("open-pad-btn");
    const closeBtn = document.getElementById("close-pad-btn");
    const drawer = document.getElementById("pump-pad-drawer");
    const overlay = document.getElementById("pad-overlay");

    if (openBtn && closeBtn && drawer && overlay) {
        openBtn.addEventListener("click", () => {
            drawer.classList.remove("hidden");
            overlay.classList.remove("hidden");
        });
        closeBtn.addEventListener("click", () => {
            drawer.classList.add("hidden");
            overlay.classList.add("hidden");
        });
        overlay.addEventListener("click", () => {
            drawer.classList.add("hidden");
            overlay.classList.add("hidden");
        });
    }
});

window.calculatePad = function() {
    const liters = parseFloat(document.getElementById("pad-liters").value) || 0;
    const rate = parseFloat(document.getElementById("pad-rate").value) || 0;
    const total = liters * rate;
    document.getElementById("pad-total").innerText = "Total: ₹" + total.toFixed(2);
}