Ext.ns('Monaco');
Monaco.Editor = function(config, editorConfig) {
    Ext.apply(this.cfg, editorConfig, {});
    Monaco.Editor.superclass.constructor.call(this, config);
};
Ext.extend(Monaco.Editor,
    Ext.Component,
    {
        cfg: {
            selector: 'ta',
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
            theme: 'vs',
        },
        initComponent: function () {
            Monaco.Editor.superclass.initComponent.call(this);
            Ext.onReady(this.render, this);
        },
        render: function () {
            Ext.apply(this.cfg, Monaco.editorConfig, {});
            if (this.rendered === false) {
                this.rendered = true;
                const renderTo = Ext.getCmp(this.cfg.selector);
                const renderToTextArea = Ext.get(this.cfg.selector);
                this.cfg.value = renderTo.getValue();
                const languageOptions = [
                    'html',
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
                if (this.cfg.language !== 'php') {
                    this.select = Ext.DomHelper.insertBefore(renderToTextArea, {
                        tag: 'select',
                        id: this.cfg.selector + '-language',
                        style: 'width: 100%; height: auto; margin-bottom: 1rem;',
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
                this.el = Ext.DomHelper.insertBefore(renderToTextArea, {
                    tag: 'div',
                    style: 'width: 100%; height: 100%; resize:vertical; overflow: auto;',
                    id: this.cfg.selector + '-monaco'
                });
                renderToTextArea.setHeight(0);
                renderToTextArea.hide();
                const editor = monaco.editor.create(
                    document.getElementById(this.cfg.selector + '-monaco'),
                    this.cfg
                );
                if (this.cfg.language !== 'php') {
                    this.select.addEventListener('change', (e) => {
                        editor.getModel().setLanguage(e.target.value);
                    });
                }
                editor.onDidChangeModelContent((e) => {
                    renderTo.setValue(editor.getValue());
                });
            }
        },
        rendered: false,
    });
Monaco.load = function(selector, language = 'html', theme = 'vs') {
    new Monaco.Editor({},{
        selector: selector,
        language: language,
        theme: theme
    });
    // current hack to get the MODx.treedrop to work
    const selectorEl = monaco.editor.getEditors()[0];
    MODx.load({
        xtype: 'modx-treedrop',
        target: selectorEl,
        targetEl: selectorEl.getDomNode(),
        onInsert: (function(s){
            // add the selected text to the editor
            if (typeof s === 'string') {
                selectorEl.trigger('keyboard', 'type', {text: s});
            }
            return true;
        }).bind(selectorEl),
        iframe: true
    });
}