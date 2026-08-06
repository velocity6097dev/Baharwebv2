// frontend/js/hugerte-setup.js
//
// Boots the HugeRTE rich-text engine (https://hugerte.org) and attaches it
// to the document's free-text regions, replacing the old
// document.execCommand()-based formatting toolbar that used to live in
// ribbon.js.
//
// This file also registers a small custom HugeRTE plugin ("baharribbon",
// see registerBaharRibbonPlugin below) that turns Save / Print / Templates
// / Export / Ref No. / Signature / Page Tools / Move Blocks into NATIVE
// HugeRTE toolbar buttons - not a separate custom-styled row. They render
// inside HugeRTE's own "#hugerte-format-toolbar" container (created by
// ribbon.js, this file just looks it up by id) using HugeRTE's own button/
// tooltip/menu chrome, and once that's confirmed working ribbon.js's plain
// fallback action row hides itself (hugerte.css: body.bahar-hugerte-active
// .bahar-ribbon-actions). The fallback row only stays visible on
// stamping-invoice.html, which has no rich-text fields and so never loads
// HugeRTE - it's the only way those actions are reachable there.
//
// Two config options do the heavy lifting for the "ribbon should always be
// visible, and dropdowns shouldn't get clipped/scrolled" fix:
//   - toolbar_persist: true   -> stops HugeRTE from emptying the toolbar
//     container on blur (its default inline-mode behaviour). Without this,
//     the container is only ever populated while a field has focus, which
//     is why the ribbon used to look "empty" until you clicked into text.
//   - ui_mode: "split"        -> floating panels (font list, color picker,
//     table grid, etc.) are appended as viewport-fixed siblings instead of
//     being laid out inside our sticky/clipping toolbar container. Without
//     this, those panels get boxed into whatever overflow context the
//     container has, which is what produced the "scrollable space" bug
//     instead of a normal floating dropdown.
//
// SCOPE (deliberate, see chat for the reasoning):
//   - letter.html            -> every `.editable-content` page is a target.
//   - fuel-invoice.html      -> only the prose fields marked `.rte-field`
//                                (To Address / Subject / Body). The invoice
//                                table cells (qty/rate/amount) stay plain
//                                contenteditable so calculateAll() keeps
//                                working exactly as before.
//   - stamping-invoice.html  -> has no prose fields at all, so this file
//                                isn't loaded there - only ribbon.js's
//                                plain fallback action row (Save/Print/
//                                Export/Templates...) appears, with no
//                                HugeRTE formatting row underneath it.
//
// Pagination (auto-builder.js) is intentionally NOT touched in this pass,
// other than the one hook it needs so newly-created pages also get a
// HugeRTE instance - see the "HugeRTE hook" comments in auto-builder.js.
//
// Pre-existing bug I did not fix (out of scope for this pass): saveTemplate()
// /loadTemplate() in ribbon.js only reads/writes the first .editable-content
// or #printableInvoice, so a letter that's grown past page 1 won't save
// page 2+. Worth fixing when we do the pagination pass.
//
// PLUGINS: every open-source HugeRTE plugin is enabled below (all 30 listed
// on hugerte.org). The CDN build (hugerte@1, which floats to the latest
// 1.x - currently 1.0.11, carrying a DOMPurify bump and a few real stored-
// XSS fixes) lazy-loads each plugin's JS from the same CDN path on init, so
// turning more of them on doesn't bloat the initial page load - it just
// adds a handful of small parallel requests the first time a field inits.
//
// content_css IS EXPLICITLY DISABLED (see buildConfig). HugeRTE's default
// content stylesheet isn't scoped to the editor root in inline mode - it
// gets injected straight into the page's real <head> as plain `table`,
// `img`, `pre`, `figure` etc. selectors, so left on it would visibly
// restyle every table/image/code block on the REST of the page too, not
// just inside the editor. That's on top of - not fixed by - the existing
// content_style scoping below. So content_css is off, and content_style
// now also covers the elements the new plugins can insert (tables, images/
// captions, code blocks, accordions) that would otherwise have relied on
// that disabled default stylesheet.

(function () {
    "use strict";

    const TOOLBAR_ID = "hugerte-format-toolbar";
    const TARGET_SELECTOR = ".editable-content, .rte-field";

    // All 30 open-source HugeRTE plugins. Nothing held back on purpose -
    // if a specific field turns out not to need one of these, it's safe to
    // pull it out of this string later.
    //
    // Two callouts on plugins that don't do much here without extra setup:
    //   - autoresize: a no-op for inline targets. They already size with
    //     the page's own layout (that's the whole point of inline mode),
    //     so there's nothing for it to resize. Kept in case this ever
    //     moves to iframe mode.
    //   - importcss: normally scans the stylesheet(s) named in content_css
    //     for classes to offer in the "blocks" format dropdown. Since
    //     content_css is off (see above), it currently has nothing to
    //     scan and is effectively inert. If you want it doing real work,
    //     point importcss_file_filter at a specific stylesheet of classes
    //     that are actually meant to be picked from inside these fields
    //     (not all of global.css - most of it is layout/button classes,
    //     not prose formatting).
    const PLUGINS =
        "accordion advlist anchor autolink autoresize autosave charmap code " +
        "codesample directionality emoticons fullscreen help image importcss " +
        "insertdatetime link lists media nonbreaking pagebreak preview quickbars " +
        "save searchreplace table template visualblocks visualchars wordcount baharribbon";

    // Grouped so related buttons sit together. This is a lot of buttons for
    // one toolbar - toolbar_mode: 'wrap' (below) lets it flow onto extra
    // rows under the Bahar ribbon's action row instead of hiding half of it
    // behind a "more" overflow chevron.
    const TOOLBAR =
        "baharsave baharprint bahartemplates baharexport | baharrefnum baharsignature baharpagetools baharblocks | " +
        "undo redo | blocks fontfamily fontsize | " +
        "bold italic underline strikethrough forecolor backcolor removeformat | " +
        "alignleft aligncenter alignright alignjustify | " +
        "bullist numlist outdent indent | " +
        "link anchor unlink image media table | " +
        "charmap emoticons insertdatetime nonbreaking pagebreak accordion template restoredraft | " +
        "searchreplace visualblocks visualchars ltr rtl | " +
        "code codesample preview fullscreen | " +
        "wordcount help";

    // Registers Save / Print / Templates / Export / Ref No. / Signature /
    // Page Tools / Move Blocks as genuine HugeRTE toolbar buttons (not a
    // separate custom-styled row) - they end up living inside the same
    // toolbar HugeRTE itself renders, using its own button/tooltip/menu
    // chrome. The actual behaviour still lives in ribbon.js (Save/Print/
    // Templates) and bahar-tools.js (Export/Ref No./Signature/Page Tools/
    // Move Blocks) - this plugin is just the wiring between those globals
    // and HugeRTE's UI registry. Registered once; HugeRTE calls this init
    // function again per editor instance because 'baharribbon' is in every
    // instance's plugins list, and each instance's own editor.ui.registry
    // is separate, so every instance gets its own copy of these buttons -
    // exactly like the built-in bold/italic/etc. buttons do.
    function registerBaharRibbonPlugin() {
        if (!window.hugerte || hugerte.PluginManager.get('baharribbon')) return;

        hugerte.PluginManager.add('baharribbon', function (editor) {
            editor.ui.registry.addButton('baharsave', {
                icon: 'save',
                tooltip: 'Save this document (Ctrl+S)',
                onAction: () => { if (window.quickSave) window.quickSave(); }
            });

            editor.ui.registry.addButton('baharprint', {
                icon: 'print',
                tooltip: 'Print this document',
                onAction: () => window.print()
            });

            editor.ui.registry.addButton('bahartemplates', {
                icon: 'browse',
                tooltip: 'Browse & load saved templates',
                onAction: () => { if (window.openTemplateList) window.openTemplateList(); }
            });

            editor.ui.registry.addMenuButton('baharexport', {
                icon: 'export',
                tooltip: 'Export this document as a file',
                fetch: (callback) => callback([
                    { type: 'menuitem', icon: 'export', text: 'Export as PDF', onAction: () => { if (window.exportAsPDF) window.exportAsPDF(); } },
                    { type: 'menuitem', icon: 'export', text: 'Export as Word (.doc)', onAction: () => { if (window.exportAsWord) window.exportAsWord(); } }
                ])
            });

            editor.ui.registry.addButton('baharrefnum', {
                icon: 'bookmark',
                tooltip: 'Generate the next reference number',
                onAction: () => { if (window.openRefNumModal) window.openRefNumModal(); }
            });

            editor.ui.registry.addButton('baharsignature', {
                icon: 'permanent-pen',
                tooltip: 'Insert a signature or stamp',
                onAction: () => {
                    // Capture straight from this editor's own selection API
                    // rather than the generic window.getSelection() fallback -
                    // this is the same editor instance whose toolbar the
                    // button was just clicked from, so it's always accurate.
                    window.baharSavedRange = editor.selection.getRng().cloneRange();
                    window.baharSavedEditable = editor.getElement();
                    if (window.openSignatureModal) window.openSignatureModal();
                }
            });

            editor.ui.registry.addMenuButton('baharpagetools', {
                icon: 'page-break',
                tooltip: 'Page break & A4 layout tools',
                fetch: (callback) => callback([
                    {
                        type: 'menuitem', icon: 'page-break', text: 'Insert Page Break',
                        onAction: () => {
                            window.baharSavedRange = editor.selection.getRng().cloneRange();
                            window.baharSavedEditable = editor.getElement();
                            if (window.insertPageBreak) window.insertPageBreak();
                        }
                    },
                    {
                        type: 'menuitem', icon: 'orientation', text: 'Toggle Margin Guides',
                        onAction: () => { if (window.toggleA4Guides) window.toggleA4Guides(); }
                    }
                ])
            });

            editor.ui.registry.addToggleButton('baharblocks', {
                icon: 'drag',
                tooltip: 'Drag to reorder document blocks',
                onSetup: (api) => {
                    api.setActive(document.body.classList.contains('bahar-blocks-mode'));
                    return () => {};
                },
                onAction: (api) => {
                    if (window.toggleBlockDragging) window.toggleBlockDragging();
                    api.setActive(document.body.classList.contains('bahar-blocks-mode'));
                }
            });
        });
    }
    registerBaharRibbonPlugin();

    // ribbon.js always creates "#hugerte-format-toolbar" as the bottom row
    // of "#bahar-ribbon" before this script runs (see script order in the
    // *.html pages). If it's somehow missing - ribbon.js failed to load, or
    // this got wired into a page without it - fall back to building a
    // standalone one after the header so HugeRTE still has somewhere to go.
    function insertToolbarContainer() {
        if (document.getElementById(TOOLBAR_ID)) return;

        const anchor = document.getElementById("bahar-ribbon") || document.getElementById("universal-header");
        if (!anchor) return;

        anchor.insertAdjacentHTML(
            "afterend",
            `<div id="${TOOLBAR_ID}" class="hugerte-format-toolbar no-print"></div>`
        );
    }

    function buildConfig(target, toolbarContainer) {
        return {
            target: target,
            inline: true,
            menubar: false,
            statusbar: false,
            branding: false,
            fixed_toolbar_container_target: toolbarContainer,
            toolbar_mode: "wrap", // let it wrap instead of hiding buttons behind "..."

            // Keep the ribbon populated & visible at all times instead of
            // collapsing to nothing whenever the field loses focus. Note:
            // fuel-invoice.html has 3 simultaneous HugeRTE instances (To
            // Address / Subject / Body) sharing this one container, and a
            // multi-page letter can have several too - fixed_toolbar_
            // container_target already funnels all of them into a single
            // shared box with only the most-recently-active editor's
            // toolbar actually rendered into it (that's how it behaved
            // before this change too, just hidden instead of persistent).
            // hugerte.css has a belt-and-braces rule that only shows the
            // last child of the container, in case a future HugeRTE
            // version ever renders more than one at once.
            toolbar_persist: true,

            // Render floating menus/dropdowns/dialogs fixed to the
            // viewport (not clipped by our sticky toolbar container). This
            // is what stops the font/color/etc. dropdowns from turning
            // into a cramped scrollable box inside the ribbon.
            ui_mode: "split",

            plugins: PLUGINS,
            toolbar: TOOLBAR,

            // Advanced table control: contextual toolbar that pops up
            // whenever the caret is inside a table, plus the "Advanced"
            // style/border/background tabs in the table & cell/row
            // property dialogs (table_advtab/table_cell_advtab/
            // table_row_advtab default to true already - listed
            // explicitly here so it's obvious it's intentional).
            table_toolbar:
                "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | " +
                "tableinsertcolbefore tableinsertcolafter tabledeletecol | tablecellprops tablemergecells tablesplitcells",
            table_advtab: true,
            table_cell_advtab: true,
            table_row_advtab: true,
            table_appearance_options: true,
            table_grid: true,

            font_family_formats:
                "Poppins=Poppins,sans-serif;" +
                "Arial=Arial,sans-serif;" +
                "Times New Roman='Times New Roman',serif;" +
                "Courier New='Courier New',monospace",
            font_size_formats: "10pt 12pt 14pt 16pt 18pt 24pt 32pt 48pt",

            // quickbars adds its own floating "+" prompt on empty lines by
            // default (quickbars_insert_toolbar) - with a full fixed
            // toolbar already visible above, that's just visual noise, so
            // it's switched off here. The selection popup (quick bold/
            // italic/link on highlighted text) is genuinely handy, so that
            // one stays on.
            quickbars_insert_toolbar: false,
            quickbars_selection_toolbar: "bold italic underline | forecolor | link",

            // Wire HugeRTE's own Ctrl+S (registered by the `save` plugin)
            // into the app's existing Save button instead of letting it
            // try to submit a <form> that doesn't exist on these pages.
            // There's already a Save button in the Bahar ribbon, so
            // `save`/`cancel` aren't in the visible toolbar above - this
            // just makes Ctrl+S work while the caret is inside a HugeRTE
            // field, which it otherwise wouldn't (contenteditable doesn't
            // get the browser's native save dialog, but it doesn't run
            // your save logic either, unless you wire it up like this).
            save_enablewhendirty: false,
            save_onsavecallback: function () {
                if (typeof window.quickSave === "function") window.quickSave();
            },

            // Starter snippets for the `template` plugin's "Insert
            // Template" button. Unrelated to the app's own Mongo-backed
            // "Templates" feature (the folder icon in the Bahar ribbon,
            // which saves/loads whole documents) - this is HugeRTE's own,
            // much smaller concept of reusable boilerplate paragraphs.
            // Replace these two with your own canned openings/closings.
            templates: [
                { title: "Formal Opening", description: "Standard salutation", content: "<p>Sir/Madam,</p><p>&nbsp;</p>" },
                { title: "Formal Closing", description: "Standard sign-off", content: "<p>Thanking you,</p><p>For Bahar Service Station</p>" }
            ],

            // image: with no images_upload_url / images_upload_handler
            // configured (there's no upload route in Backend/routes yet),
            // HugeRTE falls back to embedding picked/pasted images as
            // base64 straight into the saved HTML. Fine for a small scan
            // or logo, but nothing stops someone pasting a 10MB photo into
            // a letter - worth a real upload endpoint + a size guard if
            // this gets used for image-heavy documents.

            // codesample ships its own default language list (JS, HTML/
            // XML, CSS, PHP, Ruby, Python, Java, C, C++, C#) and fetches
            // Prism.js from cdnjs the first time the dialog is opened -
            // fine for an internal tool, just flagging the network call.

            // Inline mode has no iframe, so this gets injected into the
            // page's own <head> - scoped to the edited elements only,
            // don't touch `body` or it'll leak into the rest of the page.
            content_css: false,
            content_style:
                ".editable-content ul, .editable-content ol, .rte-field ul, .rte-field ol " +
                "{ padding-left: 40px; margin-bottom: 10px; } " +
                ".editable-content li, .rte-field li { margin-bottom: 5px; } " +
                ".editable-content table, .rte-field table " +
                "{ border-collapse: collapse; margin-bottom: 10px; } " +
                ".editable-content table td, .editable-content table th, " +
                ".rte-field table td, .rte-field table th " +
                "{ border: 1px solid #94a3b8; padding: 6px 8px; } " +
                ".editable-content img, .rte-field img { max-width: 100%; height: auto; } " +
                ".editable-content figure.image, .rte-field figure.image " +
                "{ display: table; margin: 0 0 10px; } " +
                ".editable-content figure.image figcaption, .rte-field figure.image figcaption " +
                "{ color: #64748b; font-size: 0.85em; text-align: center; margin-top: 4px; } " +
                ".editable-content pre, .rte-field pre " +
                "{ background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; " +
                "padding: 10px; overflow-x: auto; font-family: 'Courier New', monospace; } " +
                ".editable-content blockquote, .rte-field blockquote " +
                "{ border-left: 3px solid #cbd5e1; margin-left: 0; padding-left: 12px; color: #475569; } " +
                ".editable-content hr, .rte-field hr { border: none; border-top: 1px solid #cbd5e1; } " +
                ".editable-content details.mce-accordion, .rte-field details.mce-accordion " +
                "{ border: 1px solid #cbd5e1; border-radius: 4px; margin-bottom: 10px; padding: 6px 10px; } " +
                ".editable-content summary.mce-accordion-summary, .rte-field summary.mce-accordion-summary " +
                "{ cursor: pointer; font-weight: 600; }"
        };
    }

    // Initialize HugeRTE on a single element. Exposed on window so
    // auto-builder.js can call it for pages it creates dynamically.
    window.initHugeRTE = function (el) {
        if (!window.hugerte || !el) return;
        if (el.dataset.hugerteInit === "true") return; // don't double-init

        if (!el.id) el.id = "rte-" + Math.random().toString(36).slice(2, 9);
        const toolbarContainer = document.getElementById(TOOLBAR_ID);

        hugerte.init(buildConfig(el, toolbarContainer)).then(() => {
            el.dataset.hugerteInit = "true";
            // Native baharsave/baharprint/... buttons are now live inside
            // HugeRTE's own toolbar (see registerBaharRibbonPlugin above) -
            // ribbon.js's plain fallback action row is redundant, hide it.
            document.body.classList.add("bahar-hugerte-active");
        }).catch((err) => {
            console.error("HugeRTE failed to initialize on", el, err);
        });
    };

    // Tear down the HugeRTE instance bound to an element. Exposed for
    // auto-builder.js to call when it deletes a blank page.
    window.destroyHugeRTE = function (el) {
        if (!window.hugerte || !el || !el.id) return;
        const editor = hugerte.get(el.id);
        if (editor) editor.remove();
        delete el.dataset.hugerteInit;
    };

    document.addEventListener("DOMContentLoaded", () => {
        insertToolbarContainer();

        if (!window.hugerte) {
            console.error(
                "HugeRTE didn't load from the CDN - check your network connection or the <script> tag in this page's <head>."
            );
            return;
        }

        document.querySelectorAll(TARGET_SELECTOR).forEach((el) => {
            window.initHugeRTE(el);
        });
    });
})();
