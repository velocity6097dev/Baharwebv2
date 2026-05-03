// frontend/js/auto-builder.js

document.addEventListener("DOMContentLoaded", () => {
    
    // Helper function to recalculate page numbers
    function updatePageNumbers() {
        const pages = document.querySelectorAll('.word-page');
        pages.forEach((page, index) => {
            const footer = page.querySelector('.page-footer');
            if (footer) {
                footer.innerText = `Page ${index + 1}`;
            }
        });
    }

    // Your working function for adding pages
    function checkOverflow(event) {
        const contentBox = event.target.closest('.editable-content');
        if (!contentBox) return;

        const currentPage = contentBox.closest('.word-page');
        
        if (contentBox.scrollHeight > contentBox.clientHeight) {
            let nextPage = currentPage.nextElementSibling;
            
            if (!nextPage || !nextPage.classList.contains('word-page')) {
                const newPage = document.createElement('div');
                newPage.className = 'word-page';
                
                const pageNum = document.querySelectorAll('.word-page').length + 1;
                
                newPage.innerHTML = `
                    <div class="editable-content" contenteditable="true">
                        <p><br></p>
                    </div>
                    <div class="page-footer">Page ${pageNum}</div>
                `;

                currentPage.parentNode.insertBefore(newPage, currentPage.nextSibling);
                updatePageNumbers();
                
                const newParagraph = newPage.querySelector('.editable-content p');
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(newParagraph, 0);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                
                newPage.querySelector('.editable-content').focus();
            }
        }
    }

    // The new function for deleting blank pages
    function removeBlankPages() {
        const allPages = document.querySelectorAll('.word-page');
        
        // Only trigger if there is more than 1 page (Never delete Page 1)
        if (allPages.length > 1) {
            // Loop backwards so removing a page doesn't mess up the order of the array
            for (let i = allPages.length - 1; i > 0; i--) {
                const page = allPages[i];
                const editable = page.querySelector('.editable-content');

                // A page is "blank" if it has no text and no images/tables
                const textContent = editable.innerText.trim();
                const hasMedia = editable.querySelectorAll('img, table, iframe').length > 0;

                if (textContent === "" && !hasMedia) {
                    
                    // If the user's cursor is currently inside the page we are about to delete
                    if (document.activeElement === editable || editable.contains(document.activeElement)) {
                        const prevPage = allPages[i - 1];
                        const prevEditable = prevPage.querySelector('.editable-content');
                        prevEditable.focus();

                        // Move their cursor to the very end of the previous page
                        const range = document.createRange();
                        const sel = window.getSelection();
                        range.selectNodeContents(prevEditable);
                        range.collapse(false);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                    
                    // Delete the page and fix the numbers
                    page.remove();
                    updatePageNumbers();
                }
            }
        }
    }

    const workspace = document.querySelector('.word-workspace');
    if (workspace) {
        // Run overflow check when typing normally
        workspace.addEventListener('input', checkOverflow);
        
        // Run deletion check when hitting Backspace or Delete
        workspace.addEventListener('keyup', (e) => {
            checkOverflow(e); // Still check overflow just in case they hold down Enter
            if (e.key === 'Backspace' || e.key === 'Delete') {
                removeBlankPages();
            }
        });
    }
});