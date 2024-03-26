<?php

require_once dirname(__FILE__, 3) . '/vendor/autoload.php';

use Monaco\Monaco as MonacoBase;

class Monaco extends MonacoBase
{
    public function addPackage()
    {
        $this->modx->addPackage('monaco', $this->config['modelPath']);
    }
}