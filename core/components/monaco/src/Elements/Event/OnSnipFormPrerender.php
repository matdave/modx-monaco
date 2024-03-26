<?php

namespace Monaco\Elements\Event;

class OnSnipFormPrerender extends Event
{
    public $field = 'modx-snippet-snippet';
    public $language = 'php';
    public function run()
    {
        $this->initializeEditor();
    }
}