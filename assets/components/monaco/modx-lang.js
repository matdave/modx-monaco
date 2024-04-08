const EMPTY_ELEMENTS = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "menuitem",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
];

monaco.languages.register({ id: "modx" });
monaco.languages.setLanguageConfiguration("modx", {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
    comments: {
        blockComment: ["[[-", "]]"]
    },
    brackets: [
        ["[[", "]]"],
        ["[^", "^]"],
        // HTML
        ["<!--", "-->"],
        ["<", ">"],
        ["{", "}"],
        ["(", ")"]
    ],
    autoClosingPairs: [
        { open: '`', close: '`' },
        { open: '^', close: '^' },
        // HTML
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
    ],
    surroundingPairs: [
        { open: '`', close: '`' },
        { open: '^', close: '^' },
        // HTML
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: "<", close: ">" }
    ],
    onEnterRules: [
        {
            beforeText: new RegExp(
                `<(?!(?:${EMPTY_ELEMENTS.join("|")}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`,
                "i"
            ),
            afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
            action: {
                indentAction: monaco.languages.IndentAction.IndentOutdent
            }
        },
        {
            beforeText: new RegExp(
                `<(?!(?:${EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,
                "i"
            ),
            action: { indentAction: monaco.languages.IndentAction.Indent }
        }
    ]
});
monaco.languages.setMonarchTokensProvider("modx", {
        ignoreCase: true,
        tokenPostfix: ".html",
        keywords: [],
        tokenizer: {
            root: [
                [/(\[\[-)/, [{ token:"delimiter", next:"@modxComment" }]],
                [/(\[\[)(!?)([+*$]?\+{0,2})((?:[\w\-.]+)?[\w\-.]+)/, ["delimiter", "delimiter", "delimiter", { token:"tag", next:"@main" }]],
                [/(\[\^)(!?)((?:[\w\-.]+)?[\w\-.]+)/, ["delimiter", "delimiter", { token:"attribute.name", next:"@timing" }]],
                // HTML
                [/<!DOCTYPE/, "metatag", "@doctype"],
                [/<!--/, "comment", "@comment"],
                [/(<)((?:[\w\-]+:)?[\w\-]+)(\s*)(\/>)/, ["delimiter", "tag", "", "delimiter"]],
                [/(<)(script)/, ["delimiter", { token: "tag", next: "@script" }]],
                [/(<)(style)/, ["delimiter", { token: "tag", next: "@style" }]],
                [/(<)((?:[\w\-]+:)?[\w\-]+)/, ["delimiter", { token: "tag", next: "@otherTag" }]],
                [/(<\/)((?:[\w\-]+:)?[\w\-]+)/, ["delimiter", { token: "tag", next: "@otherTag" }]],
                [/</, "delimiter"],
            ],
            /**
             *  MODX
             */
            main: [
                [/(]])/, "delimiter", "@pop"],
                [/([?:&@])((?:[\w\-.]+:)?[\w\-.]+)+/, ["delimiter", { token:"attribute.name", next:"@attribute"}]],
                [/([?:&@=])/, "delimiter"],
                [/[\^`]/, {token: "attribute.value", next: "@modxValue"}],
                [/[ \t\r\n]+/],
            ],
            attribute: [
                [/=/, "delimiter", "@pop"],
                [/((?:[\w\-.]+:)?[\w\-.]+)/, "attribute.name"],
            ],
            modxComment: [
                [/(]])/, "delimiter", "@pop"],
                [/([?:&@=<>!/\\"'])/, "delimiter"],
                [/((?:[\w\-]+:)?[\w\-]+)/, "comment"],
                [/(\[\[)(!?)([+*$]?\+{0,2})((?:[\w\-.]+)?[\w\-.]+)/, ["delimiter", "delimiter", "delimiter", { token:"comment", next:"@modxComment" }]],
                [/(\[\^)(!?)((?:[\w\-.]+)?[\w\-.]+)/, ["delimiter", "delimiter", { token:"comment", next:"@modxComment" }]],
                [/[ \t\r\n]+/]
            ],
            modxValue: [
                [/[\^`]/, "delimiter", "@pop"],
                [/([?:&@=<>!/\\"'])/, "delimiter"],
                [/[\w\-]+/, "attribute.value"],
                [/(\[\[)(!?)([+*$]?\+{0,2})((?:[\w\-.]+)?[\w\-.]+)/, ["delimiter", "delimiter", "delimiter", { token:"attribute.name", next:"@main" }]],
                [/[ \t\r\n]+/]
            ],
            timing: [
                [/(\^])/, "delimiter", "@pop"],
                [/([?:&@=])/, "delimiter"],
                [/((?:[\w\-.]+:)?[\w\-.]+)/, "attribute.name"],
                [/[ \t\r\n]+/]
            ],
            /**
             * HTML
             */
            doctype: [
                [/[^>]+/, "metatag.content"],
                [/>/, "metatag", "@pop"]
            ],
            comment: [
                [/-->/, "comment", "@pop"],
                [/[^-]+/, "comment.content"],
                [/./, "comment.content"]
            ],
            otherTag: [
                [/\/?>/, "delimiter", "@pop"],
                [/"([^"]*)"/, "attribute.value"],
                [/"([^"]*)"/, "attribute.value"],
                [/[\w\-]+/, "attribute.name"],
                [/=/, "delimiter"],
                [/(\[\[-)/, [{ token:"delimiter", next:"@modxComment" }]],
                [/(\[\[)(!?)([+*$]?\+{0,2})((?:[\w\-.]+)?[\w\-.]+)/, ["delimiter", "delimiter", "delimiter", { token:"tag", next:"@main" }]],
                [/[ \t\r\n]+/]
                // whitespace
            ],
            // -- BEGIN <script> tags handling
            // After <script
            script: [
                [/type/, "attribute.name", "@scriptAfterType"],
                [/"([^"]*)"/, "attribute.value"],
                [/"([^"]*)"/, "attribute.value"],
                [/[\w\-]+/, "attribute.name"],
                [/=/, "delimiter"],
                [
                    />/,
                    {
                        token: "delimiter",
                        next: "@scriptEmbedded",
                        nextEmbedded: "text/javascript"
                    }
                ],
                [/[ \t\r\n]+/],
                // whitespace
                [
                    /(<\/)(script\s*)(>)/,
                    ["delimiter", "tag", { token: "delimiter", next: "@pop" }]
                ]
            ],
            // After <script ... type
            scriptAfterType: [
                [/=/, "delimiter", "@scriptAfterTypeEquals"],
                [
                    />/,
                    {
                        token: "delimiter",
                        next: "@scriptEmbedded",
                        nextEmbedded: "text/javascript"
                    }
                ],
                // cover invalid e.g. <script type>
                [/[ \t\r\n]+/],
                // whitespace
                [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
            ],
            // After <script ... type =
            scriptAfterTypeEquals: [
                [
                    /"([^"]*)"/,
                    {
                        token: "attribute.value",
                        switchTo: "@scriptWithCustomType.$1"
                    }
                ],
                [
                    /"([^"]*)"/,
                    {
                        token: "attribute.value",
                        switchTo: "@scriptWithCustomType.$1"
                    }
                ],
                [
                    />/,
                    {
                        token: "delimiter",
                        next: "@scriptEmbedded",
                        nextEmbedded: "text/javascript"
                    }
                ],
                // cover invalid e.g. <script type=>
                [/[ \t\r\n]+/],
                // whitespace
                [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
            ],
            // After <script ... type = $S2
            scriptWithCustomType: [
                [
                    />/,
                    {
                        token: "delimiter",
                        next: "@scriptEmbedded.$S2",
                        nextEmbedded: "$S2"
                    }
                ],
                [/"([^"]*)"/, "attribute.value"],
                [/"([^"]*)"/, "attribute.value"],
                [/[\w\-]+/, "attribute.name"],
                [/=/, "delimiter"],
                [/[ \t\r\n]+/],
                // whitespace
                [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
            ],
            scriptEmbedded: [
                [/<\/script/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
                [/[^<]+/, ""]
            ],
            // -- END <script> tags handling
            // -- BEGIN <style> tags handling
            // After <style
            style: [
                [/type/, "attribute.name", "@styleAfterType"],
                [/"([^"]*)"/, "attribute.value"],
                [/"([^"]*)"/, "attribute.value"],
                [/[\w\-]+/, "attribute.name"],
                [/=/, "delimiter"],
                [
                    />/,
                    {
                        token: "delimiter",
                        next: "@styleEmbedded",
                        nextEmbedded: "text/css"
                    }
                ],
                [/[ \t\r\n]+/],
                // whitespace
                [
                    /(<\/)(style\s*)(>)/,
                    ["delimiter", "tag", { token: "delimiter", next: "@pop" }]
                ]
            ],
            // After <style ... type
            styleAfterType: [
                [/=/, "delimiter", "@styleAfterTypeEquals"],
                [
                    />/,
                    {
                        token: "delimiter",
                        next: "@styleEmbedded",
                        nextEmbedded: "text/css"
                    }
                ],
                // cover invalid e.g. <style type>
                [/[ \t\r\n]+/],
                // whitespace
                [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
            ],
            // After <style ... type =
            styleAfterTypeEquals: [
                [
                    /"([^"]*)"/,
                    {
                        token: "attribute.value",
                        switchTo: "@styleWithCustomType.$1"
                    }
                ],
                [
                    /"([^"]*)"/,
                    {
                        token: "attribute.value",
                        switchTo: "@styleWithCustomType.$1"
                    }
                ],
                [
                    />/,
                    {
                        token: "delimiter",
                        next: "@styleEmbedded",
                        nextEmbedded: "text/css"
                    }
                ],
                // cover invalid e.g. <style type=>
                [/[ \t\r\n]+/],
                // whitespace
                [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
            ],
            // After <style ... type = $S2
            styleWithCustomType: [
                [
                    />/,
                    {
                        token: "delimiter",
                        next: "@styleEmbedded.$S2",
                        nextEmbedded: "$S2"
                    }
                ],
                [/"([^"]*)"/, "attribute.value"],
                [/"([^"]*)"/, "attribute.value"],
                [/[\w\-]+/, "attribute.name"],
                [/=/, "delimiter"],
                [/[ \t\r\n]+/],
                // whitespace
                [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
            ],
            styleEmbedded: [
                [/<\/style/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
                [/[^<]+/, ""]
            ]
        }
});
