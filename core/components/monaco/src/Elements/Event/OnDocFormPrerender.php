<?php

namespace Monaco\Elements\Event;

class OnDocFormPrerender extends Event
{
    public $field = 'ta';
    public $language = 'html';
    public function run()
    {
        $this->initializeEditor();
    }
}