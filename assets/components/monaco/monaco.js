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
            fixedOverflowWidgets: true,
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
                this.el = Ext.DomHelper.append(wrapper, {
                    tag: 'div',
                    style: 'width: 100%; height: 100%; min-height: 100%; resize:vertical; overflow: auto;',
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
        toggleFullScreen: function (e) {
            console.log(e);
            const wrapper = document.getElementById(this.cfg.selector + '-monaco-wrapper');
            const editor = document.getElementById(this.cfg.selector + '-monaco');
            if (wrapper.style.height === '100vh') {
                // wrapper styles
                wrapper.style.backgroundColor = 'transparent';
                wrapper.style.height = 'auto';
                wrapper.style.width = 'auto';
                wrapper.style.position = 'relative';
                wrapper.style.padding = '0';
                wrapper.style.top = 'auto';
                wrapper.style.left = 'auto';
                wrapper.style.zIndex = 'auto';
                // editor styles
                editor.style.height = 'auto';
                e.target.innerText = _('monaco.editor.fullscreen')
            } else {
                // wrapper styles
                if (this.cfg.theme === 'vs') {
                    wrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                } else {
                    wrapper.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                }
                wrapper.style.height = '100vh';
                wrapper.style.width = '100vw';
                wrapper.style.position = 'fixed';
                wrapper.style.padding = '1rem';
                wrapper.style.top = '0';
                wrapper.style.left = '0';
                wrapper.style.zIndex = '9999';
                // editor styles
                editor.style.height = '100%';
                e.target.innerText = _('monaco.editor.minimize')
            }
            monaco.editor.getEditors()[0].layout();
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