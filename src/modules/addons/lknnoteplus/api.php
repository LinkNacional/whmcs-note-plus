<?php

/**
 * This file handle requests that come primary from the module configuration pages.
 *
 * These requests are made by JS fetch(). They are primary located in /resources/js
 * and others are located directly in a .tpl file.
 */

use Lkn\NotePlus\App\Card\CardController;
use Lkn\NotePlus\App\List\ListController;
use Lkn\NotePlus\App\Note\NoteController;
use Lkn\NotePlus\Utils;
use WHMCS\Authentication\CurrentUser;

try {
    require_once __DIR__ . '/../../../init.php';
    require_once __DIR__ . '/vendor/autoload.php';

    $request = Utils::sanitizeApiRequest(json_decode(file_get_contents('php://input'), true) ?? $_POST);
    $currentUser = new CurrentUser();

    $requestDomain = parse_url((empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://$_SERVER[HTTP_HOST]", PHP_URL_HOST);

    $whmcsDomain = parse_url(rtrim($GLOBALS['CONFIG']['Domain'], '/'), PHP_URL_HOST);

    if (
        $requestUrl !== $whmcsRootUrl &&
        (
            empty($request) ||
            !isset($request['a']) ||
            !$currentUser->admin()
        )
    ) {
        http_response_code(401);
        exit;
    }

    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');

    /**
     * $request['a'] is defined in the fetch() on the client side and is used to
     * define the resource the request wants to access.
     */
    $action = $request['a'];

    unset($request['a']);

    switch ($action) {
        case 'search-new-card-owner':
            (new CardController())->searchNewCardOwner($request);

            break;

        case 'card:new-card-search':
            (new CardController())->newCardSearch($request);

            break;

        case 'list:index':
            (new ListController())->index($request);

            break;

        case 'list:index:archived':
            (new ListController())->indexArchived($request);

            break;
        case 'list:create':
            (new ListController())->create($request);

            break;

        case 'list:update':
            (new ListController())->update($request);

            break;

        case 'list:unarchive':
            (new ListController())->unarchive($request);

            break;
        case 'list:update':
            (new ListController())->update($request);

            break;

        case 'cards:index:archived':
            (new CardController())->indexArchived($request);

            break;

        case 'card:index':
            (new CardController())->index($request);

            break;

        case 'card:search-mention':
            (new CardController())->searchMention($request);

            break;

        case 'card:create':
            (new CardController())->create($request);

            break;

        case 'card:show':
            (new CardController())->show($request);

            break;

        case 'note:create':
            (new NoteController())->create($request);

            break;

        case 'card:update':
            (new CardController())->update($request);

            break;

        case 'note:index':
            (new NoteController())->index($request);

            break;

        default:
            http_response_code(400);

            break;
    }
} catch (Throwable $e) {
    Utils::log('API error', $request, ['error' => $e->__toString()]);

    return Utils::api(false, ['error' => $e->__toString()]);
}
