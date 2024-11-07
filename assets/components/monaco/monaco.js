Ext.ns('Monaco');
Monaco.Editor = function(config, editorConfig) {
    Ext.apply(this.cfg, editorConfig, {});
    Monaco.Editor.superclass.constructor.call(this, config);
};
Ext.extend(Monaco.Editor,
    Ext.Component,
    {
        editor: null,
        renderedEditor: false,
        cfg: {
            selector: '',
            language: 'plaintext',
            value: '',
            automaticLayout: true,
            dimension: {
                width: 800,
                height: 400,
            },
            scrollBeyondLastLine: false,
            scrollBeyondLastColumn: 0,
            formatOnPaste: true,
            formatOnType: true,
            fixedOverflowWidgets: true,
        },
        initComponent: function () {
            Monaco.Editor.superclass.initComponent.call(this);
            Ext.onReady(this.renderEditor, this);
        },
        renderEditor: function () {
            Ext.apply(this.cfg, Monaco.editorConfig, {});
            if (this.renderedEditor === false) {
                this.renderedEditor = true;
                const renderTo = Ext.getCmp(this.cfg.selector);
                const renderToTextArea = Ext.get(this.cfg.selector);
                this.cfg.value = renderTo.getValue();
                const languageOptions = [
                    'html',
                    'modx',
                    'twig',
                    'css',
                    'less',
                    'scss',
                    'javascript',
                    'typescript',
                    'json',
                    'xml',
                    'mysql',
                    'plaintext',
                    'markdown',
                    'shell',
                    'yaml'
                ];
                const wrapper = Ext.DomHelper.insertBefore(renderToTextArea, {
                    tag: 'div',
                    style: 'width: 100%; height: 100%; min-height: 100%; box-sizing: border-box; backdrop-filter: blur(10px); display: flex; flex-wrap: wrap;',
                    id: this.cfg.selector + '-monaco-wrapper'
                });
                if (this.cfg.language !== 'php') {
                    this.select = Ext.DomHelper.append(wrapper, {
                        tag: 'select',
                        id: this.cfg.selector + '-monaco-language',
                        style: 'height: auto; margin-bottom: 1rem; margin-right: auto;',
                        class: 'x-form-text x-form-field modx-combo x-trigger-noedit',
                        children: languageOptions.map((language) => {
                            if (this.cfg.language === language) {
                                return {
                                    tag: 'option',
                                    value: language,
                                    html: language,
                                    selected: 'selected'
                                }
                            } else {
                                return {
                                    tag: 'option',
                                    value: language,
                                    html: language,
                                }
                            }
                        })
                    });
                }
                this.button = Ext.DomHelper.append(wrapper, {
                    tag: 'button',
                    id: this.cfg.selector + '-monaco-button',
                    style: 'height: auto; margin-bottom: 1rem; margin-left: auto;',
                    class: 'x-btn',
                    html: 'Fullscreen',
                });
                this.button.addEventListener('click', this.toggleFullScreen.bind(this));
                Ext.DomHelper.append(wrapper, {
                    tag: 'div',
                    style: 'width: 100%; height: 100%; min-height: 500px; resize:vertical; overflow: auto;',
                    id: this.cfg.selector + '-monaco'
                });
                renderToTextArea.setHeight(0);
                renderToTextArea.hide();
                const theme = MODx.config['monaco.theme'] || 'vs';
                if (['vs','vs-dark','hc-black','hc-light'].includes(theme)) {
                    monaco.editor.setTheme(theme);
                } else {
                    fetch(MONACO_BASE_URL + 'themes/' + theme + '.json')
                    .then(res => res.json())
                    .then(json => {
                        // convert theme name to lowercase and underscores
                        const themeRegx = new RegExp('([_ ]+)', 'g');
                        const themeShort = theme.toLowerCase().replaceAll(themeRegx,'-')
                        console.info( "using theme " + themeShort);
                        monaco.editor.defineTheme(themeShort, json);
                        monaco.editor.setTheme(themeShort);
                    })
                }
                const editor = monaco.editor.create(
                    document.getElementById(this.cfg.selector + '-monaco'),
                    this.cfg
                );
                this.editor = editor;
                if (this.cfg.language !== 'php') {
                    this.select.addEventListener('change', (e) => {
                        editor.getModel().setLanguage(e.target.value);
                    });
                }
                MODx.addListener('ready', (e) => {
                    if (renderTo.getValue() !== editor.getValue()) {
                        this.cfg.value = renderTo.getValue();
                        editor.setValue(this.cfg.value);
                    }
                }, this);
                editor.onDidChangeModelContent((e) => {
                    renderTo.setValue(editor.getValue());
                });
                editor.onKeyDown(this.autoCloseTags.bind(this));
                MODx.load({
                    xtype: 'modx-treedrop',
                    target: editor,
                    targetEl: editor.getDomNode(),
                    onInsert: (function(s){
                        // add the selected text to the editor
                        if (typeof s === 'string') {
                            editor.trigger('keyboard', 'type', {text: s});
                        }
                        return true;
                    }).bind(editor),
                    iframe: true
                });
            }
        },
        getValue() {
            return this.cfg.value;
        },
        toggleFullScreen: function (e) {
            const wrapper = Ext.get(e.target.parentElement.id);
            const editor = Ext.get(e.target.nextSibling.id);
            if (wrapper.getStyle('height') === '100vh') {
                // wrapper styles
                wrapper.setStyle({
                    backgroundColor: 'transparent',
                    height: 'auto',
                    width: 'auto',
                    position: 'relative',
                    padding: '0',
                    top: 'auto',
                    left: 'auto',
                    zIndex: 'auto',
                });
                // editor styles
                editor.setStyle('height', 'auto');
                e.target.innerText = _('monaco.editor.fullscreen')
            } else {
                // wrapper styles
                let background = 'rgba(0, 0, 0, 0.4)';
                if (this.cfg.theme === 'vs') {
                    background = 'rgba(255, 255, 255, 0.4)';
                }
                wrapper.setStyle({
                    backgroundColor: background,
                    height: '100vh',
                    width: '100vw',
                    position: 'fixed',
                    padding: '1rem',
                    top: '0',
                    left: '0',
                    zIndex: '9999',
                });
                // editor styles
                editor.setStyle('height', '100%');
                e.target.innerText = _('monaco.editor.minimize')
            }
            this.editor.layout();
        },
        autoCloseTags: function (event) {
            const editor = this.editor;
            // select enabled languages
            const enabledLanguages = ["html", "javascript", "markdown", "modx", "twig", "typescript"];

            const model = editor.getModel();
            if (!enabledLanguages.includes(model.getLanguageId())) {
                return;
            }

            const isSelfClosing = (tag) =>
                [
                    "area",
                    "base",
                    "br",
                    "col",
                    "command",
                    "embed",
                    "hr",
                    "img",
                    "input",
                    "keygen",
                    "link",
                    "meta",
                    "param",
                    "source",
                    "track",
                    "wbr",
                    "circle",
                    "ellipse",
                    "line",
                    "path",
                    "polygon",
                    "polyline",
                    "rect",
                    "stop",
                    "use",
                ].includes(tag);

            // when the user enters '>'
            if (event.browserEvent.key === ">") {
                const currentSelections = editor.getSelections();

                const edits = [];
                const newSelections = [];
                // potentially insert the ending tag at each of the selections
                for (const selection of currentSelections) {
                    // shift the selection over by one to account for the new character
                    newSelections.push(
                        new monaco.Selection(
                            selection.selectionStartLineNumber,
                            selection.selectionStartColumn + 1,
                            selection.endLineNumber,
                            selection.endColumn + 1,
                        ),
                    );
                    // grab the content before the cursor
                    const contentBeforeChange = model.getValueInRange({
                        startLineNumber: 1,
                        startColumn: 1,
                        endLineNumber: selection.endLineNumber,
                        endColumn: selection.endColumn,
                    });

                    // if ends with a HTML tag we are currently closing
                    const match = contentBeforeChange.match(/<([\w-]+)(?![^>]*\/>)[^>]*$/);
                    if (!match) {
                        continue;
                    }

                    const [fullMatch, tag] = match;

                    // skip self-closing tags like <br> or <img>
                    if (isSelfClosing(tag) || fullMatch.trim().endsWith("/")) {
                        continue;
                    }

                    // add in the closing tag
                    edits.push({
                        range: {
                            startLineNumber: selection.endLineNumber,
                            startColumn: selection.endColumn + 1, // add 1 to offset for the inserting '>' character
                            endLineNumber: selection.endLineNumber,
                            endColumn: selection.endColumn + 1,
                        },
                        text: `</${tag}>`,
                    });
                }

                // wait for next tick to avoid it being an invalid operation
                setTimeout(() => {
                    editor.executeEdits(model.getValue(), edits, newSelections);
                }, 0);
            }
        }
    });
Monaco.load = function(selector, language = 'html') {
    new Monaco.Editor({},{
        selector: selector,
        language: language,
    });
}
Monaco.TextEditor = function(config, editorConfig) {
    Ext.apply(this.cfg, editorConfig, {});
    Monaco.TextEditor.superclass.constructor.call(this, config);
};
Ext.extend(Monaco.TextEditor,
    Ext.form.TextArea,
    {
        language: 'plaintext',
        mimeType: 'text/plain',
        initComponent: function () {
            this.addListener('afterrender', this.loadMonaco, this);
        },
        loadMonaco: function () {
            this.checkMimeType();
            // hack for fred
            if (this.id === 'fred-element-content') {
                this.language = 'twig';
            }
            Monaco.load(this.id, this.language);
        },
        checkMimeType: function () {
            switch (this.mimeType) {
                case 'application/json':
                    this.language = 'json';
                    break;
                case 'text/html':
                    this.language = 'html';
                    break;
                case 'text/css':
                    this.language = 'css';
                    break;
                case 'text/javascript':
                    this.language = 'javascript';
                    break;
                case 'text/xml':
                    this.language = 'xml';
                    break;
                case 'application/x-twig':
                case 'text/x-twig':
                    this.language = 'twig';
                    break;
                case 'application/x-less':
                case 'text/x-less':
                    this.language = 'less';
                    break;
                case 'application/x-sass':
                case 'text/x-sass':
                case 'application/x-scss':
                case 'text/x-scss':
                    this.language = 'scss';
                    break;
                case 'application/x-markdown':
                case 'text/x-markdown':
                case 'text/markdown':
                    this.language = 'markdown';
                    break;
                case 'application/x-yaml':
                case 'text/x-yaml':
                case 'text/yaml':
                    this.language = 'yaml';
                    break;
                case 'text/x-sh':
                case 'text/x-shellscript':
                case 'application/x-sh':
                    this.language = 'shell';
                    break;
                case 'application/sql':
                case 'application/x-sql':
                case 'text/sql':
                case 'text/x-sql':
                    this.language = 'mysql';
                    break;
                case 'text/x-php':
                    this.language = 'php';
                    break;
                default:
                    this.language = 'plaintext';
                    break;
            }
        }
    }
);
Ext.reg('modx-texteditor', Monaco.TextEditor);