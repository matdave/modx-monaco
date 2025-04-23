import { registerHTMLLanguageService } from "monaco-editor/esm/vs/language/html/monaco.contribution";

registerHTMLLanguageService(
    'modx',
    {
        format: {
            tabSize: 4,
            insertSpaces: false,
            wrapLineLength: 120,
            unformatted: 'default": "a, abbr, acronym, b, bdo, big, br, button, cite, code, dfn, em, i, img, input, kbd, label, map, object, q, samp, select, small, span, strong, sub, sup, textarea, tt, var',
            contentUnformatted: "pre",
            indentInnerHtml: false,
            preserveNewLines: true,
            maxPreserveNewLines: void 0,
            indentHandlebars: false,
            endWithNewline: false,
            extraLiners: "head, body, /html",
            wrapAttributes: "auto"
        },
        suggest: {},
        data: { useDefaultDataProvider: true }
    },
    {
        completionItems: true,
        hovers: true,
        documentSymbols: true,
        links: true,
        documentHighlights: true,
        rename: true,
        colors: true,
        foldingRanges: true,
        selectionRanges: true,
        diagnostics: false,
        documentFormattingEdits: true,
        documentRangeFormattingEdits: true
    }
);

// @TODO CompletionAdapter