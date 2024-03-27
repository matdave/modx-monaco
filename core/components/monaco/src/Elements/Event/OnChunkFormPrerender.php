<?php

namespace Monaco\Elements\Event;

class OnChunkFormPrerender extends Event
{
    public $field = 'modx-chunk-snippet';
    public $language = 'html';
    public function run()
    {
        $object = $this->sp['chunk'];
        if ($object->get('static_file')) {
            $this->getLanguageFromExtension($object->get('static_file'), $this->language);
        }
        $this->initializeEditor();
    }
}