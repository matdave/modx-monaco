<?php

namespace Monaco\Elements\Event;

class OnDocFormPrerender extends Event
{
    public $field = 'ta';
    public $language = 'modx';
    protected $sp = [];
    protected $settings = ['which_editor' => 'Monaco', 'which_element_editor' => 'Monaco'];

    public function run()
    {
        $object = $this->sp['resource'];
        if ($object) {
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
        } else {
            $richTextDefault = $this->modx->getOption('richtext_default', null, true);
            if ($richTextDefault) {
                return;
            }
        }
        $this->initializeEditor();
    }
    private function getLanguageFromContentType($content_type) {
        switch ($content_type) {
            case 'text/html':
                return 'modx';
            case 'text/css':
                return 'css';
            case 'text/javascript':
                return 'javascript';
            case 'application/json':
                return 'json';
            case 'application/xml':
                return 'xml';
            case 'text/yaml':
            case 'application/x-yaml':
            case 'text/x-yaml':
            case 'text/yaml':
                return 'yaml';
            case 'application/x-twig':
            case 'text/x-twig':
                return 'twig';
            case 'application/x-php':
            case 'application/x-httpd-php':
                return 'php';
            case 'application/sql':
            case 'application/x-sql':
            case 'text/sql':
            case 'text/x-sql':
                return 'sql';
            case 'application/x-less':
            case 'text/x-less':
                return 'less';
            case 'application/x-sass':
            case 'text/x-sass':
            case 'application/x-scss':
            case 'text/x-scss':
                return 'scss';
            case 'application/x-markdown':
            case 'text/x-markdown':
            case 'text/markdown':
                return 'markdown';
            default:
                return $this->language;
        }
    }
}