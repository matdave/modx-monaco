<?php

namespace Monaco\Elements\Event;

use Monaco\Monaco;

abstract class Event
{
    /**
     * A reference to the modX object.
     * @var $modx
     */
    public $modx = null;


    protected Monaco $monaco;

    /** @var array */
    protected $sp = [];

    /** @var array */
    protected $settings = ['which_element_editor' => 'Monaco'];

    public $field = '';
    public $language = 'plaintext';

    public function __construct($monaco, array $scriptProperties)
    {
        $this->monaco =& $monaco;
        $this->modx =& $this->monaco->modx;
        $this->sp = $scriptProperties;
    }

    abstract public function run();

    protected function getOption($key, $default = null, $skipEmpty = true)
    {
        return $this->modx->getOption($key, $this->sp, $default, $skipEmpty);
    }

    protected function initializeEditor()
    {
        if(!$this->checkSettings()) {
            return;
        }
        $this->monaco->loadEditor();
        if ($this->field !== '') {
            $theme = $this->getOption('monaco.theme', 'vs');
            $this->modx->regClientStartupScript($this->monaco->config['assetsUrl'].'monaco.js');
            $this->modx->regClientStartupHTMLBlock(
                '<script type="text/javascript">
                    Ext.onReady(function(){
                       Monaco.load("'.$this->field.'", "'.$this->language.'", "'.$theme.'" );
                    });
                </script>'
            );
        }
    }

    protected function checkSettings(): bool
    {
        $passed = false;
        foreach ($this->settings as $key => $value) {
            if ($this->getOption($key) == $value) {
                $passed = true;
            }
        }
        return $passed;
    }

    public function getLanguageFromExtension($path, $default = "plaintext", $htmlType = 'html'): void
    {
        $extension = pathinfo($path, PATHINFO_EXTENSION );
        // options = 'html', 'twig', 'css', 'less', 'scss', 'javascript', 'typescript', 'json', 'xml', 'mysql',
        // 'plaintext', 'php', 'md', 'yml', 'sh'
        $language = $default;
        switch ($extension) {
            case 'html':
            case 'tpl':
                $language = $htmlType;
                break;
            case 'twig':
                $language = 'twig';
                break;
            case 'css':
                $language = 'css';
                break;
            case 'less':
                $language = 'less';
                break;
            case 'scss':
                $language = 'scss';
                break;
            case 'js':
                $language = 'javascript';
                break;
            case 'ts':
                $language = 'typescript';
                break;
            case 'json':
                $language = 'json';
                break;
            case 'xml':
                $language = 'xml';
                break;
            case 'sql':
                $language = 'mysql';
                break;
            case 'php':
                $language = 'php';
                break;
            case 'md':
                $language = 'markdown';
                break;
            case 'yml':
            case 'yaml':
                $language = 'yaml';
                break;
            case 'sh':
                $language = 'shell';
                break;
        }
        $this->language = $language;
    }
}