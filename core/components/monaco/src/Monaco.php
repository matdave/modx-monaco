<?php

namespace Monaco;

class Monaco
{
    /**
     * @var $modx \modX
     */
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
        $baseURL = rtrim($this->modx->getOption('site_url'), '/') . '/' . trim($this->config['assetsUrl'], '/'). '/';
        $this->modx->regClientStartupScript(
            '<script type="text/javascript">
                const MONACO_BASE_URL = "'. $baseURL .'";
            </script>', true
        );
        $this->modx->regClientStartupScript($this->config['assetsUrl'].'vs/monaco.js?lit=' . $this->lit);
        $this->modx->regClientStartupScript($this->config['assetsUrl'].'themes/monaco-themes.js?lit=' . $this->lit);
        $this->modx->regClientCSS($this->config['assetsUrl'].'vs/monaco.css?lit=' . $this->lit);
    }
}