// frontend/js/ribbon.js
//
// Owns the single unified "#bahar-ribbon" strip at the top of every editor
// page: the Save / Print / Export / Templates / Ref No. / Signature /
// Page Tools / Move Blocks action row, plus the empty "#hugerte-format-
// toolbar" container that hugerte-setup.js renders HugeRTE's own
// formatting buttons into directly underneath it. Both rows are children
// of the same sticky wrapper, so they read - and scroll - as one ribbon
// instead of two separate bars.
//
// This file also owns the save/load modals, the reference-number and
// signature/stamp modals, generic dropdown-menu plumbing, and the backend
// template CRUD calls. The actual behaviour behind Export / Ref No. /
// Signature / Page Tools / Move Blocks lives in frontend/js/bahar-tools.js
// - this file just renders the buttons and wires them up.
//
// The old document.execCommand()-based formatting toolbar (bold, italic,
// font, colors, alignment, lists...) that used to live here has been
// replaced by HugeRTE - see frontend/js/hugerte-setup.js.

document.addEventListener("DOMContentLoaded", () => {
    const actionBarHTML = `
        <style>
            /* ============================================================
               THE BAHAR RIBBON
               One sticky strip: an action row (this file) stacked directly
               on top of HugeRTE's own formatting row (hugerte.css /
               hugerte-setup.js). Sticky (not fixed) so it reserves its own
               space in normal flow - no JS needed to pad the page under it
               - and simply docks to the top of the viewport once you
               scroll past where it naturally sits.
               ============================================================ */
            #bahar-ribbon {
                position: sticky;
                top: 0;
                z-index: 1000;
                background: #f8fafc;
                border-bottom: 2px solid #cbd5e1;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }

            .bahar-ribbon-actions {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 8px;
                padding: 8px 15px;
            }

            .bahar-ribbon-sep {
                width: 1px;
                align-self: stretch;
                background: #cbd5e1;
                margin: 2px 4px;
            }

            /* --- Buttons --- */
            .bahar-btn {
                position: relative;
                background: white;
                border: 1px solid #cbd5e1;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                color: #1e293b;
                font-size: 14px;
                font-family: inherit;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 6px;
                white-space: nowrap;
            }
            .bahar-btn:hover, .bahar-btn.active { background: #e2e8f0; border-color: #94a3b8; }
            .bahar-btn.primary { color: #10b981; font-weight: bold; }
            .bahar-btn i, .bahar-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
            .bahar-btn .bahar-caret { width: 12px; height: 12px; opacity: 0.6; margin-left: -2px; }

            /* Every ribbon control that carries a data-tip shows a small
               dark tooltip on hover/focus explaining what it does - covers
               the "icons should show their name on hover" requirement for
               every custom Bahar button (HugeRTE's own buttons already
               show native tooltips out of the box). */
            [data-tip] { position: relative; }
            [data-tip]::after {
                content: attr(data-tip);
                position: absolute;
                top: calc(100% + 8px);
                left: 50%;
                transform: translateX(-50%) translateY(-4px);
                background: #1e293b;
                color: white;
                padding: 5px 9px;
                border-radius: 5px;
                font-size: 12px;
                font-weight: 500;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.15s ease, transform 0.15s ease;
                z-index: 1200;
            }
            [data-tip]:hover::after, [data-tip]:focus-visible::after {
                opacity: 1;
                visibility: visible;
                transform: translateX(-50%) translateY(0);
                transition-delay: 0.35s;
            }

            /* --- Dropdown / split buttons (Export, Page Tools) --- */
            .bahar-dropdown { position: relative; display: inline-flex; }
            .bahar-dropdown-menu {
                display: none;
                position: absolute;
                top: calc(100% + 6px);
                left: 0;
                min-width: 220px;
                background: white;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
                padding: 6px;
                z-index: 1100;
            }
            .bahar-dropdown.open .bahar-dropdown-menu { display: block; }
            .bahar-dropdown-menu button {
                width: 100%;
                background: none;
                border: none;
                text-align: left;
                padding: 8px 10px;
                border-radius: 6px;
                cursor: pointer;
                color: #1e293b;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .bahar-dropdown-menu button:hover { background: #f1f5f9; }
            .bahar-dropdown-menu i, .bahar-dropdown-menu svg { width: 15px; height: 15px; opacity: 0.7; }

            /* --- Modal Styles --- */
            .ribbon-modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 9998; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; }
            .ribbon-modal-overlay.active { display: flex; }

            .ribbon-modal { background: white; border-radius: 12px; padding: 24px; width: 100%; max-width: 450px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); animation: modalPopIn 0.3s ease-out forwards; max-height: 90vh; display: flex; flex-direction: column; }
            @keyframes modalPopIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

            .ribbon-modal h3 { margin: 0 0 16px 0; font-size: 1.25rem; color: #1e293b; display: flex; align-items: center; gap: 8px; }
            .ribbon-modal h3 i, .ribbon-modal h3 svg { width: 20px; height: 20px; }
            .ribbon-input { width: 100%; padding: 10px 14px; margin-bottom: 20px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 0.95rem; box-sizing: border-box; transition: 0.2s; }
            .ribbon-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
            .ribbon-modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: auto; padding-top: 16px; }

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

            /* --- Reference Number modal --- */
            #refNumPreview { font-family: 'Courier New', monospace; font-weight: 600; }

            /* --- Signature / Stamp modal --- */
            .bahar-tabs { display: flex; gap: 4px; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
            .bahar-tab { background: none; border: none; padding: 8px 14px; cursor: pointer; font-weight: 600; color: #64748b; border-bottom: 2px solid transparent; margin-bottom: -1px; }
            .bahar-tab.active { color: #2563eb; border-bottom-color: #2563eb; }
            .bahar-tab-panel { margin-bottom: 16px; }
            #sigCanvas { width: 100%; max-width: 100%; height: 180px; border: 1px dashed #cbd5e1; border-radius: 8px; background: white; cursor: crosshair; touch-action: none; display: block; }
            .bahar-sig-tools { display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px; }
            .bahar-color-swatches { display: flex; gap: 6px; align-items: center; margin-right: auto; }
            .bahar-color-swatch { width: 22px; height: 22px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; }
            .bahar-color-swatch.active { border-color: #3b82f6; }
            #sigUploadInput { width: 100%; margin-bottom: 12px; }
            #sigUploadPreviewWrap { min-height: 100px; border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #f8fafc; }
            #sigUploadPreview { max-width: 100%; max-height: 160px; display: none; }

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

        <div id="bahar-ribbon" class="no-print">
            <div class="bahar-ribbon-actions">
                <button class="bahar-btn primary" data-tip="Save this document (Ctrl+S)" onmousedown="event.preventDefault(); quickSave()">
                    <i data-lucide="save"></i><span>Save</span>
                </button>
                <button class="bahar-btn" data-tip="Print this document" onmousedown="event.preventDefault(); window.print()">
                    <i data-lucide="printer"></i><span>Print</span>
                </button>

                <div class="bahar-dropdown" id="baharExportDropdown">
                    <button class="bahar-btn" data-tip="Export this document as a file" onmousedown="event.preventDefault(); baharToggleDropdown('baharExportDropdown', event)">
                        <i data-lucide="download"></i><span>Export</span><i data-lucide="chevron-down" class="bahar-caret"></i>
                    </button>
                    <div class="bahar-dropdown-menu">
                        <button onmousedown="event.preventDefault();" onclick="baharCloseDropdowns(); window.exportAsPDF && exportAsPDF();"><i data-lucide="file-text"></i> Export as PDF</button>
                        <button onmousedown="event.preventDefault();" onclick="baharCloseDropdowns(); window.exportAsWord && exportAsWord();"><i data-lucide="file"></i> Export as Word (.doc)</button>
                    </div>
                </div>

                <button class="bahar-btn" data-tip="Browse & load saved templates" onmousedown="event.preventDefault(); openTemplateList()">
                    <i data-lucide="folder-open"></i><span>Templates</span>
                </button>

                <span class="bahar-ribbon-sep"></span>

                <button class="bahar-btn" data-tip="Generate the next reference number" onmousedown="event.preventDefault(); window.openRefNumModal && openRefNumModal();">
                    <i data-lucide="hash"></i><span>Ref No.</span>
                </button>

                <button class="bahar-btn" data-tip="Insert a signature or stamp" onmousedown="event.preventDefault(); window.baharCaptureSelection && baharCaptureSelection(); window.openSignatureModal && openSignatureModal();">
                    <i data-lucide="pen-tool"></i><span>Signature</span>
                </button>

                <div class="bahar-dropdown" id="baharPageToolsDropdown">
                    <button class="bahar-btn" data-tip="Page break & A4 layout tools" onmousedown="event.preventDefault(); window.baharCaptureSelection && baharCaptureSelection(); baharToggleDropdown('baharPageToolsDropdown', event)">
                        <i data-lucide="layers"></i><span>Page Tools</span><i data-lucide="chevron-down" class="bahar-caret"></i>
                    </button>
                    <div class="bahar-dropdown-menu">
                        <button onmousedown="event.preventDefault();" onclick="baharCloseDropdowns(); window.insertPageBreak && insertPageBreak();"><i data-lucide="scissors"></i> Insert Page Break</button>
                        <button onmousedown="event.preventDefault();" onclick="baharCloseDropdowns(); window.toggleA4Guides && toggleA4Guides();"><i data-lucide="ruler"></i> Toggle Margin Guides</button>
                    </div>
                </div>

                <button class="bahar-btn" id="baharBlocksToggleBtn" data-tip="Drag to reorder document blocks" onmousedown="event.preventDefault(); window.toggleBlockDragging && toggleBlockDragging();">
                    <i data-lucide="move"></i><span>Move Blocks</span>
                </button>
            </div>

            <div id="hugerte-format-toolbar" class="hugerte-format-toolbar no-print"></div>
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

            <div id="refNumModal" class="ribbon-modal" style="display:none;" onclick="event.stopPropagation()">
                <h3><i data-lucide="hash"></i> Reference Number</h3>
                <input type="text" id="refNumPrefixInput" class="ribbon-input" placeholder="Prefix, e.g. BSS/LTR">
                <p id="refNumPreview" style="margin: -12px 0 0 0; color:#64748b; font-size:0.9rem;">Preview: -</p>
                <div class="ribbon-modal-footer">
                    <button type="button" class="ribbon-btn-secondary" onclick="closeRibbonModal('refNumModal')">Cancel</button>
                    <button type="button" class="ribbon-btn-primary" onclick="window.insertRefNumber && insertRefNumber();">Insert into Ref No. field</button>
                </div>
            </div>

            <div id="signatureModal" class="ribbon-modal" style="display:none; max-width: 480px;" onclick="event.stopPropagation()">
                <h3><i data-lucide="pen-tool"></i> Signature / Stamp</h3>
                <div class="bahar-tabs">
                    <button type="button" class="bahar-tab active" data-tab="draw" onclick="window.baharSwitchSigTab && baharSwitchSigTab('draw')">Draw</button>
                    <button type="button" class="bahar-tab" data-tab="upload" onclick="window.baharSwitchSigTab && baharSwitchSigTab('upload')">Upload Image</button>
                </div>
                <div id="sigTabDraw" class="bahar-tab-panel">
                    <canvas id="sigCanvas" width="420" height="180"></canvas>
                    <div class="bahar-sig-tools">
                        <div class="bahar-color-swatches">
                            <span class="bahar-color-swatch active" style="background:#1e293b;" data-color="#1e293b" onclick="window.baharSetSigColor && baharSetSigColor(this,'#1e293b')"></span>
                            <span class="bahar-color-swatch" style="background:#2563eb;" data-color="#2563eb" onclick="window.baharSetSigColor && baharSetSigColor(this,'#2563eb')"></span>
                            <span class="bahar-color-swatch" style="background:#ef4444;" data-color="#ef4444" onclick="window.baharSetSigColor && baharSetSigColor(this,'#ef4444')"></span>
                        </div>
                        <button type="button" class="ribbon-btn-secondary" onclick="window.clearSignatureCanvas && clearSignatureCanvas();">Clear</button>
                    </div>
                </div>
                <div id="sigTabUpload" class="bahar-tab-panel" style="display:none;">
                    <input type="file" id="sigUploadInput" accept="image/*">
                    <div id="sigUploadPreviewWrap"><img id="sigUploadPreview" alt="Preview"></div>
                </div>
                <div class="ribbon-modal-footer">
                    <button type="button" class="ribbon-btn-secondary" onclick="closeRibbonModal('signatureModal')">Cancel</button>
                    <button type="button" class="ribbon-btn-primary" onclick="window.insertSignature && insertSignature();">Insert</button>
                </div>
            </div>
        </div>
    `;

    const header = document.getElementById("universal-header");
    if (header) {
        header.insertAdjacentHTML('afterend', actionBarHTML);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
});

// --- GENERIC DROPDOWN MENU PLUMBING (Export / Page Tools) ---
window.baharCloseDropdowns = function () {
    document.querySelectorAll('.bahar-dropdown.open').forEach((dd) => dd.classList.remove('open'));
};
window.baharToggleDropdown = function (id, event) {
    if (event) event.stopPropagation();
    const target = document.getElementById(id);
    document.querySelectorAll('.bahar-dropdown.open').forEach((dd) => {
        if (dd.id !== id) dd.classList.remove('open');
    });
    if (target) target.classList.toggle('open');
};
document.addEventListener('mousedown', (e) => {
    document.querySelectorAll('.bahar-dropdown.open').forEach((dd) => {
        if (!dd.contains(e.target)) dd.classList.remove('open');
    });
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

// --- TEMPLATE LOGIC ---
// Track the currently active template so we can quick-save
window.currentActiveTemplate = new URLSearchParams(window.location.search).get('template') || '';

// Helper function to detect which page we are on
function getApiEndpoint() {
    return window.location.pathname.includes('letter')
        ? '/api/templates/letter'
        : '/api/templates/invoice';
}

// Generic modal opener used by the ribbon's Save/Templates flow AND by
// bahar-tools.js for the Reference Number / Signature modals - hides every
// other modal in the overlay first so only one is ever shown at a time.
window.baharOpenModal = function (modalId) {
    document.querySelectorAll('#modalOverlay .ribbon-modal').forEach((m) => { m.style.display = 'none'; });
    document.getElementById('modalOverlay').classList.add('active');
    const target = document.getElementById(modalId);
    if (target) target.style.display = 'flex';
};

window.closeAllRibbonModals = function(event) {
    const overlay = document.getElementById('modalOverlay');
    if(event.target === overlay) {
        overlay.classList.remove('active');
        document.querySelectorAll('#modalOverlay .ribbon-modal').forEach((m) => { m.style.display = 'none'; });
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
    window.baharOpenModal('templateNameModal');
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
            showToast("Template saved successfully!", "success"); // Custom Popup!
            window.currentActiveTemplate = templateName;
            window.history.replaceState(null, '', '?template=' + encodeURIComponent(templateName));

            if (!isQuickSave) {
                window.closeRibbonModal('templateNameModal');
                if (document.getElementById('templateListModal').dataset.wasOpen === 'true') {
                    window.openTemplateList();
                }
            }
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
    window.baharOpenModal('templateListModal');
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
