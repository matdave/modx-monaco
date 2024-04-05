<?php

namespace Monaco\Elements\Event;

class OnManagerPageBeforeRender extends Event
{
    public $field = '';
    public $language = 'modx';
    public function run()
    {
        $this->initializeEditor();
    }
}