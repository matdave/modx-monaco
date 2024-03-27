<?php

namespace Monaco\Elements\Event;

class OnTempFormPrerender extends Event
{
    public $field = 'modx-template-content';
    public $language = 'html';
    public function run()
    {
        $object = $this->sp['template'];
        if ($object->get('static_file')) {
            $this->getLanguageFromExtension($object->get('static_file'), $this->language);
        }
        $this->initializeEditor();
    }
}