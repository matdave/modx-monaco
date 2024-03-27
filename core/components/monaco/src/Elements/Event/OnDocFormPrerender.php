<?php

namespace Monaco\Elements\Event;

class OnDocFormPrerender extends Event
{
    public $field = 'ta';
    public $language = 'html';
    protected $sp = [];
    protected $settings = ['which_editor' => 'Monaco', 'which_element_editor' => 'Monaco'];

    public function run()
    {
        $object = $this->sp['resource'];
        if ($object->get('richtext')) {
            return;
        }
        if ($object->get('class_key') === 'modStaticResource' && $object->getSourceFile()) {
            $this->getLanguageFromExtension($object->getSourceFile(), $this->language);
        }
        if ($object->get('content_type') !== 'text/html' && !is_int($object->get('content_type'))) {
            $this->language = $this->getLanguageFromContentType($object->get('content_type'));
        } elseif (is_int($object->get('content_type'))) {
            // MODX 3
            $contentType = $this->modx->getObject('modContentType', ['id' => $object->get('content_type')]);
            if ($contentType) {
                $this->language = $this->getLanguageFromContentType($contentType->get('mime_type'));
            }
        }
        $this->initializeEditor();
    }
    private function getLanguageFromContentType($content_type) {
        switch ($content_type) {
            case 'text/html':
                return 'html';
            case 'text/css':
                return 'css';
            case 'text/javascript':
                return 'javascript';
            case 'application/json':
                return 'json';
            case 'application/xml':
                return 'xml';
            case 'application/x-yaml':
                return 'yaml';
            case 'application/x-twig':
                return 'twig';
            case 'application/x-php':
                return 'php';
            case 'application/x-sql':
                return 'sql';
            case 'application/x-less':
                return 'less';
            case 'application/x-sass':
            case 'application/x-scss':
                return 'scss';
            case 'application/x-markdown':
                return 'markdown';
            default:
                return $this->language;
        }
    }
}