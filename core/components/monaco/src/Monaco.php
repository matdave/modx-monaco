<?php

namespace Monaco;

class Monaco
{
    public $modx;
    public $config = [];
    public $lit = 0;

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
        $this->lit = $this->modx->getOption('monaco.lit', $config, 0);

        $this->modx->lexicon->load('monaco:default');
    }

    public function addPackage()
    {
    }

    public function loadEditor()
    {
        $this->modx->lexicon->load('monaco:default');
        $this->modx->controller->addLexiconTopic('monaco:default');
        $this->modx->regClientCSS($this->config['assetsUrl'].'vs/editor/editor.main.css?lit=' . $this->lit);
        $this->modx->regClientStartupScript($this->config['assetsUrl'].'vs/loader.js?lit=' . $this->lit);
        $this->modx->regClientStartupHTMLBlock(
            '<script type="text/javascript">
                const MONACO_BASE_URL = "'.$this->config['assetsUrl'].'";
                require.config({paths: {vs: "'.$this->config['assetsUrl'].'vs"}});
            </script>'
        );
        $this->modx->regClientStartupScript($this->config['assetsUrl'].'vs/editor/editor.main.nls.js?lit=' . $this->lit);
        $this->modx->regClientStartupScript($this->config['assetsUrl'].'vs/editor/editor.main.js?lit=' . $this->lit);
        $this->modx->regClientStartupScript($this->config['assetsUrl'].'themes/monaco-themes.js?lit=' . $this->lit);
        $this->modx->regClientStartupScript($this->config['assetsUrl'].'modx-lang.js?lit=' . $this->lit);
    }
}