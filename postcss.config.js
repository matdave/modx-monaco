const cssnanoPlugin = require("cssnano");
const autoprefixer = require("autoprefixer");
const advancedPreset = require("cssnano-preset-advanced");
const postcssImport = require("postcss-import");
const postcssUrl = require('postcss-url');

const preset = advancedPreset({
    discardUnused: true,
    discardDuplicates: true,
    discardOverridden: true,
    discardEmpty: true,
    discardComments: true,
    reduceIdents: true,
    mergeIdents: true,
    mergeRules: true,
});

module.exports = {
    modules: true,
    plugins: [
        postcssImport({
            path: [
                "node_modules",
                "_build/assets/css",
            ],
            addModulesDirectories: ["node_modules"],
        }),
        autoprefixer,
        cssnanoPlugin({ preset }),
        postcssUrl({
            url: 'rebase'
        })
    ]
}
