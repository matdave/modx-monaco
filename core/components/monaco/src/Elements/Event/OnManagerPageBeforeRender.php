<?php

namespace Monaco\Elements\Event;

class OnManagerPageBeforeRender extends Event
{
    public $field = '';
    public $language = 'modx';
    public function run()
    {
        $namespace = $_GET['namespace'];
        $skip = explode(',', $this->modx->getOption('monaco.skip_namespace', $this->sp, '')) ?? [];
        if (in_array($namespace, $skip)) {
            return;
        }
        $this->initializeEditor();
    }
}