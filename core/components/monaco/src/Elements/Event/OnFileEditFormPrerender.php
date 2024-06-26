<?php

namespace Monaco\Elements\Event;

class OnFileEditFormPrerender extends Event
{
    public $field = 'modx-file-content';
    public $language = 'html';
    public function run()
    {
        if ($this->sp['file']) {
            $this->getLanguageFromExtension($this->sp['file'], $this->language);
        }
        $this->initializeEditor();
    }
}