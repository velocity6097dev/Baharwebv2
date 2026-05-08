// frontend/js/dashboard.js

document.addEventListener('DOMContentLoaded', async () => {
    loadDashboardTable();
});

// --- Modal Logic with Search, Edit, and Delete ---

let currentModalData = []; // Store templates for searching
let currentTargetPage = ''; // Store target page (fuel or letter)
let currentDocType = ''; // 'invoice' or 'letter'

async function openTemplateModal(type) {
    const modal = document.getElementById('templateModal');
    const title = document.getElementById('modalTitle');
    const list = document.getElementById('modalTemplateList');
    const createBtn = document.getElementById('createNewBtn');
    const searchInput = document.getElementById('templateSearch');
    
    modal.classList.add('active');
    searchInput.value = ''; // Reset search on open
    list.innerHTML = '<div style="text-align:center; padding: 20px; color: #64748b;">Loading templates...</div>';
    
    if (type === 'fuel') {
        title.innerText = 'Fuel Billing Options';
        createBtn.onclick = () => location.href = 'fuel-invoice.html';
        currentTargetPage = 'fuel-invoice.html';
        currentDocType = 'invoice';
        
        try {
            const result = await TemplateAPI.getInvoices();
            currentModalData = result.data || result || []; 
            renderModalList(currentModalData);
        } catch(e) {
            list.innerHTML = '<div style="color:red; text-align:center;">Failed to load templates.</div>';
        }
        
    } else if (type === 'letter') {
        title.innerText = 'Letter Options';
        createBtn.onclick = () => location.href = 'letter.html';
        currentTargetPage = 'letter.html';
        currentDocType = 'letter';
        
        try {
            const result = await TemplateAPI.getLetters();
            currentModalData = result.data || result || [];
            renderModalList(currentModalData);
        } catch(e) {
            list.innerHTML = '<div style="color:red; text-align:center;">Failed to load templates.</div>';
        }
    }
}

// Search functionality
function filterModalTemplates() {
    const query = document.getElementById('templateSearch').value.toLowerCase();
    const filtered = currentModalData.filter(t => t.templateName.toLowerCase().includes(query));
    renderModalList(filtered);
}

function renderModalList(templates) {
    const list = document.getElementById('modalTemplateList');
    
    if (!templates || templates.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding: 20px; color: #64748b; background: #f8fafc; border-radius: 8px;">
                No templates match your search.
            </div>`;
        return;
    }
    
    list.innerHTML = templates.map(t => `
        <div class="template-item" onclick="location.href='${currentTargetPage}?template=${encodeURIComponent(t.templateName)}'">
            <div class="template-info">
                <span><strong>${t.templateName}</strong></span>
            </div>
            <div class="template-actions">
                <button class="action-icon-btn edit" onclick="event.stopPropagation(); editTemplate('${t.templateName}')" title="Rename">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="action-icon-btn delete" onclick="event.stopPropagation(); deleteTemplate('${t.templateName}')" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Rename Template
async function editTemplate(oldName) {
    const newName = prompt(`Enter new name for "${oldName}":`, oldName);
    if (!newName || newName.trim() === "" || newName === oldName) return;

    try {
        await TemplateAPI.renameTemplate(currentDocType, oldName, newName.trim());
        alert("Template renamed successfully!");
        // Refresh the modal
        openTemplateModal(currentDocType === 'invoice' ? 'fuel' : 'letter');
        loadDashboardTable(); // Refresh background table too
    } catch (error) {
        alert("Failed to rename template. Ensure your backend supports this feature.");
    }
}

// Delete Template
async function deleteTemplate(name) {
    if (!confirm(`Are you sure you want to completely delete the template "${name}"? This cannot be undone.`)) return;

    try {
        await TemplateAPI.deleteTemplate(currentDocType, name);
        // Refresh the modal
        openTemplateModal(currentDocType === 'invoice' ? 'fuel' : 'letter');
        loadDashboardTable(); // Refresh background table too
    } catch (error) {
        alert("Failed to delete template. Ensure your backend supports this feature.");
    }
}

function closeModal() {
    document.getElementById('templateModal').classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('templateModal');
    if (event.target === modal) closeModal();
}

// --- Main Dashboard Table Logic ---
// (Keep your existing loadDashboardTable() function here!)
async function loadDashboardTable() {
    const templateList = document.getElementById('templateList');
    try {
        const [invoices, letters] = await Promise.all([TemplateAPI.getInvoices(), TemplateAPI.getLetters()]);
        const allTemplates = [
            ...(invoices.data || invoices || []).map(t => ({ name: t.templateName, type: 'Invoice', path: 'fuel-invoice.html' })),
            ...(letters.data || letters || []).map(t => ({ name: t.templateName, type: 'Letter', path: 'letter.html' }))
        ];

        if (allTemplates.length === 0) {
            templateList.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #64748b;">No templates available yet.</td></tr>';
            return;
        }

        templateList.innerHTML = allTemplates.map(t => `
            <tr>
                <td><strong>${t.name}</strong></td>
                <td><span class="badge ${t.type.toLowerCase()}">${t.type}</span></td>
                <td>
                    <button class="btn-secondary" onclick="window.location.href='${t.path}?template=${encodeURIComponent(t.name)}'">Use</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        templateList.innerHTML = '<tr><td colspan="3" style="color: red; text-align: center;">Failed to load database.</td></tr>';
    }
}