<?php

namespace Monaco;

class Monaco
{
    public $modx;
    public $config = [];

    public function __construct($modx, array $config = [])
    {
        $this->modx = $modx;

        $corePath = $this->modx->getOption(
            'monaco.core_path',
            $config,
            $this->modx->getOption('core_path').'components/monaco/'
        );
        $assetsUrl = $this->modx->getOption(
            'monaco.assets_url',
            $config,
            $this->modx->getOption('assets_url').'components/monaco/'
        );
        $connectorUrl = $assetsUrl.'connector.php';

        $this->config = array_merge([
            'assetsUrl' => $assetsUrl,
            'connectorUrl' => $connectorUrl,
            'corePath' => $corePath,
            'modelPath' => $corePath.'model/',
        ], $config);
        $this->addPackage();

        $this->modx->lexicon->load('monaco:default');
    }

    public function addPackage()
    {
    }

    public function loadEditor()
    {
        $this->modx->regClientCSS($this->config['assetsUrl'].'vs/editor/editor.main.css');
        $this->modx->regClientStartupScript($this->config['assetsUrl'].'vs/loader.js');
        $this->modx->regClientStartupHTMLBlock(
            '<script type="text/javascript">
                require.config({paths: {vs: "'.$this->config['assetsUrl'].'vs"}});
            </script>'
        );
        $this->modx->regClientStartupScript($this->config['assetsUrl'].'vs/editor/editor.main.nls.js');
        $this->modx->regClientStartupScript($this->config['assetsUrl'].'vs/editor/editor.main.js');
        $this->modx->regClientStartupScript($this->config['assetsUrl'].'modx-lang.js');
    }
}