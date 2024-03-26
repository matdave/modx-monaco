<?php

namespace Monaco\Elements\Event;

class OnRichTextEditorRegister extends Event
{
    public function run()
    {
        $this->modx->event->output('Monaco');
    }
}