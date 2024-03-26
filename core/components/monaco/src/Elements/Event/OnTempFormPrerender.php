<?php

namespace Monaco\Elements\Event;

class OnTempFormPrerender extends Event
{
    public $field = 'modx-template-content';
    public $language = 'html';
    public function run()
    {
        $this->initializeEditor();
    }
}