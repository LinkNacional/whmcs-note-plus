<?php

namespace Lkn\NotePlus\Helpers;

use Exception;
use Lkn\NotePlus\Utils;
use Smarty;

final class View
{
    private const VIEWS_PATH_PATH = __DIR__ . '/../resources/views';

    public static function render(string $view, array $vars = [], string $viewRootPath = ''): string
    {
        $viewPath = str_replace('.', '/', $view);
        $viewPath = (strlen($viewRootPath) > 0 ? $viewRootPath : self::VIEWS_PATH_PATH) . "/$viewPath.tpl";

        if (!file_exists($viewPath)) {
            throw new Exception('Smarty template not found.');
        }

        $smarty = new Smarty();

        foreach ($vars as $name => $value) {
            $smarty->assign($name, $value);
        }

        $smarty = self::assignInternalVars($smarty);

        return $smarty->fetch($viewPath);
    }

    private static function assignInternalVars(Smarty $smarty): Smarty
    {
        $smarty->assign('root_url', Utils::getRootUrl());
        $smarty->assign('lang', Utils::lang());

        return $smarty;
    }
}
