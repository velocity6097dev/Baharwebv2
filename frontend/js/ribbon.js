// document.addEventListener("DOMContentLoaded", () => {
//     // 1. Sleek, responsive styles and the Ribbon + Modal + Popup HTML
//     const ribbonHTML = `
//         <style>
//             /* Ribbon and Modal Styles */
//             .document-ribbon { display: flex; flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 5px; }
//             .document-ribbon::-webkit-scrollbar { height: 6px; }
//             .document-ribbon::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            
//             .ribbon-modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 9998; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; }
//             .ribbon-modal-overlay.active { display: flex; }
            
//             .ribbon-modal { background: white; border-radius: 12px; padding: 24px; width: 100%; max-width: 450px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); animation: modalPopIn 0.3s ease-out forwards; max-height: 90vh; display: flex; flex-direction: column; }
//             @keyframes modalPopIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            
//             .ribbon-modal h3 { margin: 0 0 16px 0; font-size: 1.25rem; color: #1e293b; display: flex; align-items: center; gap: 8px; }
//             .ribbon-input { width: 100%; padding: 10px 14px; margin-bottom: 20px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 0.95rem; box-sizing: border-box; transition: 0.2s; }
//             .ribbon-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
//             .ribbon-modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: auto; }
            
//             .ribbon-btn-primary { background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; }
//             .ribbon-btn-primary:hover { background: #059669; }
//             .ribbon-btn-secondary { background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; }
//             .ribbon-btn-secondary:hover { background: #e2e8f0; color: #1e293b; }
            
//             .template-list-ul { list-style: none; padding: 0; margin: 0 0 20px 0; overflow-y: auto; max-height: 400px; }
//             .template-list-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px; transition: 0.2s; }
//             .template-list-item:hover { border-color: #3b82f6; background: #f8fafc; }
//             .template-actions { display: flex; gap: 6px; }
//             .template-actions button { padding: 6px 10px; font-size: 0.85rem; border-radius: 4px; border: none; cursor: pointer; font-weight: 500; }
//             .btn-load { background: #eff6ff; color: #2563eb; } .btn-load:hover { background: #dbeafe; }
//             .btn-del { background: #fef2f2; color: #ef4444; } .btn-del:hover { background: #fee2e2; }

//             /* --- CUSTOM UI ANIMATIONS (Popups & Loaders) --- */
//             #customLoader {
//                 display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
//                 background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(5px); z-index: 99999;
//                 align-items: center; justify-content: center; flex-direction: column; color: white; 
//                 font-family: inherit; font-weight: 600; font-size: 1.1rem;
//             }
//             .spinner {
//                 width: 50px; height: 50px; border: 5px solid rgba(255,255,255,0.2); 
//                 border-top-color: #10b981; border-radius: 50%; animation: spin 1s ease-in-out infinite; 
//                 margin-bottom: 15px;
//             }
//             @keyframes spin { 100% { transform: rotate(360deg); } }

//             #customToast {
//                 position: fixed; top: 20px; right: -350px; background: white; color: #1e293b; 
//                 padding: 14px 20px; border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2); 
//                 border-left: 5px solid #10b981; display: flex; align-items: center; gap: 12px; 
//                 z-index: 100000; font-family: inherit; font-weight: 600; 
//                 transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//             }
//             #customToast.show { right: 20px; }
//             #customToast.error { border-left-color: #ef4444; }

//             #customConfirmOverlay {
//                 display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
//                 background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 99999;
//                 align-items: center; justify-content: center; font-family: inherit;
//             }
//             .custom-confirm-box {
//                 background: white; padding: 24px; border-radius: 12px; width: 90%; max-width: 350px;
//                 box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); text-align: center; animation: modalPopIn 0.2s ease-out forwards;
//             }
//         </style>

//         <div id="customLoader">
//             <div class="spinner"></div>
//             <span id="loaderText">Processing...</span>
//         </div>

//         <div id="customToast">
//             <span id="toastIcon">✅</span>
//             <span id="toastMsg">Success!</span>
//         </div>

//         <div id="customConfirmOverlay">
//             <div class="custom-confirm-box">
//                 <h3 style="margin: 0 0 12px 0; color: #1e293b;">Are you sure?</h3>
//                 <p id="confirmMsg" style="color: #475569; margin-bottom: 20px; font-size: 0.95rem;">This action cannot be undone.</p>
//                 <div style="display: flex; justify-content: center; gap: 12px;">
//                     <button class="ribbon-btn-secondary" onclick="closeConfirm()">Cancel</button>
//                     <button class="ribbon-btn-primary" id="confirmOkBtn" style="background: #ef4444;">Delete</button>
//                 </div>
//             </div>
//         </div>

//         <div class="document-ribbon no-print">
//             <div class="ribbon-group">
//                 <button onmousedown="event.preventDefault(); quickSave()" class="ribbon-btn" style="color: #10b981; font-weight: bold;"><i data-lucide="save" style="width: 16px; height: 16px;"></i> Save</button>
//                 <button onmousedown="event.preventDefault(); window.print()" class="ribbon-btn"><i data-lucide="printer" style="width: 16px; height: 16px;"></i> Print</button>
//                 <button onmousedown="event.preventDefault(); openTemplateList()" class="ribbon-btn"><i data-lucide="folder-open" style="width: 16px; height: 16px;"></i> Templates</button>
//             </div>
//             <div class="ribbon-divider"></div>
//             <div class="ribbon-group">
//                 <button onmousedown="event.preventDefault(); formatText('undo')" class="ribbon-btn" title="Undo"><i data-lucide="undo" style="width: 16px; height: 16px;"></i></button>
//                 <button onmousedown="event.preventDefault(); formatText('redo')" class="ribbon-btn" title="Redo"><i data-lucide="redo" style="width: 16px; height: 16px;"></i></button>
//             </div>
//             <div class="ribbon-divider"></div>
//             <div class="ribbon-group">
//                 <select onchange="formatText('fontName', this.value)" class="ribbon-select" title="Font">
//                     <option value="Poppins">Poppins</option>
//                     <option value="Arial">Arial</option>
//                     <option value="'Times New Roman'">Times New Roman</option>
//                     <option value="'Courier New'">Courier</option>
//                 </select>
//                 <div style="display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 4px; background: white; overflow: hidden;">
//                     <select id="fontSizeSelect" onchange="currentFontSize = parseInt(this.value); formatText('fontSize', this.value)" class="ribbon-select" style="border: none; border-radius: 0;" title="Text Size">
//                         <option value="1">10 pt</option>
//                         <option value="2">12 pt</option>
//                         <option value="3" selected>14 pt (Normal)</option>
//                         <option value="4">18 pt</option>
//                         <option value="5">24 pt (Heading)</option>
//                         <option value="6">32 pt</option>
//                         <option value="7">48 pt</option>
//                     </select>
//                     <button onmousedown="event.preventDefault(); stepFontSize(1)" class="ribbon-btn" style="border: none; border-left: 1px solid #cbd5e1; border-radius: 0; font-weight: bold; padding: 6px 8px;" title="Increase Size">A+</button>
//                     <button onmousedown="event.preventDefault(); stepFontSize(-1)" class="ribbon-btn" style="border: none; border-left: 1px solid #cbd5e1; border-radius: 0; font-weight: bold; padding: 6px 8px;" title="Decrease Size">A-</button>
//                 </div>
//             </div>
//             <div class="ribbon-divider"></div>
//             <div class="ribbon-group">
//                 <button onmousedown="event.preventDefault(); formatText('bold')" class="ribbon-btn" title="Bold" style="font-weight: 800;">B</button>
//                 <button onmousedown="event.preventDefault(); formatText('italic')" class="ribbon-btn" title="Italic" style="font-style: italic;">I</button>
//                 <button onmousedown="event.preventDefault(); formatText('underline')" class="ribbon-btn" title="Underline" style="text-decoration: underline;">U</button>
//                 <div class="ribbon-divider"></div>
//                 <button onmousedown="event.preventDefault(); formatText('foreColor', '#000000')" class="color-swatch" style="background: #000000;" title="Black"></button>
//                 <button onmousedown="event.preventDefault(); formatText('foreColor', '#dc2626')" class="color-swatch" style="background: #dc2626;" title="Red"></button>
//                 <button onmousedown="event.preventDefault(); formatText('foreColor', '#2563eb')" class="color-swatch" style="background: #2563eb;" title="Blue"></button>
//                 <button onmousedown="event.preventDefault(); formatText('foreColor', '#16a34a')" class="color-swatch" style="background: #16a34a;" title="Green"></button>
//                 <button onmousedown="event.preventDefault(); formatText('foreColor', '#ca8a04')" class="color-swatch" style="background: #ca8a04;" title="Yellow"></button>
//                 <div class="ribbon-divider"></div>
//                 <button onmousedown="event.preventDefault(); formatText('removeFormat')" class="ribbon-btn" title="Clear Formatting"><i data-lucide="eraser" style="width: 16px; height: 16px;"></i></button>
//             </div>
//             <div class="ribbon-divider"></div>
//             <div class="ribbon-group">
//                 <button onmousedown="event.preventDefault(); formatText('justifyLeft')" class="ribbon-btn" title="Align Left"><i data-lucide="align-left" style="width: 16px; height: 16px;"></i></button>
//                 <button onmousedown="event.preventDefault(); formatText('justifyCenter')" class="ribbon-btn" title="Align Center"><i data-lucide="align-center" style="width: 16px; height: 16px;"></i></button>
//                 <button onmousedown="event.preventDefault(); formatText('justifyRight')" class="ribbon-btn" title="Align Right"><i data-lucide="align-right" style="width: 16px; height: 16px;"></i></button>
//                 <button onmousedown="event.preventDefault(); formatText('justifyFull')" class="ribbon-btn" title="Justify"><i data-lucide="align-justify" style="width: 16px; height: 16px;"></i></button>
//             </div>
//             <div class="ribbon-divider"></div>
//             <div class="ribbon-group">
//                 <button onmousedown="event.preventDefault(); formatText('insertOrderedList')" class="ribbon-btn" title="Numbering"><i data-lucide="list-ordered" style="width: 16px; height: 16px;"></i></button>
//                 <button onmousedown="event.preventDefault(); formatText('insertUnorderedList')" class="ribbon-btn" title="Bullets"><i data-lucide="list" style="width: 16px; height: 16px;"></i></button>
//             </div>
//         </div>

//         <div id="modalOverlay" class="ribbon-modal-overlay no-print" onclick="closeAllRibbonModals(event)">
//             <div id="templateNameModal" class="ribbon-modal" style="display:none;" onclick="event.stopPropagation()">
//                 <h3 id="modalTitle"><i data-lucide="save"></i> Save Template</h3>
//                 <input type="text" id="templateNameInput" class="ribbon-input" placeholder="Enter template name...">
//                 <input type="hidden" id="editingTemplateOldName"> 
//                 <div class="ribbon-modal-footer">
//                     <button type="button" class="ribbon-btn-secondary" onclick="closeRibbonModal('templateNameModal')">Cancel</button>
//                     <button type="button" class="ribbon-btn-primary" onclick="saveTemplate(false)">Save Document</button>
//                 </div>
//             </div>

//             <div id="templateListModal" class="ribbon-modal" style="display:none; max-width: 600px;" onclick="event.stopPropagation()">
//                 <h3><i data-lucide="folder-open"></i> Saved Templates</h3>
//                 <ul id="templateListContainer" class="template-list-ul"></ul>
//                 <div class="ribbon-modal-footer">
//                     <button type="button" class="ribbon-btn-secondary" onclick="closeRibbonModal('templateListModal')">Close Menu</button>
//                 </div>
//             </div>
//         </div>
//     `;

//     const header = document.getElementById("universal-header");
//     if (header) {
//         header.insertAdjacentHTML('afterend', ribbonHTML);
//         if (typeof lucide !== 'undefined') lucide.createIcons();
//     }
// });

// // --- CUSTOM UI FUNCTIONS ---
// window.showLoader = function(text = "Processing...") {
//     document.getElementById('loaderText').innerText = text;
//     document.getElementById('customLoader').style.display = 'flex';
// };
// window.hideLoader = function() {
//     document.getElementById('customLoader').style.display = 'none';
// };
// window.showToast = function(msg, type = 'success') {
//     const toast = document.getElementById('customToast');
//     document.getElementById('toastMsg').innerText = msg;
//     if (type === 'error') {
//         toast.className = 'error show';
//         document.getElementById('toastIcon').innerText = '❌';
//     } else {
//         toast.className = 'show';
//         document.getElementById('toastIcon').innerText = '✅';
//     }
//     setTimeout(() => { toast.classList.remove('show'); }, 3000);
// };
// window.customConfirm = function(msg, onConfirm) {
//     document.getElementById('confirmMsg').innerText = msg;
//     document.getElementById('customConfirmOverlay').style.display = 'flex';
//     document.getElementById('confirmOkBtn').onclick = () => {
//         closeConfirm();
//         onConfirm();
//     };
// };
// window.closeConfirm = function() {
//     document.getElementById('customConfirmOverlay').style.display = 'none';
// };


// // --- FORMATTING ---
// window.formatText = function(command, value = null) { document.execCommand(command, false, value); };
// window.currentFontSize = 3;
// window.stepFontSize = function(direction) {
//     currentFontSize += direction;
//     if (currentFontSize < 1) currentFontSize = 1;
//     if (currentFontSize > 7) currentFontSize = 7;
//     const sizeSelect = document.getElementById('fontSizeSelect');
//     if (sizeSelect) sizeSelect.value = currentFontSize;
//     formatText('fontSize', currentFontSize);
// };

// // --- TEMPLATE LOGIC ---
// window.currentActiveTemplate = new URLSearchParams(window.location.search).get('template') || '';

// function getApiEndpoint() {
//     return window.location.pathname.includes('letter') ? '/api/templates/letter' : '/api/templates/invoice';
// }

// window.closeAllRibbonModals = function(event) {
//     const overlay = document.getElementById('modalOverlay');
//     if(event.target === overlay) {
//         overlay.classList.remove('active');
//         document.getElementById('templateNameModal').style.display = 'none';
//         document.getElementById('templateListModal').style.display = 'none';
//     }
// }

// window.quickSave = function() {
//     if (window.currentActiveTemplate) {
//         document.getElementById('editingTemplateOldName').value = window.currentActiveTemplate;
//         document.getElementById('templateNameInput').value = window.currentActiveTemplate;
//         saveTemplate(true); 
//     } else {
//         openSaveModal();
//     }
// };

// window.openSaveModal = function(oldName = '', currentName = '') {
//     document.getElementById('templateListModal').style.display = 'none'; 
//     document.getElementById('modalOverlay').classList.add('active');
//     document.getElementById('templateNameModal').style.display = 'flex';
//     document.getElementById('editingTemplateOldName').value = oldName; 
//     document.getElementById('templateNameInput').value = currentName;
//     document.getElementById('modalTitle').innerHTML = oldName ? '<i data-lucide="edit"></i> Rename Template' : '<i data-lucide="save"></i> Save New Template';
//     if (typeof lucide !== 'undefined') lucide.createIcons();
//     document.getElementById('templateNameInput').focus();
// };

// window.closeRibbonModal = function(modalId) {
//     document.getElementById(modalId).style.display = 'none';
//     document.getElementById('modalOverlay').classList.remove('active');
// };

// window.saveTemplate = async function(isQuickSave = false) {
//     const templateName = document.getElementById('templateNameInput').value.trim();
//     const oldName = document.getElementById('editingTemplateOldName').value;
    
//     if (!templateName) return showToast("Please enter a name for the template.", "error");
    
//     const editorElement = document.getElementById('printableInvoice') || document.querySelector('.editable-content');
//     const htmlData = editorElement ? editorElement.innerHTML : "";
//     const apiBase = getApiEndpoint();
//     const isLetter = window.location.pathname.includes('letter');
    
//     showLoader("Saving Template..."); // Trigger Animation!
    
//     try {
//         if (oldName && oldName !== templateName) {
//             const renameRes = await fetch(`${apiBase}/${encodeURIComponent(oldName)}`, {
//                 method: 'PUT', headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ newTemplateName: templateName })
//             });
//             if (!renameRes.ok) throw new Error("Failed to rename");
//         }
        
//         const payload = isLetter 
//             ? { templateName: templateName, htmlData: htmlData, subject: 'No Subject', toAddress: '' }
//             : { templateName: templateName, htmlData: htmlData, invoiceType: 'fuel', columns: [], deductions: [] };

//         const response = await fetch(apiBase, {
//             method: 'POST', headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });
        
//         if(response.ok) {
//             showToast("Template saved successfully!", "success"); // Custom Popup!
//             window.currentActiveTemplate = templateName;
//             window.history.replaceState(null, '', '?template=' + encodeURIComponent(templateName));

//             if (!isQuickSave) {
//                 window.closeRibbonModal('templateNameModal');
//                 if (document.getElementById('templateListModal').dataset.wasOpen === 'true') {
//                     window.openTemplateList();
//                 }
//             }
//         } else {
//             showToast("Error saving template to database.", "error");
//         }
//     } catch (err) {
//         console.error(err);
//         showToast("Failed to connect to the server.", "error");
//     } finally {
//         hideLoader(); // Remove Animation
//     }
// };

// window.openTemplateList = async function() {
//     document.getElementById('templateNameModal').style.display = 'none';
//     document.getElementById('modalOverlay').classList.add('active');
//     document.getElementById('templateListModal').style.display = 'flex';
//     document.getElementById('templateListModal').dataset.wasOpen = 'true';
    
//     const container = document.getElementById('templateListContainer');
//     container.innerHTML = "<li style='text-align:center; padding: 20px; color:#64748b;'><div class='spinner' style='margin: 0 auto; width:30px; height:30px;'></div></li>";
    
//     const apiBase = getApiEndpoint();
//     try {
//         const response = await fetch(apiBase);
//         if (!response.ok) throw new Error("Network response not ok");
//         const templates = await response.json();
        
//         container.innerHTML = '';
//         if (templates.length === 0) {
//             container.innerHTML = "<li style='text-align:center; padding: 20px; color:#64748b;'>No templates found.</li>";
//             return;
//         }
        
//         templates.forEach(tpl => {
//             const li = document.createElement('li');
//             li.className = 'template-list-item';
//             li.innerHTML = `
//                 <span style="font-weight:bold; color:#1e293b;">${tpl.templateName}</span>
//                 <div class="template-actions">
//                     <button class="btn-load" onclick="loadTemplate('${tpl.templateName}')">Load</button>
//                     <button class="btn-load" onclick="openSaveModal('${tpl.templateName}', '${tpl.templateName}')">Rename</button>
//                     <button class="btn-del" onclick="deleteTemplate('${tpl.templateName}')">Delete</button>
//                 </div>
//             `;
//             container.appendChild(li);
//         });
//     } catch (err) {
//         container.innerHTML = "<li style='text-align:center; padding: 20px; color:red;'>Failed to load templates.</li>";
//     }
// };

// window.deleteTemplate = function(name) {
//     // Custom Confirm Box!
//     customConfirm(`Are you sure you want to delete "${name}"?`, async () => {
//         showLoader("Deleting...");
//         const apiBase = getApiEndpoint();
//         try {
//             await fetch(`${apiBase}/${encodeURIComponent(name)}`, { method: 'DELETE' });
//             if (window.currentActiveTemplate === name) {
//                 window.currentActiveTemplate = '';
//                 window.history.replaceState(null, '', window.location.pathname);
//             }
//             showToast("Template deleted successfully.", "success");
//             window.openTemplateList(); 
//         } catch (err) {
//             showToast("Delete failed", "error");
//         } finally {
//             hideLoader();
//         }
//     });
// };

// window.loadTemplate = async function(name) {
//     showLoader("Loading Document..."); // Animation!
//     const apiBase = getApiEndpoint();
//     try {
//         const response = await fetch(`${apiBase}/${encodeURIComponent(name)}`);
//         const tpl = await response.json();
        
//         if (tpl && tpl.htmlData) {
//             const editorElement = document.getElementById('printableInvoice') || document.querySelector('.editable-content');
//             if (editorElement) {
//                 editorElement.innerHTML = tpl.htmlData;
                
//                 if (document.getElementById('printableInvoice')) {
//                     document.querySelectorAll('#printableInvoice select').forEach(sel => {
//                         const selectedOpt = sel.querySelector('option[selected]');
//                         if(selectedOpt) sel.value = selectedOpt.value;
//                     });
//                     if (typeof setupEventListeners === 'function') setupEventListeners();
//                     if (typeof calculateAll === 'function') calculateAll();
//                 }
//             }
//             window.currentActiveTemplate = name;
//             window.history.replaceState(null, '', '?template=' + encodeURIComponent(name));
//             window.closeRibbonModal('templateListModal');
//             document.getElementById('templateListModal').dataset.wasOpen = 'false';
            
//             showToast("Template loaded!", "success"); // Success Popup!
//         } else {
//             showToast("Could not load template data.", "error");
//         }
//     } catch (err) {
//         showToast("Error pulling template from database.", "error");
//     } finally {
//         hideLoader();
//     }
// };

document.addEventListener("DOMContentLoaded", () => {
    // 1. Sleek, responsive styles and the Ribbon + Modal + Popup HTML
    const ribbonHTML = `
        <style>
            /* Ribbon and Modal Styles */
            .document-ribbon { display: flex; flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 5px; }
            .document-ribbon::-webkit-scrollbar { height: 6px; }
            .document-ribbon::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            
            .ribbon-modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 9998; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; }
            .ribbon-modal-overlay.active { display: flex; }
            
            .ribbon-modal { background: white; border-radius: 12px; padding: 24px; width: 100%; max-width: 450px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); animation: modalPopIn 0.3s ease-out forwards; max-height: 90vh; display: flex; flex-direction: column; }
            @keyframes modalPopIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            
            .ribbon-modal h3 { margin: 0 0 16px 0; font-size: 1.25rem; color: #1e293b; display: flex; align-items: center; gap: 8px; }
            .ribbon-input { width: 100%; padding: 10px 14px; margin-bottom: 20px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 0.95rem; box-sizing: border-box; transition: 0.2s; }
            .ribbon-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
            .ribbon-modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: auto; }
            
            .ribbon-btn-primary { background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; }
            .ribbon-btn-primary:hover { background: #059669; }
            .ribbon-btn-secondary { background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; }
            .ribbon-btn-secondary:hover { background: #e2e8f0; color: #1e293b; }
            
            .template-list-ul { list-style: none; padding: 0; margin: 0 0 20px 0; overflow-y: auto; max-height: 400px; }
            .template-list-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px; transition: 0.2s; }
            .template-list-item:hover { border-color: #3b82f6; background: #f8fafc; }
            .template-actions { display: flex; gap: 6px; }
            .template-actions button { padding: 6px 10px; font-size: 0.85rem; border-radius: 4px; border: none; cursor: pointer; font-weight: 500; }
            .btn-load { background: #eff6ff; color: #2563eb; } .btn-load:hover { background: #dbeafe; }
            .btn-del { background: #fef2f2; color: #ef4444; } .btn-del:hover { background: #fee2e2; }

            /* --- CUSTOM UI ANIMATIONS (Popups & Loaders) --- */
            #customLoader {
                display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(5px); z-index: 99999;
                align-items: center; justify-content: center; flex-direction: column; color: white; 
                font-family: inherit; font-weight: 600; font-size: 1.1rem;
            }
            .spinner {
                width: 50px; height: 50px; border: 5px solid rgba(255,255,255,0.2); 
                border-top-color: #10b981; border-radius: 50%; animation: spin 1s ease-in-out infinite; 
                margin-bottom: 15px;
            }
            @keyframes spin { 100% { transform: rotate(360deg); } }

            #customToast {
                position: fixed; top: 20px; right: -350px; background: white; color: #1e293b; 
                padding: 14px 20px; border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2); 
                border-left: 5px solid #10b981; display: flex; align-items: center; gap: 12px; 
                z-index: 100000; font-family: inherit; font-weight: 600; 
                transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            #customToast.show { right: 20px; }
            #customToast.error { border-left-color: #ef4444; }

            #customConfirmOverlay {
                display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 99999;
                align-items: center; justify-content: center; font-family: inherit;
            }
            .custom-confirm-box {
                background: white; padding: 24px; border-radius: 12px; width: 90%; max-width: 350px;
                box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); text-align: center; animation: modalPopIn 0.2s ease-out forwards;
            }
        </style>

        <div id="customLoader">
            <div class="spinner"></div>
            <span id="loaderText">Processing...</span>
        </div>

        <div id="customToast">
            <span id="toastIcon">✅</span>
            <span id="toastMsg">Success!</span>
        </div>

        <div id="customConfirmOverlay">
            <div class="custom-confirm-box">
                <h3 style="margin: 0 0 12px 0; color: #1e293b;">Are you sure?</h3>
                <p id="confirmMsg" style="color: #475569; margin-bottom: 20px; font-size: 0.95rem;">This action cannot be undone.</p>
                <div style="display: flex; justify-content: center; gap: 12px;">
                    <button class="ribbon-btn-secondary" onclick="closeConfirm()">Cancel</button>
                    <button class="ribbon-btn-primary" id="confirmOkBtn" style="background: #ef4444;">Delete</button>
                </div>
            </div>
        </div>

        <div class="document-ribbon no-print">
            <div class="ribbon-group">
                <button onmousedown="event.preventDefault(); quickSave()" class="ribbon-btn" style="color: #10b981; font-weight: bold;"><i data-lucide="save" style="width: 16px; height: 16px;"></i> Save</button>
                <button onmousedown="event.preventDefault(); window.print()" class="ribbon-btn"><i data-lucide="printer" style="width: 16px; height: 16px;"></i> Print</button>
                <button onmousedown="event.preventDefault(); openTemplateList()" class="ribbon-btn"><i data-lucide="folder-open" style="width: 16px; height: 16px;"></i> Templates</button>
            </div>
            
            <div class="ribbon-divider"></div>
            
            <div class="ribbon-group">
                <button onmousedown="event.preventDefault(); formatText('undo')" class="ribbon-btn" title="Undo"><i data-lucide="undo" style="width: 16px; height: 16px;"></i></button>
                <button onmousedown="event.preventDefault(); formatText('redo')" class="ribbon-btn" title="Redo"><i data-lucide="redo" style="width: 16px; height: 16px;"></i></button>
            </div>

            <div class="ribbon-divider"></div>

            <div class="ribbon-group">
                <select onchange="formatText('fontName', this.value)" class="ribbon-select" title="Font">
                    <option value="Poppins">Poppins</option>
                    <option value="Arial">Arial</option>
                    <option value="'Times New Roman'">Times New Roman</option>
                    <option value="'Courier New'">Courier</option>
                </select>
                <div style="display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 4px; background: white; overflow: hidden;">
                    <select id="fontSizeSelect" onchange="currentFontSize = parseInt(this.value); formatText('fontSize', this.value)" class="ribbon-select" style="border: none; border-radius: 0;" title="Text Size">
                        <option value="1">10 pt</option>
                        <option value="2">12 pt</option>
                        <option value="3" selected>14 pt (Normal)</option>
                        <option value="4">18 pt</option>
                        <option value="5">24 pt (Heading)</option>
                        <option value="6">32 pt</option>
                        <option value="7">48 pt</option>
                    </select>
                    <button onmousedown="event.preventDefault(); stepFontSize(1)" class="ribbon-btn" style="border: none; border-left: 1px solid #cbd5e1; border-radius: 0; font-weight: bold; padding: 6px 8px;" title="Increase Size">A+</button>
                    <button onmousedown="event.preventDefault(); stepFontSize(-1)" class="ribbon-btn" style="border: none; border-left: 1px solid #cbd5e1; border-radius: 0; font-weight: bold; padding: 6px 8px;" title="Decrease Size">A-</button>
                </div>
            </div>

            <div class="ribbon-divider"></div>

            <div class="ribbon-group">
                <button onmousedown="event.preventDefault(); formatText('bold')" class="ribbon-btn" title="Bold" style="font-weight: 800;">B</button>
                <button onmousedown="event.preventDefault(); formatText('italic')" class="ribbon-btn" title="Italic" style="font-style: italic;">I</button>
                <button onmousedown="event.preventDefault(); formatText('underline')" class="ribbon-btn" title="Underline" style="text-decoration: underline;">U</button>
                
                <div class="ribbon-divider"></div>
                
                <button onmousedown="event.preventDefault(); formatText('foreColor', '#000000')" class="color-swatch" style="background: #000000;" title="Black"></button>
                <button onmousedown="event.preventDefault(); formatText('foreColor', '#dc2626')" class="color-swatch" style="background: #dc2626;" title="Red"></button>
                <button onmousedown="event.preventDefault(); formatText('foreColor', '#2563eb')" class="color-swatch" style="background: #2563eb;" title="Blue"></button>
                <button onmousedown="event.preventDefault(); formatText('foreColor', '#16a34a')" class="color-swatch" style="background: #16a34a;" title="Green"></button>
                <button onmousedown="event.preventDefault(); formatText('foreColor', '#ca8a04')" class="color-swatch" style="background: #ca8a04;" title="Yellow"></button>
                
                <div class="ribbon-divider"></div>
                
                <button onmousedown="event.preventDefault(); formatText('removeFormat')" class="ribbon-btn" title="Clear Formatting"><i data-lucide="eraser" style="width: 16px; height: 16px;"></i></button>
            </div>

            <div class="ribbon-divider"></div>

            <div class="ribbon-group">
                <button onmousedown="event.preventDefault(); formatText('justifyLeft')" class="ribbon-btn" title="Align Left"><i data-lucide="align-left" style="width: 16px; height: 16px;"></i></button>
                <button onmousedown="event.preventDefault(); formatText('justifyCenter')" class="ribbon-btn" title="Align Center"><i data-lucide="align-center" style="width: 16px; height: 16px;"></i></button>
                <button onmousedown="event.preventDefault(); formatText('justifyRight')" class="ribbon-btn" title="Align Right"><i data-lucide="align-right" style="width: 16px; height: 16px;"></i></button>
                <button onmousedown="event.preventDefault(); formatText('justifyFull')" class="ribbon-btn" title="Justify"><i data-lucide="align-justify" style="width: 16px; height: 16px;"></i></button>
            </div>

            <div class="ribbon-divider"></div>

            <div class="ribbon-group">
                <button onmousedown="event.preventDefault(); formatText('insertOrderedList')" class="ribbon-btn" title="Numbering"><i data-lucide="list-ordered" style="width: 16px; height: 16px;"></i></button>
                <button onmousedown="event.preventDefault(); formatText('insertUnorderedList')" class="ribbon-btn" title="Bullets"><i data-lucide="list" style="width: 16px; height: 16px;"></i></button>
            </div>
        </div>

        <div id="modalOverlay" class="ribbon-modal-overlay no-print" onclick="closeAllRibbonModals(event)">
            <div id="templateNameModal" class="ribbon-modal" style="display:none;" onclick="event.stopPropagation()">
                <h3 id="modalTitle"><i data-lucide="save"></i> Save Template</h3>
                <input type="text" id="templateNameInput" class="ribbon-input" placeholder="Enter template name...">
                <input type="hidden" id="editingTemplateOldName"> 
                <div class="ribbon-modal-footer">
                    <button type="button" class="ribbon-btn-secondary" onclick="closeRibbonModal('templateNameModal')">Cancel</button>
                    <button type="button" class="ribbon-btn-primary" onclick="saveTemplate(false)">Save Document</button>
                </div>
            </div>

            <div id="templateListModal" class="ribbon-modal" style="display:none; max-width: 600px;" onclick="event.stopPropagation()">
                <h3><i data-lucide="folder-open"></i> Saved Templates</h3>
                <ul id="templateListContainer" class="template-list-ul"></ul>
                <div class="ribbon-modal-footer">
                    <button type="button" class="ribbon-btn-secondary" onclick="closeRibbonModal('templateListModal')">Close Menu</button>
                </div>
            </div>
        </div>
    `;

    const header = document.getElementById("universal-header");
    if (header) {
        header.insertAdjacentHTML('afterend', ribbonHTML);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
});

// --- CUSTOM UI FUNCTIONS ---
window.showLoader = function(text = "Processing...") {
    document.getElementById('loaderText').innerText = text;
    document.getElementById('customLoader').style.display = 'flex';
};
window.hideLoader = function() {
    document.getElementById('customLoader').style.display = 'none';
};
window.showToast = function(msg, type = 'success') {
    const toast = document.getElementById('customToast');
    document.getElementById('toastMsg').innerText = msg;
    if (type === 'error') {
        toast.className = 'error show';
        document.getElementById('toastIcon').innerText = '❌';
    } else {
        toast.className = 'show';
        document.getElementById('toastIcon').innerText = '✅';
    }
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
};
window.customConfirm = function(msg, onConfirm) {
    document.getElementById('confirmMsg').innerText = msg;
    document.getElementById('customConfirmOverlay').style.display = 'flex';
    document.getElementById('confirmOkBtn').onclick = () => {
        closeConfirm();
        onConfirm();
    };
};
window.closeConfirm = function() {
    document.getElementById('customConfirmOverlay').style.display = 'none';
};

// --- FORMATTING ---
window.formatText = function(command, value = null) {
    document.execCommand(command, false, value);
};

// Logic for the A+ and A- buttons
window.currentFontSize = 3;
window.stepFontSize = function(direction) {
    currentFontSize += direction;
    if (currentFontSize < 1) currentFontSize = 1;
    if (currentFontSize > 7) currentFontSize = 7;
    const sizeSelect = document.getElementById('fontSizeSelect');
    if (sizeSelect) sizeSelect.value = currentFontSize;
    formatText('fontSize', currentFontSize);
};

// --- TEMPLATE LOGIC ---
// Track the currently active template so we can quick-save
window.currentActiveTemplate = new URLSearchParams(window.location.search).get('template') || '';

// Helper function to detect which page we are on
function getApiEndpoint() {
    return window.location.pathname.includes('letter') 
        ? '/api/templates/letter' 
        : '/api/templates/invoice';
}

window.closeAllRibbonModals = function(event) {
    const overlay = document.getElementById('modalOverlay');
    if(event.target === overlay) {
        overlay.classList.remove('active');
        document.getElementById('templateNameModal').style.display = 'none';
        document.getElementById('templateListModal').style.display = 'none';
    }
}

// Quick Save: Checks if we already have a loaded file to overwrite
window.quickSave = function() {
    if (window.currentActiveTemplate) {
        // We are editing an existing document. Set the hidden fields and save directly!
        document.getElementById('editingTemplateOldName').value = window.currentActiveTemplate;
        document.getElementById('templateNameInput').value = window.currentActiveTemplate;
        saveTemplate(true); // pass 'true' to indicate this is a quick background save
    } else {
        // We are starting fresh. Ask for a name.
        openSaveModal();
    }
};

window.openSaveModal = function(oldName = '', currentName = '') {
    document.getElementById('templateListModal').style.display = 'none'; 
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('templateNameModal').style.display = 'flex';
    document.getElementById('editingTemplateOldName').value = oldName; 
    document.getElementById('templateNameInput').value = currentName;
    
    document.getElementById('modalTitle').innerHTML = oldName 
        ? '<i data-lucide="edit"></i> Rename Template' 
        : '<i data-lucide="save"></i> Save New Template';
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.getElementById('templateNameInput').focus();
};

window.closeRibbonModal = function(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.getElementById('modalOverlay').classList.remove('active');
};

// Unified Save/Rename logic that respects Quick Saves
window.saveTemplate = async function(isQuickSave = false) {
    const templateName = document.getElementById('templateNameInput').value.trim();
    const oldName = document.getElementById('editingTemplateOldName').value;
    
    if (!templateName) return showToast("Please enter a name for the template.", "error");
    
    const editorElement = document.getElementById('printableInvoice') || document.querySelector('.editable-content');
    
    // FIX FOR FUEL INVOICES: Lock input values into the HTML so they don't disappear when saved
    if (editorElement) {
        editorElement.querySelectorAll('input').forEach(el => {
            if (el.type === 'checkbox' || el.type === 'radio') {
                if (el.checked) el.setAttribute('checked', 'checked');
                else el.removeAttribute('checked');
            } else {
                el.setAttribute('value', el.value);
            }
        });
        editorElement.querySelectorAll('textarea').forEach(el => {
            el.innerHTML = el.value; 
        });
        editorElement.querySelectorAll('select').forEach(el => {
            Array.from(el.options).forEach(opt => {
                if (opt.value === el.value) opt.setAttribute('selected', 'selected');
                else opt.removeAttribute('selected');
            });
        });
    }

    const htmlData = editorElement ? editorElement.innerHTML : "";
    const apiBase = getApiEndpoint();
    const isLetter = window.location.pathname.includes('letter');
    
    showLoader("Saving Template..."); // Trigger Animation!
    
    try {
        if (oldName && oldName !== templateName) {
            const renameRes = await fetch(`${apiBase}/${encodeURIComponent(oldName)}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newTemplateName: templateName })
            });
            if (!renameRes.ok) throw new Error("Failed to rename");
        }
        
        const payload = isLetter 
            ? { templateName: templateName, htmlData: htmlData, subject: 'No Subject', toAddress: '' }
            : { templateName: templateName, htmlData: htmlData, invoiceType: 'fuel', columns: [], deductions: [] };

        const response = await fetch(apiBase, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if(response.ok) {
            showToast("Saved! Redirecting to Dashboard...", "success"); 
            
            window.currentActiveTemplate = templateName;
            window.history.replaceState(null, '', '?template=' + encodeURIComponent(templateName));

            // FIX: Redirect directly to Index immediately after a successful save
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } else {
            showToast("Error saving template to database.", "error");
        }
    } catch (err) {
        console.error(err);
        showToast("Failed to connect to the server.", "error");
    } finally {
        hideLoader(); // Remove Animation
    }
};

window.openTemplateList = async function() {
    document.getElementById('templateNameModal').style.display = 'none';
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('templateListModal').style.display = 'flex';
    document.getElementById('templateListModal').dataset.wasOpen = 'true';
    
    const container = document.getElementById('templateListContainer');
    container.innerHTML = "<li style='text-align:center; padding: 20px; color:#64748b;'><div class='spinner' style='margin: 0 auto; width:30px; height:30px;'></div></li>";
    
    const apiBase = getApiEndpoint();
    try {
        const response = await fetch(apiBase);
        if (!response.ok) throw new Error("Network response not ok");
        const templates = await response.json();
        
        container.innerHTML = '';
        if (templates.length === 0) {
            container.innerHTML = "<li style='text-align:center; padding: 20px; color:#64748b;'>No templates found.</li>";
            return;
        }
        
        templates.forEach(tpl => {
            const li = document.createElement('li');
            li.className = 'template-list-item';
            li.innerHTML = `
                <span style="font-weight:bold; color:#1e293b;">${tpl.templateName}</span>
                <div class="template-actions">
                    <button class="btn-load" onclick="loadTemplate('${tpl.templateName}')">Load</button>
                    <button class="btn-load" onclick="openSaveModal('${tpl.templateName}', '${tpl.templateName}')">Rename</button>
                    <button class="btn-del" onclick="deleteTemplate('${tpl.templateName}')">Delete</button>
                </div>
            `;
            container.appendChild(li);
        });
    } catch (err) {
        container.innerHTML = "<li style='text-align:center; padding: 20px; color:red;'>Failed to load templates.</li>";
    }
};

window.deleteTemplate = function(name) {
    // Custom Confirm Box!
    customConfirm(`Are you sure you want to delete "${name}"?`, async () => {
        showLoader("Deleting...");
        const apiBase = getApiEndpoint();
        try {
            await fetch(`${apiBase}/${encodeURIComponent(name)}`, { method: 'DELETE' });
            if (window.currentActiveTemplate === name) {
                window.currentActiveTemplate = '';
                window.history.replaceState(null, '', window.location.pathname);
            }
            showToast("Template deleted successfully.", "success");
            window.openTemplateList(); 
        } catch (err) {
            showToast("Delete failed", "error");
        } finally {
            hideLoader();
        }
    });
};

window.loadTemplate = async function(name) {
    showLoader("Loading Document..."); // Animation!
    const apiBase = getApiEndpoint();
    try {
        const response = await fetch(`${apiBase}/${encodeURIComponent(name)}`);
        const tpl = await response.json();
        
        if (tpl && tpl.htmlData) {
            const editorElement = document.getElementById('printableInvoice') || document.querySelector('.editable-content');
            if (editorElement) {
                editorElement.innerHTML = tpl.htmlData;
                
                if (document.getElementById('printableInvoice')) {
                    document.querySelectorAll('#printableInvoice select').forEach(sel => {
                        const selectedOpt = sel.querySelector('option[selected]');
                        if(selectedOpt) sel.value = selectedOpt.value;
                    });
                    if (typeof setupEventListeners === 'function') setupEventListeners();
                    if (typeof calculateAll === 'function') calculateAll();
                }
            }
            window.currentActiveTemplate = name;
            window.history.replaceState(null, '', '?template=' + encodeURIComponent(name));
            window.closeRibbonModal('templateListModal');
            document.getElementById('templateListModal').dataset.wasOpen = 'false';
            
            showToast("Template loaded!", "success"); // Success Popup!
        } else {
            showToast("Could not load template data.", "error");
        }
    } catch (err) {
        showToast("Error pulling template from database.", "error");
    } finally {
        hideLoader();
    }
};