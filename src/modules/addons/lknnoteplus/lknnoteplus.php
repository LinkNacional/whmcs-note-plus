<?php

/**
 * @see https://developers.whmcs.com/addon-modules/
 */

use Lkn\NotePlus\Utils;
use WHMCS\Database\Capsule;

require_once __DIR__ . '/vendor/autoload.php';

if (!defined('WHMCS')) {
    exit;
}

/**
 * Define addon module configuration parameters.
 *
 * Also allows you to define any configuration parameters that should be
 * presented to the user when activating and configuring the module. These
 * values are then made available in all module function calls.
 *
 * @return array
 */
function lknnoteplus_config(): array
{
    $lang = Utils::lang();

    return [
        'name' => $lang['Note Plus'],
        'description' => <<<HTML
        <div style="margin-bottom: 10px">{$lang['Client note management.']}</div>
        <div>{$lang['By']} <a href="https://www.linknacional.com.br/" target="_blank"><strong>Link Nacional</strong></a></div>
HTML,
        'author' => <<<HTML
        <a href="https://www.linknacional.com.br/" target="_blank">
            <img src="data:image/png;base64, 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" width="70px" style="margin: 5px;">
        </a>
HTML,
        'language' => 'english',
        'version' => Utils::constant('version'),
        'fields' => [
            'header' => [
                'Description' => <<<HTML
                <div style="margin: 30px;">
                    <div>
                        <a href="addonmodules.php?module=lknnoteplus">
                            <strong>{$lang['Access module interface']}</strong>
                        </a> &#x2022
                        <a href="logs/module-log">
                            <strong>{$lang['Access module logs']}</strong>
                        </a>
                    </div>
                    <p style="margin-top: 12px">
                        <i class="fas fa-exclamation-triangle fa-sm"></i>
                        {$lang['Grant Access Control to your group to access the module interface.']}
                    </p>
                    <p style="margin-top: 12px">
                        <i class="fas fa-exclamation-triangle fa-sm"></i>
                        {$lang['If you encounter activation issues due to database tables, make sure that the tblclients and tblnotes tables are using the InnoDB engine with the utf8mb4_unicode_ci collation.<br>We recommend backing up the databse table before making any changes.']}
                    </p>
                </div>
HTML
            ]
        ]
    ];
}

/**
 * Admin Area Output.
 *
 * Called when the addon module is accessed via the admin area.
 * Should return HTML output for display to the admin user.
 *
 * @return void
 */
function lknnoteplus_output($vars): void
{
    $whmcsLang = $GLOBALS['aInt']->language;
    $availableModuleLangs = ['english' => 'en-US', 'portugues-br' => 'pt-BR'];
    $moduleLang = array_key_exists($whmcsLang, $availableModuleLangs) ? $whmcsLang : 'english';
    $moduleLang = $availableModuleLangs[$moduleLang];

    $assets = scandir(__DIR__ . '/src/assets/assets/');
    $assetsHtml = '<div id="lknnoteplus"></div>';

    $whmcsRootUrl = rtrim($GLOBALS['CONFIG']['Domain'], '/');

    foreach ($assets as $assetFilename) {
        if (in_array($assetFilename, ['.', '..'], true)) {
            continue;
        }

        $fileUrlPath = "$whmcsRootUrl/modules/addons/lknnoteplus/src/assets/assets/$assetFilename";

        if (str_ends_with($fileUrlPath, '.js')) {
            $assetsHtml .= "<script type='module' src='{$fileUrlPath}'></script>";
        } elseif (str_ends_with($fileUrlPath, '.css')) {
            $assetsHtml .= "<link rel='stylesheet' href='{$fileUrlPath}'>";
        }
    }

    http_response_code(200);

    echo <<<HTML
    <script type="text/javascript">
        window.lknNotePlus = {}
        window.lknNotePlus.config = { lang: '{$moduleLang}', apiUrl:  '{$whmcsRootUrl}/modules/addons/lknnoteplus/api.php'}
    </script>
    $assetsHtml
    HTML;
}

function lknnoteplus_activate(): void
{
    $pdo = Capsule::connection()->getPdo();

    if (!Capsule::schema()->hasTable('mod_lknnoteplus_lists')) {
        $pdo->exec("
            CREATE TABLE `mod_lknnoteplus_lists` (
                `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
                `name` varchar(100) NOT NULL,
                `state` enum('1','2') NOT NULL DEFAULT '1' COMMENT 'The enum values are handled at the ListState PHP enum.',
                PRIMARY KEY (`id`),
                UNIQUE KEY `mob_lknnoteplus_lists_UN` (`name`)
            ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
    }

    if (!Capsule::schema()->hasTable('mod_lknnoteplus_cards')) {
        $pdo->exec("
            CREATE TABLE `mod_lknnoteplus_cards` (
                `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
                `list_id` int(10) unsigned NOT NULL,
                `state` enum('1','2') NOT NULL DEFAULT '1' COMMENT 'The enum values are handled at the CardState PHP enum. ',
                `refer_type` enum('1','2','3') DEFAULT 1 NOT NULL,
                `refer_id` INT(10) unsigned NOT NULL,
                `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                KEY `list_foreign_key` (`list_id`),
                CONSTRAINT `list_foreign_key` FOREIGN KEY (`list_id`) REFERENCES `mod_lknnoteplus_lists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
    }

    if (!Capsule::schema()->hasTable('mod_lknnoteplus_cards_notes')) {
        $pdo->exec('
            CREATE TABLE `mod_lknnoteplus_cards_notes` (
                `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
                `card_id` int(10) unsigned NOT NULL,
                `note_id` int(10) NOT NULL,
                PRIMARY KEY (`id`),
                KEY `mod_lknnoteplus_cards_notes_FK` (`card_id`),
                KEY `mod_lknnoteplus_cards_notes_FK_1` (`note_id`),
                CONSTRAINT `mod_lknnoteplus_cards_notes_FK` FOREIGN KEY (`card_id`) REFERENCES `mod_lknnoteplus_cards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT `mod_lknnoteplus_cards_notes_FK_1` FOREIGN KEY (`note_id`) REFERENCES `tblnotes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');
    }
}
