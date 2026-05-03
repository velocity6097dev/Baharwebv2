// function injectBaharHeader() {
//     const headerContainer = document.getElementById('bahar-document-header');
    
//     if (headerContainer) {
//         // Automatically get today's date in DD-MM-YYYY format
//         const today = new Date();
//         const dateString = today.toLocaleDateString('en-GB').replace(/\//g, '-');

//         headerContainer.innerHTML = `
//             <div style="display: flex; align-items: center; justify-content: center; position: relative; padding-bottom: 1rem; font-family: 'Poppins', sans-serif;">
//                 <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Official_BPCL_LOGO.jpg" alt="BPCL" style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 80px; height: auto;">
//                 <div style="text-align: center; width: 100%; padding: 0 90px;">
//                     <h1 style="margin:0; color: #004b87; font-size: 1.6rem; font-weight: 800; letter-spacing: 1px;">M/S. BAHAR SERVICE STATION</h1>
//                     <p style="margin:4px 0 2px 0; font-weight: 700; font-size: 1rem; color: black;">DEALER: BHARAT PETROLEUM CORP LTD.</p>
                    
//                     <p style="margin:2px 0; font-size: 0.85rem; color: #334155;">VILL-DEVOKE, P.O.MAMUDPUR, P.S.SHIBDASPUR, DIST-N24 PARGANAS,<br>PIN 743166, West Bengal</p>
                    
//                     <p style="margin:2px 0; font-size: 0.85rem; color: #334155;">CONTACT - 7018579966, 9088086294</p>
//                     <p style="margin:2px 0; font-size: 0.85rem; color: #334155;">EMAIL - BAHARSERVICESTATION@GMAIL.COM</p>
//                 </div>
//             </div>
            
//             <!-- BULLETPROOF BLUE LINE FIX -->
//             <div style="height: 4px; background-color: #004b87; width: 100%; margin-bottom: 1rem; -webkit-print-color-adjust: exact; print-color-adjust: exact;"></div>
            
//             <!-- NEW: Editable Ref No and Date -->
//             <div style="display: flex; justify-content: space-between; font-family: 'Poppins', sans-serif; font-size: 0.95rem; font-weight: 600; margin-bottom: 1rem; color: #1e293b;">
                
//                 <!-- Reference Number (Left) -->
//                 <div contenteditable="true" 
//                      style="outline: none; min-width: 200px; padding: 4px; border: 1px dashed transparent; transition: 0.2s; border-radius: 4px;" 
//                      onfocus="this.style.borderColor='#cbd5e1'; this.style.backgroundColor='#f8fafc';" 
//                      onblur="this.style.borderColor='transparent'; this.style.backgroundColor='transparent';">
//                     Ref No: 
//                 </div>
                
//                 <!-- Date (Right - Auto Fills with Today's Date) -->
//                 <div contenteditable="true" 
//                      style="outline: none; min-width: 150px; text-align: right; padding: 4px; border: 1px dashed transparent; transition: 0.2s; border-radius: 4px;" 
//                      onfocus="this.style.borderColor='#cbd5e1'; this.style.backgroundColor='#f8fafc';" 
//                      onblur="this.style.borderColor='transparent'; this.style.backgroundColor='transparent';">
//                     Date: ${dateString}
//                 </div>
                
//             </div>
//         `;
//     }
// }

// document.addEventListener("DOMContentLoaded", injectBaharHeader);

// frontend/js/pad-header.js

function injectBaharHeader() {
    const headerContainer = document.getElementById('bahar-document-header');
    
    if (headerContainer) {
        // Automatically get today's date in DD-MM-YYYY format
        const today = new Date();
        const dateString = today.toLocaleDateString('en-GB').replace(/\//g, '-');

        headerContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; position: relative; padding-bottom: 1rem; font-family: 'Poppins', sans-serif;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Official_BPCL_LOGO.jpg" alt="BPCL" style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 80px; height: auto;">
                <div style="text-align: center; width: 100%; padding: 0 90px;">
                    <h1 style="margin:0; color: #004b87; font-size: 1.6rem; font-weight: 800; letter-spacing: 1px;">M/S. BAHAR SERVICE STATION</h1>
                    <p style="margin:4px 0 2px 0; font-weight: 700; font-size: 1rem; color: black;">DEALER: BHARAT PETROLEUM CORP LTD.</p>
                    
                    <p style="margin:2px 0; font-size: 0.85rem; color: #334155;">VILL-DEVOKE, P.O.MAMUDPUR, P.S.SHIBDASPUR, DIST-N24 PARGANAS,<br>PIN 743166, West Bengal</p>
                    
                    <p style="margin:2px 0; font-size: 0.85rem; color: #334155;">CONTACT - 7018579966, 9088086294</p>
                    <p style="margin:2px 0; font-size: 0.85rem; color: #334155;">EMAIL - BAHARSERVICESTATION@GMAIL.COM</p>
                </div>
            </div>
            
            <!-- BULLETPROOF BLUE LINE FIX -->
            <div style="height: 4px; background-color: #004b87; width: 100%; margin-bottom: 1rem; -webkit-print-color-adjust: exact; print-color-adjust: exact;"></div>
            
            <!-- UNIVERSAL EDITABLE REF NO AND DATE -->
            <div style="display: flex; justify-content: space-between; font-family: 'Poppins', sans-serif; font-size: 0.95rem; font-weight: 600; margin-bottom: 1rem; color: #1e293b;">
                <div contenteditable="true" 
                     style="outline: none; min-width: 200px; padding: 4px; border: 1px dashed transparent; transition: 0.2s; border-radius: 4px;" 
                     onfocus="this.style.borderColor='#cbd5e1'; this.style.backgroundColor='#f8fafc';" 
                     onblur="this.style.borderColor='transparent'; this.style.backgroundColor='transparent';">
                    Ref No: 
                </div>
                <div contenteditable="true" 
                     style="outline: none; min-width: 150px; text-align: right; padding: 4px; border: 1px dashed transparent; transition: 0.2s; border-radius: 4px;" 
                     onfocus="this.style.borderColor='#cbd5e1'; this.style.backgroundColor='#f8fafc';" 
                     onblur="this.style.borderColor='transparent'; this.style.backgroundColor='transparent';">
                    Date: ${dateString}
                </div>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", injectBaharHeader);