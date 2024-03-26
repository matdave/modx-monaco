<?php

namespace Monaco\Elements\Event;

class OnFileCreateFormPrerender extends Event
{
    public $field = 'modx-file-content';
    public $language = 'html';
    public function run()
    {
        $this->initializeEditor();
    }
}