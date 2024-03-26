<?php

namespace Monaco\Elements\Event;

class OnChunkFormPrerender extends Event
{
    public $field = 'modx-chunk-snippet';
    public $language = 'html';
    public function run()
    {
        $this->initializeEditor();
    }
}