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

    public $field = '';
    public $language = '';

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
        if ($this->getOption('which_element_editor', 'Monaco') !== 'Monaco') {
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
}