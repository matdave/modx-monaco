<?php

if ($object->xpdo) {
    /** @var modX $modx */
    $modx =& $object->xpdo;

    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
        case xPDOTransport::ACTION_UPGRADE:
            $setting = $modx->getObject('modSystemSetting', array('key' => 'skip_namespace'));
            if ($setting) {
                $value = explode(',', $setting->get('value'));
                if (in_array('consentfriend', $value)) {
                    // remove consentfriend
                    $newValue = array_diff($value, ['consentfriend']);
                    $setting->set('value', implode(',', $newValue));
                    $setting->save();
                }
            }
            break;
    }
}
return true;