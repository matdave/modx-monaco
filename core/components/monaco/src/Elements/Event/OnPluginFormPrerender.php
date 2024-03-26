<?php

namespace Monaco\Elements\Event;

class OnPluginFormPrerender extends Event
{
    public $field = 'modx-plugin-plugincode';
    public $language = 'php';
    public function run()
    {
        $this->initializeEditor();
    }
}