import { registerLanguage } from 'monaco-editor/esm/vs/basic-languages/_.contribution';

registerLanguage({
    id: "modx",
    extensions: ['.tpl'],
    alias: ['MODX', 'MODx'],
    mimetypes: ["text/html"],
    loader: ()  => {
        return import("./modx.js");
    }

})