<?php

namespace Monaco\Elements\Event;

class OnFileEditFormPrerender extends Event
{
    public $field = 'modx-file-content';
    public $language = 'html';
    public function run()
    {
        $this->initializeEditor();
    }
}