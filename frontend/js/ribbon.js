// document.addEventListener("DOMContentLoaded", () => {
//     const ribbonHTML = `
//         <div class="document-ribbon no-print">
            
//             <!-- Save & Print -->
//             <div class="ribbon-group">
//                 <button onmousedown="event.preventDefault(); saveDocument()" class="ribbon-btn" style="color: #10b981; font-weight: bold;">
//                     <i data-lucide="save" style="width: 16px; height: 16px;"></i> Save
//                 </button>
//                 <button onmousedown="event.preventDefault(); window.print()" class="ribbon-btn">
//                     <i data-lucide="printer" style="width: 16px; height: 16px;"></i> Print
//                 </button>
//             </div>
            
//             <div class="ribbon-divider"></div>

//             <!-- Undo / Redo -->
//             <div class="ribbon-group">
//                 <button onmousedown="event.preventDefault(); formatText('undo')" class="ribbon-btn" title="Undo">
//                     <i data-lucide="undo" style="width: 16px; height: 16px;"></i>
//                 </button>
//                 <button onmousedown="event.preventDefault(); formatText('redo')" class="ribbon-btn" title="Redo">
//                     <i data-lucide="redo" style="width: 16px; height: 16px;"></i>
//                 </button>
//             </div>

//             <div class="ribbon-divider"></div>

//             <!-- Font & Size -->
//             <div class="ribbon-group">
//                 <select onmousedown="event.preventDefault()" onchange="formatText('fontName', this.value)" class="ribbon-select" title="Font">
//                     <option value="Poppins, sans-serif">Poppins</option>
//                     <option value="Arial, sans-serif">Arial</option>
//                     <option value="'Times New Roman', serif">Times New Roman</option>
//                 </select>
                
//                 <select onmousedown="event.preventDefault()" onchange="formatText('fontSize', this.value)" class="ribbon-select" title="Text Size">
//                     <option value="1">10 pt</option>
//                     <option value="2">12 pt</option>
//                     <option value="3" selected>14 pt (Normal)</option>
//                     <option value="4">18 pt</option>
//                     <option value="5">24 pt (Heading)</option>
//                 </select>
//             </div>

//             <div class="ribbon-divider"></div>

//             <!-- Text Styles & FIXED COLORS -->
//             <div class="ribbon-group">
//                 <button onmousedown="event.preventDefault(); formatText('bold')" class="ribbon-btn" title="Bold" style="font-weight: 800;">B</button>
//                 <button onmousedown="event.preventDefault(); formatText('italic')" class="ribbon-btn" title="Italic" style="font-style: italic;">I</button>
//                 <button onmousedown="event.preventDefault(); formatText('underline')" class="ribbon-btn" title="Underline" style="text-decoration: underline;">U</button>
                
//                 <!-- NEW: Fixed Colors Dropdown instead of Color Chart -->
//                 <select onmousedown="event.preventDefault()" onchange="formatText('foreColor', this.value); this.selectedIndex=0;" class="ribbon-select" title="Text Color" style="margin-left: 5px; font-weight: bold; width: 90px;">
//                     <option value="" disabled selected>Color ▾</option>
//                     <option value="#000000" style="color: black; font-weight: bold;">Black</option>
//                     <option value="#dc2626" style="color: #dc2626; font-weight: bold;">Red</option>
//                     <option value="#2563eb" style="color: #2563eb; font-weight: bold;">Blue</option>
//                     <option value="#16a34a" style="color: #16a34a; font-weight: bold;">Green</option>
//                     <option value="#ca8a04" style="color: #ca8a04; font-weight: bold;">Yellow</option>
//                 </select>
                
//                 <button onmousedown="event.preventDefault(); formatText('removeFormat')" class="ribbon-btn" title="Clear All Formatting" style="margin-left: 5px;">
//                     <i data-lucide="eraser" style="width: 16px; height: 16px;"></i>
//                 </button>
//             </div>

//             <div class="ribbon-divider"></div>

//             <!-- Alignment (FIXED FOCUS BUG) -->
//             <div class="ribbon-group">
//                 <button onmousedown="event.preventDefault(); formatText('justifyLeft')" class="ribbon-btn" title="Align Left"><i data-lucide="align-left" style="width: 16px; height: 16px;"></i></button>
//                 <button onmousedown="event.preventDefault(); formatText('justifyCenter')" class="ribbon-btn" title="Align Center"><i data-lucide="align-center" style="width: 16px; height: 16px;"></i></button>
//                 <button onmousedown="event.preventDefault(); formatText('justifyRight')" class="ribbon-btn" title="Align Right"><i data-lucide="align-right" style="width: 16px; height: 16px;"></i></button>
//                 <button onmousedown="event.preventDefault(); formatText('justifyFull')" class="ribbon-btn" title="Justify Evenly"><i data-lucide="align-justify" style="width: 16px; height: 16px;"></i></button>
//             </div>

//             <div class="ribbon-divider"></div>

//             <!-- Lists (FIXED FOCUS BUG) -->
//             <div class="ribbon-group">
//                 <button onmousedown="event.preventDefault(); formatText('insertOrderedList')" class="ribbon-btn" title="Numbering (1. 2. 3.)"><i data-lucide="list-ordered" style="width: 16px; height: 16px;"></i></button>
//                 <button onmousedown="event.preventDefault(); formatText('insertUnorderedList')" class="ribbon-btn" title="Bullet Points"><i data-lucide="list" style="width: 16px; height: 16px;"></i></button>
//             </div>
//         </div>
//     `;

//     const header = document.getElementById("universal-header");
//     if (header) {
//         header.insertAdjacentHTML('afterend', ribbonHTML);
//         if (typeof lucide !== 'undefined') {
//             lucide.createIcons();
//         }
//     }
// });

// window.formatText = function(command, value = null) {
//     document.execCommand(command, false, value);
// };

// window.saveDocument = function() {
//     alert("Document logic ready for DB save!");
// };

// frontend/js/ribbon.js
// frontend/js/ribbon.js

document.addEventListener("DOMContentLoaded", () => {
    const ribbonHTML = `
        <div class="document-ribbon no-print">
            
            <div class="ribbon-group">
                <button onmousedown="event.preventDefault(); saveDocument()" class="ribbon-btn" style="color: #10b981; font-weight: bold;"><i data-lucide="save" style="width: 16px; height: 16px;"></i> Save</button>
                <button onmousedown="event.preventDefault(); window.print()" class="ribbon-btn"><i data-lucide="printer" style="width: 16px; height: 16px;"></i> Print</button>
            </div>
            
            <div class="ribbon-divider"></div>

            <div class="ribbon-group">
                <button onmousedown="event.preventDefault(); formatText('undo')" class="ribbon-btn" title="Undo"><i data-lucide="undo" style="width: 16px; height: 16px;"></i></button>
                <button onmousedown="event.preventDefault(); formatText('redo')" class="ribbon-btn" title="Redo"><i data-lucide="redo" style="width: 16px; height: 16px;"></i></button>
            </div>

            <div class="ribbon-divider"></div>

            <!-- FIX: Removed preventDefault from select so they actually drop down -->
            <div class="ribbon-group">
                <select onchange="formatText('fontName', this.value)" class="ribbon-select" title="Font">
                    <option value="Poppins">Poppins</option>
                    <option value="Arial">Arial</option>
                    <option value="'Times New Roman'">Times New Roman</option>
                    <option value="'Courier New'">Courier</option>
                </select>
                
                <!-- NEW: Grouped Size Dropdown with A+ and A- buttons -->
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
                
                <!-- FIXED COLOR SWATCHES -->
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
    `;

    const header = document.getElementById("universal-header");
    if (header) {
        header.insertAdjacentHTML('afterend', ribbonHTML);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
});

// The core formatting function
window.formatText = function(command, value = null) {
    document.execCommand(command, false, value);
};

// NEW: Logic for the A+ and A- buttons
window.currentFontSize = 3; // Starts at 14pt (Normal)
window.stepFontSize = function(direction) {
    // Step the size up or down
    currentFontSize += direction;
    
    // Lock it between the browser limits (1 and 7)
    if (currentFontSize < 1) currentFontSize = 1;
    if (currentFontSize > 7) currentFontSize = 7;
    
    // Update the dropdown menu visually to match the new size
    const sizeSelect = document.getElementById('fontSizeSelect');
    if (sizeSelect) sizeSelect.value = currentFontSize;
    
    // Apply the size to the text
    formatText('fontSize', currentFontSize);
};

window.saveDocument = function() {
    alert("Document logic ready for DB save!");
};