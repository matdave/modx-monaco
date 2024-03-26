<?php

$corePath = $modx->getOption(
    'monaco.core_path',
    null,
    $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/monaco/'
);

require_once($corePath . 'vendor/autoload.php');

if (!isset($scriptProperties)) {
    $scriptProperties = [];
}

if (empty($modx->version)) {
    $modx->getVersionData();
}
$scriptProperties['modx3'] = ($modx->version['version'] >= 3);
if ($modx->version['version'] < 3) {
    $monaco = $modx->getService(
        'monaco',
        'Monaco',
        $corePath . 'model/monaco/',
        [
            'core_path' => $corePath
        ]
    );
} else {
    $monaco = new \Monaco\Monaco($modx);
}

$class = "\\Monaco\\Elements\\Event\\{$modx->event->name}";

if (class_exists($class)) {
    $plugin = new $class($monaco, $scriptProperties);
    return $plugin->run();
} else {
    return $modx->lexicon('monaco.plugin.error.nf');
}