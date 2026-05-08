// frontend/js/dashboard.js

// Store all fetched templates globally so we can filter them without asking the server again
let allDashboardTemplates = [];

document.addEventListener('DOMContentLoaded', async () => {
    loadDashboardTable();

    // Hook up the new Search and Filter listeners for the Main Dashboard
    const mainSearch = document.getElementById('mainTemplateSearch');
    const mainFilter = document.getElementById('mainTemplateFilter');
    
    if (mainSearch) mainSearch.addEventListener('input', applyMainFilters);
    if (mainFilter) mainFilter.addEventListener('change', applyMainFilters);
});

// --- Main Dashboard Table Logic ---
async function loadDashboardTable() {
    const templateList = document.getElementById('templateList');
    try {
        const [invoices, letters] = await Promise.all([
            TemplateAPI.getInvoices(), 
            TemplateAPI.getLetters()
        ]);
        
        const invoiceData = invoices.data || invoices || [];
        const letterData = letters.data || letters || [];

        allDashboardTemplates = [
            ...invoiceData.map(t => ({ name: t.templateName, type: 'Invoice', path: 'fuel-invoice.html' })),
            ...letterData.map(t => ({ name: t.templateName, type: 'Letter', path: 'letter.html' }))
        ];

        applyMainFilters(); // Initial render of the table
    } catch (err) {
        console.error(err);
        templateList.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #ef4444; padding:20px;">Error loading templates. Backend might be down.</td></tr>';
    }
}

// Applies the search text and the dropdown filter
function applyMainFilters() {
    const searchInput = document.getElementById('mainTemplateSearch');
    const filterSelect = document.getElementById('mainTemplateFilter');
    
    const term = searchInput ? searchInput.value.toLowerCase() : '';
    const typeFilter = filterSelect ? filterSelect.value : 'all'; // 'all', 'invoice', or 'letter'

    const filtered = allDashboardTemplates.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(term);
        const matchesType = typeFilter === 'all' || t.type.toLowerCase() === typeFilter;
        return matchesSearch && matchesType;
    });

    renderDashboardTable(filtered);
}

function renderDashboardTable(templatesToRender) {
    const templateList = document.getElementById('templateList');
    if (templatesToRender.length === 0) {
        templateList.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #64748b; padding: 30px;">No matching templates found.</td></tr>';
        return;
    }

    templateList.innerHTML = templatesToRender.map(t => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 16px; vertical-align: middle;"><strong>${t.name}</strong></td>
            <td style="padding: 12px 16px; vertical-align: middle;"><span class="badge ${t.type.toLowerCase()}">${t.type}</span></td>
            <td style="padding: 12px 16px; text-align: right;">
                <div style="display: flex; justify-content: flex-end; gap: 6px;">
                    <button class="btn-secondary" style="padding: 6px 10px; font-size: 0.8rem; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 4px; cursor: pointer; font-weight:600;" 
                            onclick="window.location.href='${t.path}?template=${encodeURIComponent(t.name)}'">Use / Edit</button>
                            
                    <button class="btn-secondary" style="padding: 6px 10px; font-size: 0.8rem; background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; border-radius: 4px; cursor: pointer; font-weight:600;" 
                            onclick="renameDashboardTemplate('${t.name}', '${t.type}')">Rename</button>
                            
                    <button class="btn-secondary" style="padding: 6px 10px; font-size: 0.8rem; background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; border-radius: 4px; cursor: pointer; font-weight:600;" 
                            onclick="deleteDashboardTemplate('${t.name}', '${t.type}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}


// --- Unified Quick Action Functions (Rename & Delete) ---
// These functions are used by BOTH the Dashboard Table AND the Modal Popups

async function renameDashboardTemplate(oldName, type) {
    const newName = prompt(`Enter new name for "${oldName}":`, oldName);
    if (!newName || newName.trim() === '' || newName === oldName) return;

    const endpoint = type.toLowerCase() === 'letter' ? '/api/templates/letter' : '/api/templates/invoice';
    
    try {
        const res = await fetch(`${endpoint}/${encodeURIComponent(oldName)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newTemplateName: newName.trim() })
        });
        
        if (res.ok) {
            // Reload Background Dashboard
            loadDashboardTable(); 
            // If the modal is currently open, refresh the modal list too
            const modal = document.getElementById('templateModal');
            if (modal && modal.classList.contains('active')) {
                openTemplateModal(type.toLowerCase() === 'letter' ? 'letter' : 'fuel');
            }
        } else {
            alert("Failed to rename. A template with that name might already exist.");
        }
    } catch (err) {
        console.error("Rename failed", err);
        alert("Server error renaming template.");
    }
}

async function deleteDashboardTemplate(name, type) {
    if(!confirm(`Are you absolutely sure you want to delete "${name}"? This cannot be undone.`)) return;
    
    const endpoint = type.toLowerCase() === 'letter' ? '/api/templates/letter' : '/api/templates/invoice';
    
    try {
        await fetch(`${endpoint}/${encodeURIComponent(name)}`, { method: 'DELETE' });
        
        // Reload Background Dashboard
        loadDashboardTable(); 
        // If the modal is currently open, refresh the modal list too
        const modal = document.getElementById('templateModal');
        if (modal && modal.classList.contains('active')) {
            openTemplateModal(type.toLowerCase() === 'letter' ? 'letter' : 'fuel');
        }
    } catch (err) {
        console.error("Delete failed", err);
        alert("Server error deleting template.");
    }
}


// --- Modal Logic ---

let currentModalData = []; // Store templates for searching inside the modal
let currentTargetPage = ''; // Store target page (fuel or letter)
let currentDocType = ''; // 'invoice' or 'letter'

async function openTemplateModal(type) {
    const modal = document.getElementById('templateModal');
    const title = document.getElementById('modalTitle');
    const list = document.getElementById('modalTemplateList');
    const createBtn = document.getElementById('createNewBtn');
    const searchInput = document.getElementById('templateSearch');
    
    modal.classList.add('active');
    if(searchInput) searchInput.value = ''; // Reset search on open
    list.innerHTML = '<div style="text-align:center; padding: 20px; color: #64748b;">Loading templates...</div>';
    
    if (type === 'fuel') {
        title.innerText = 'Fuel Billing Options';
        createBtn.onclick = () => location.href = 'fuel-invoice.html';
        currentTargetPage = 'fuel-invoice.html';
        currentDocType = 'Invoice';
        
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
        currentDocType = 'Letter';

        try {
            const result = await TemplateAPI.getLetters();
            currentModalData = result.data || result || [];
            renderModalList(currentModalData);
        } catch(e) {
            list.innerHTML = '<div style="color:red; text-align:center;">Failed to load templates.</div>';
        }
    }
}

// Search functionality for the MODAL only
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
        <div class="template-item" onclick="location.href='${currentTargetPage}?template=${encodeURIComponent(t.templateName)}'" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: background 0.2s;">
            <div class="template-info">
                <span>
                    <i class="fa-regular ${currentDocType === 'Invoice' ? 'fa-file-lines' : 'fa-file-word'}" style="margin-right:8px; color:#94a3b8;"></i>
                    <strong>${t.templateName}</strong>
                </span>
            </div>
            <div class="template-actions" style="display: flex; gap: 8px;">
                <button class="action-icon-btn edit" onclick="event.stopPropagation(); renameDashboardTemplate('${t.templateName}', '${currentDocType}')" title="Rename" style="background: none; border: none; color: #3b82f6; cursor: pointer; font-size: 1rem;">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="action-icon-btn delete" onclick="event.stopPropagation(); deleteDashboardTemplate('${t.templateName}', '${currentDocType}')" title="Delete" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1rem;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function closeModal() {
    document.getElementById('templateModal').classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('templateModal');
    if (event.target === modal) closeModal();
}