// frontend/js/bahar-tools.js
//
// Behaviour behind the newer Bahar ribbon buttons (frontend/js/ribbon.js
// renders the markup, this file does the work):
//   - Selection capture/restore  -> lets a button open a modal without
//     losing the caret position the user had in the document.
//   - Export                     -> "Export as PDF" / "Export as Word"
//   - Reference Number Generator -> fills the letterhead's Ref No. field
//   - Signature & Stamp          -> draw-or-upload, inserted as an image
//   - Page Break & A4 Tools      -> manual page break + margin guides
//   - Move Blocks                -> drag-and-drop reordering of top-level
//     blocks inside any editable region
//
// Loaded after ribbon.js and hugerte-setup.js on every editor page.

(function () {
    "use strict";

    /* ================================================================
       SELECTION CAPTURE / RESTORE
       Ribbon buttons use onmousedown + preventDefault() so clicking them
       never blurs the field the user was typing in (see ribbon.js). That
       keeps window.getSelection() accurate right up until the button's own
       handler runs. For actions that insert content immediately (Ref No.)
       that's all that's needed. For actions that open a whole modal first
       (Signature, Page Break) the user's later clicks inside that modal
       WILL move focus away from the document, so we clone the Range at
       mousedown-time and re-apply it right before inserting.
       ================================================================ */
    const EDITABLE_SELECTOR = '.editable-content, .rte-field, .editable-field, [contenteditable="true"]';

    window.baharCaptureSelection = function () {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return false;
        const range = sel.getRangeAt(0);
        const node = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement;
        const editable = node && node.closest ? node.closest(EDITABLE_SELECTOR) : null;
        if (!editable) return false;
        window.baharSavedRange = range.cloneRange();
        window.baharSavedEditable = editable;
        return true;
    };

    // Inserts HTML at the last captured selection. Prefers the HugeRTE API
    // when the target field is HugeRTE-managed so undo/dirty-state stay
    // correct; falls back to execCommand for plain contenteditable fields
    // (e.g. the stamping invoice, which has no HugeRTE at all).
    window.baharInsertAtSavedRange = function (html) {
        let editable = window.baharSavedEditable;
        const range = window.baharSavedRange;

        if (!editable || !document.body.contains(editable)) {
            // Fallback: whatever editable region is currently on screen.
            editable = document.querySelector(EDITABLE_SELECTOR);
        }
        if (!editable) return false;

        editable.focus();
        if (range) {
            try {
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } catch (e) {
                // Range belonged to nodes that no longer exist - fall back
                // to inserting at the end of the field instead of failing.
                const sel = window.getSelection();
                const fallbackRange = document.createRange();
                fallbackRange.selectNodeContents(editable);
                fallbackRange.collapse(false);
                sel.removeAllRanges();
                sel.addRange(fallbackRange);
            }
        }

        if (window.hugerte && editable.id && hugerte.get(editable.id)) {
            hugerte.get(editable.id).execCommand('mceInsertContent', false, html);
        } else {
            document.execCommand('insertHTML', false, html);
        }
        editable.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
    };

    /* ================================================================
       EXPORT (PDF / Word)
       Generic across all three editor pages - clones every .word-page,
       strips ribbon/header/no-print controls out of the clone, and hands
       the result to html2pdf.js (already on the page, see *.html <head>)
       or wraps it as a Word-openable .doc blob.
       ================================================================ */
    function baharPrintCloneWrapper() {
        const pages = document.querySelectorAll('.word-page');
        const wrapper = document.createElement('div');
        pages.forEach((page) => {
            const clone = page.cloneNode(true);
            clone.querySelectorAll('.no-print').forEach((el) => el.remove());
            clone.style.boxShadow = 'none';
            clone.style.margin = '0 0 0 0';
            wrapper.appendChild(clone);
        });
        return { wrapper, pageCount: pages.length };
    }

    function baharFileBaseName() {
        const title = (document.title || 'Bahar_Document').split('|')[0].trim();
        return title.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'Bahar_Document';
    }

    window.exportAsPDF = async function () {
        if (typeof html2pdf === 'undefined') {
            if (window.showToast) showToast('PDF engine did not load on this page.', 'error');
            else alert('PDF engine did not load on this page.');
            return;
        }
        const { wrapper, pageCount } = baharPrintCloneWrapper();
        if (!pageCount) return;

        if (window.showLoader) showLoader('Generating PDF...');
        try {
            await html2pdf().set({
                margin: 0,
                filename: baharFileBaseName() + '.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['css'], after: '.word-page' }
            }).from(wrapper).save();
            if (window.showToast) showToast('PDF exported.', 'success');
        } catch (err) {
            console.error(err);
            if (window.showToast) showToast('PDF export failed.', 'error');
            else alert('PDF export failed.');
        } finally {
            if (window.hideLoader) hideLoader();
        }
    };

    window.exportAsWord = function () {
        const { wrapper, pageCount } = baharPrintCloneWrapper();
        if (!pageCount) return;

        let bodyHtml = '';
        Array.from(wrapper.children).forEach((page, idx) => {
            const sep = idx < wrapper.children.length - 1 ? 'page-break-after:always;' : '';
            bodyHtml += `<div style="${sep}">${page.innerHTML}</div>`;
        });

        const html =
            '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
            'xmlns:w="urn:schemas-microsoft-com:office:word" ' +
            'xmlns="http://www.w3.org/TR/REC-html40">' +
            '<head><meta charset="utf-8"><title>' + baharFileBaseName() + '</title>' +
            '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View>' +
            '<w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->' +
            '<style>' +
            'body{font-family:Calibri,Arial,sans-serif;} ' +
            'table{border-collapse:collapse;} td,th{border:1px solid #666;padding:4px;}' +
            '</style></head><body>' + bodyHtml + '</body></html>';

        const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = baharFileBaseName() + '.doc';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        if (window.showToast) showToast('Word document exported.', 'success');
    };

    /* ================================================================
       REFERENCE NUMBER GENERATOR
       Targets the dedicated "Ref No." field that's already baked into
       every page's letterhead (#bahar-ref-no-field, see pad-header.js) -
       rather than dumping text at an arbitrary cursor position, this fills
       the slot the document is actually designed to show it in. The
       prefix and running counter are remembered per-prefix in
       localStorage so "Insert" bumps the number each time.
       ================================================================ */
    const REF_PREFIX_KEY = 'baharRefPrefix';
    const refCounterKey = (prefix) => 'baharRefCounter::' + prefix;

    function baharBuildRefString(prefix) {
        const year = new Date().getFullYear();
        const counterKey = refCounterKey(prefix);
        const next = parseInt(localStorage.getItem(counterKey) || '0', 10) + 1;
        const padded = String(next).padStart(4, '0');
        return { text: `${prefix}/${year}/${padded}`, next, counterKey };
    }

    function baharUpdateRefPreview() {
        const input = document.getElementById('refNumPrefixInput');
        const preview = document.getElementById('refNumPreview');
        if (!input || !preview) return;
        const prefix = (input.value || 'BSS/LTR').trim();
        preview.textContent = 'Preview: ' + baharBuildRefString(prefix).text;
    }

    window.openRefNumModal = function () {
        window.baharOpenModal('refNumModal');
        const input = document.getElementById('refNumPrefixInput');
        if (input) {
            input.value = localStorage.getItem(REF_PREFIX_KEY) || 'BSS/LTR';
            input.oninput = baharUpdateRefPreview;
            input.focus();
        }
        baharUpdateRefPreview();
    };

    window.insertRefNumber = function () {
        const input = document.getElementById('refNumPrefixInput');
        const prefix = (input && input.value.trim()) || 'BSS/LTR';
        localStorage.setItem(REF_PREFIX_KEY, prefix);

        const { text, next, counterKey } = baharBuildRefString(prefix);
        const field = document.getElementById('bahar-ref-no-field');

        if (field) {
            field.innerText = 'Ref No: ' + text;
        } else if (window.showToast) {
            showToast('No Ref No. field found on this page.', 'error');
            return;
        }

        localStorage.setItem(counterKey, String(next));
        window.closeRibbonModal('refNumModal');
        if (window.showToast) showToast('Reference number inserted.', 'success');
    };

    /* ================================================================
       SIGNATURE & STAMP
       Two ways in: draw on a canvas, or upload an image (e.g. a scanned
       stamp). Either way the result becomes a dataURL <img> inserted at
       the position captured when the Signature button was pressed. Once
       inserted, the image is a normal part of the document - resizable
       via HugeRTE's built-in image handles on RTE fields, and repositions
       naturally via the browser's native drag-within-contenteditable
       behaviour everywhere else.
       ================================================================ */
    let sigCtx = null;
    let sigDrawing = false;
    let sigColor = '#1e293b';
    let sigHasStroke = false;
    let sigUploadDataUrl = null;

    function baharGetSigCanvas() {
        return document.getElementById('sigCanvas');
    }

    function baharSigPointerPos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        const point = evt.touches ? evt.touches[0] : evt;
        return {
            x: (point.clientX - rect.left) * (canvas.width / rect.width),
            y: (point.clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function baharInitSignaturePad() {
        const canvas = baharGetSigCanvas();
        if (!canvas || canvas.dataset.baharInit === 'true') return;
        canvas.dataset.baharInit = 'true';
        sigCtx = canvas.getContext('2d');
        sigCtx.lineWidth = 2.5;
        sigCtx.lineCap = 'round';
        sigCtx.lineJoin = 'round';

        const start = (e) => {
            e.preventDefault();
            sigDrawing = true;
            sigHasStroke = true;
            const p = baharSigPointerPos(canvas, e);
            sigCtx.strokeStyle = sigColor;
            sigCtx.beginPath();
            sigCtx.moveTo(p.x, p.y);
        };
        const move = (e) => {
            if (!sigDrawing) return;
            e.preventDefault();
            const p = baharSigPointerPos(canvas, e);
            sigCtx.lineTo(p.x, p.y);
            sigCtx.stroke();
        };
        const end = () => { sigDrawing = false; };

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);
        canvas.addEventListener('touchstart', start, { passive: false });
        canvas.addEventListener('touchmove', move, { passive: false });
        canvas.addEventListener('touchend', end);
    }

    window.clearSignatureCanvas = function () {
        const canvas = baharGetSigCanvas();
        if (!canvas || !sigCtx) return;
        sigCtx.clearRect(0, 0, canvas.width, canvas.height);
        sigHasStroke = false;
    };

    window.baharSetSigColor = function (el, color) {
        sigColor = color;
        document.querySelectorAll('.bahar-color-swatch').forEach((s) => s.classList.remove('active'));
        if (el) el.classList.add('active');
    };

    window.baharSwitchSigTab = function (tab) {
        document.querySelectorAll('.bahar-tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));
        const drawPanel = document.getElementById('sigTabDraw');
        const uploadPanel = document.getElementById('sigTabUpload');
        if (drawPanel) drawPanel.style.display = tab === 'draw' ? 'block' : 'none';
        if (uploadPanel) uploadPanel.style.display = tab === 'upload' ? 'block' : 'none';
    };

    window.openSignatureModal = function () {
        window.baharOpenModal('signatureModal');
        window.baharSwitchSigTab('draw');
        baharInitSignaturePad();
        window.clearSignatureCanvas();
        sigUploadDataUrl = null;

        const fileInput = document.getElementById('sigUploadInput');
        const preview = document.getElementById('sigUploadPreview');
        if (fileInput) {
            fileInput.value = '';
            fileInput.onchange = () => {
                const file = fileInput.files && fileInput.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    sigUploadDataUrl = e.target.result;
                    if (preview) {
                        preview.src = sigUploadDataUrl;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            };
        }
        if (preview) preview.style.display = 'none';
    };

    window.insertSignature = function () {
        const activeTab = document.querySelector('.bahar-tab.active');
        const mode = activeTab ? activeTab.dataset.tab : 'draw';
        let dataUrl = null;

        if (mode === 'draw') {
            const canvas = baharGetSigCanvas();
            if (!canvas || !sigHasStroke) {
                if (window.showToast) showToast('Draw a signature first, or switch to Upload.', 'error');
                return;
            }
            dataUrl = canvas.toDataURL('image/png');
        } else {
            if (!sigUploadDataUrl) {
                if (window.showToast) showToast('Choose an image to upload first.', 'error');
                return;
            }
            dataUrl = sigUploadDataUrl;
        }

        // Wrapper gives the inserted media a drag handle + resize corner
        // that works even outside HugeRTE-managed fields (e.g. the
        // stamping invoice, which is plain contenteditable).
        const html =
            `<span class="bahar-media-block" draggable="true" ` +
            `style="display:inline-block; resize:both; overflow:hidden; max-width:100%; ` +
            `min-width:60px; min-height:30px; vertical-align:middle;">` +
            `<img src="${dataUrl}" alt="Signature" style="width:100%; height:100%; display:block; object-fit:contain;">` +
            `</span>&nbsp;`;

        const inserted = window.baharInsertAtSavedRange(html);
        if (inserted) {
            window.closeRibbonModal('signatureModal');
            if (window.showToast) showToast('Signature inserted.', 'success');
        } else if (window.showToast) {
            showToast('Click into the document first, then try again.', 'error');
        }
    };

    /* ================================================================
       PAGE BREAK & A4 TOOLS
       - insertPageBreak(): on the multi-page letter workspace, creates a
         real new .word-page (reusing auto-builder.js's window.
         baharAddNewPage) and moves the caret there. On a single
         continuous-flow page (fuel-invoice.html's #printableInvoice),
         there's no second page to jump to, so it inserts a visual/print
         page-break marker at the caret instead (ribbon.css: .bahar-page-
         break, forces page-break-after on paper, shown as a labelled
         divider on screen).
       - toggleA4Guides(): toggles dashed margin guides on every .word-page
         (ribbon.css: body.bahar-show-guides).
       ================================================================ */
    window.insertPageBreak = function () {
        const editable = window.baharSavedEditable;
        const currentPage = editable ? editable.closest('.word-page') : document.querySelector('.word-page:last-of-type');

        const isMultiPageWorkspace = currentPage && currentPage.querySelector('.editable-content');
        if (isMultiPageWorkspace && typeof window.baharAddNewPage === 'function') {
            window.baharAddNewPage(currentPage);
            if (window.showToast) showToast('New page added.', 'success');
            return;
        }

        const inserted = window.baharInsertAtSavedRange('<div class="bahar-page-break" contenteditable="false"></div>');
        if (inserted) {
            if (window.showToast) showToast('Page break inserted.', 'success');
        } else if (window.showToast) {
            showToast('Click into the document first, then try again.', 'error');
        }
    };

    window.toggleA4Guides = function () {
        const on = document.body.classList.toggle('bahar-show-guides');
        if (window.showToast) showToast(on ? 'Margin guides on.' : 'Margin guides off.', 'success');
    };

    /* ================================================================
       MOVABLE DOCUMENT BLOCKS
       A toggleable mode (default off, so normal typing/selecting is never
       interfered with). While on, hovering any top-level child of an
       editable region - or of a .word-page itself, so whole letter/
       invoice sections can be reordered too - shows a small grip handle;
       dragging it re-parents that block before/after its new neighbour.
       ================================================================ */
    let blocksModeOn = false;
    let dragHandleEl = null;
    let dropIndicatorEl = null;
    let hoveredBlock = null;
    let draggedBlock = null;

    function baharBlockRoot(el) {
        return el.closest(EDITABLE_SELECTOR + ', .word-page');
    }

    // Only "real" content blocks are draggable - never the page footer,
    // the letterhead, or the block currently being dragged.
    function baharIsDraggableBlock(el) {
        if (!el || el.nodeType !== 1) return false;
        if (el.classList.contains('page-footer')) return false;
        if (el.id === 'bahar-document-header') return false;
        if (el.classList.contains('bahar-drag-handle')) return false;
        return true;
    }

    function baharEnsureOverlayEls() {
        if (!dragHandleEl) {
            dragHandleEl = document.createElement('div');
            dragHandleEl.className = 'bahar-drag-handle no-print';
            dragHandleEl.setAttribute('draggable', 'true');
            dragHandleEl.setAttribute('title', 'Drag to reorder this block');
            dragHandleEl.innerHTML = '&#10021;';
            dragHandleEl.style.cssText =
                'position:fixed; z-index:1050; width:22px; height:22px; border-radius:6px; ' +
                'background:#1e293b; color:#fff; display:none; align-items:center; justify-content:center; ' +
                'font-size:12px; cursor:grab; box-shadow:0 2px 6px rgba(0,0,0,0.25); user-select:none;';
            document.body.appendChild(dragHandleEl);

            dragHandleEl.addEventListener('dragstart', (e) => {
                draggedBlock = hoveredBlock;
                e.dataTransfer.effectAllowed = 'move';
                try { e.dataTransfer.setData('text/plain', 'bahar-block'); } catch (err) { /* noop */ }
            });
            dragHandleEl.addEventListener('dragend', () => {
                draggedBlock = null;
                if (dropIndicatorEl) dropIndicatorEl.style.display = 'none';
            });
        }
        if (!dropIndicatorEl) {
            dropIndicatorEl = document.createElement('div');
            dropIndicatorEl.className = 'bahar-drop-indicator no-print';
            dropIndicatorEl.style.cssText =
                'position:fixed; z-index:1050; height:3px; background:#2563eb; ' +
                'border-radius:2px; display:none; pointer-events:none;';
            document.body.appendChild(dropIndicatorEl);
        }
    }

    function baharPositionHandle(block) {
        const rect = block.getBoundingClientRect();
        dragHandleEl.style.display = 'flex';
        dragHandleEl.style.top = Math.max(rect.top, 0) + 'px';
        dragHandleEl.style.left = Math.max(rect.left - 30, 4) + 'px';
    }

    function baharHandleMouseOver(e) {
        if (!blocksModeOn) return;
        const root = baharBlockRoot(e.target);
        if (!root) { return; }
        let block = e.target;
        while (block && block.parentElement !== root) block = block.parentElement;
        if (!block || !baharIsDraggableBlock(block)) return;
        hoveredBlock = block;
        baharEnsureOverlayEls();
        baharPositionHandle(block);
    }

    function baharHandleMouseOut(e) {
        if (!blocksModeOn) return;
        const toEl = e.relatedTarget;
        if (dragHandleEl && (toEl === dragHandleEl || (toEl && dragHandleEl.contains(toEl)))) return;
        if (hoveredBlock && toEl && hoveredBlock.contains(toEl)) return;
        if (dragHandleEl) dragHandleEl.style.display = 'none';
    }

    function baharHandleDragOver(e) {
        if (!blocksModeOn || !draggedBlock) return;
        const root = baharBlockRoot(e.target);
        if (!root || root !== draggedBlock.parentElement) return;
        let target = e.target;
        while (target && target.parentElement !== root) target = target.parentElement;
        if (!target || !baharIsDraggableBlock(target) || target === draggedBlock) return;

        e.preventDefault();
        const rect = target.getBoundingClientRect();
        const before = e.clientY < rect.top + rect.height / 2;
        dropIndicatorEl.style.display = 'block';
        dropIndicatorEl.style.left = rect.left + 'px';
        dropIndicatorEl.style.width = rect.width + 'px';
        dropIndicatorEl.style.top = (before ? rect.top : rect.bottom) - 1 + 'px';
        dropIndicatorEl._targetEl = target;
        dropIndicatorEl._before = before;
    }

    function baharHandleDrop(e) {
        if (!blocksModeOn || !draggedBlock) return;
        const target = dropIndicatorEl && dropIndicatorEl._targetEl;
        if (!target) return;
        e.preventDefault();

        const root = target.parentElement;
        if (dropIndicatorEl._before) {
            root.insertBefore(draggedBlock, target);
        } else {
            root.insertBefore(draggedBlock, target.nextSibling);
        }

        dropIndicatorEl.style.display = 'none';
        if (dragHandleEl) dragHandleEl.style.display = 'none';

        root.dispatchEvent(new Event('input', { bubbles: true }));
        if (window.hugerte && root.id) {
            const editor = hugerte.get(root.id);
            if (editor) editor.fire('change');
        }
        if (window.showToast) showToast('Block moved.', 'success');
        draggedBlock = null;
    }

    window.toggleBlockDragging = function () {
        blocksModeOn = !blocksModeOn;
        document.body.classList.toggle('bahar-blocks-mode', blocksModeOn);
        const btn = document.getElementById('baharBlocksToggleBtn');
        if (btn) btn.classList.toggle('active', blocksModeOn);
        if (!blocksModeOn && dragHandleEl) dragHandleEl.style.display = 'none';
        if (window.showToast) showToast(blocksModeOn ? 'Move Blocks on - hover a block for its handle.' : 'Move Blocks off.', 'success');
    };

    document.addEventListener('mouseover', baharHandleMouseOver);
    document.addEventListener('mouseout', baharHandleMouseOut);
    document.addEventListener('dragover', baharHandleDragOver);
    document.addEventListener('drop', baharHandleDrop);
    document.addEventListener('scroll', () => { if (hoveredBlock && dragHandleEl && dragHandleEl.style.display !== 'none') baharPositionHandle(hoveredBlock); }, true);
})();
