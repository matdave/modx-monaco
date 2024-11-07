<?php

if ($object->xpdo) {
    /** @var modX $modx */
    $modx =& $object->xpdo;

    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
        case xPDOTransport::ACTION_UPGRADE:
            $setting = $modx->getObject('modSystemSetting', array('key' => 'which_element_editor'));
            if ($setting) {
                $setting->set('value', 'Monaco');
                $setting->save();
            }
            break;
    }
}
return true;