<?php

namespace Lkn\NotePlus;

class Utils
{
    /**
     * @since 1.0.0
     *
     * @param string $resource the piece of url to append to the end of the URL. No need to add initial /.
     *
     * @return string
     */
    public static function getAdminRootUrl(string $resource = ''): string
    {
        /**
         * @var \WHMCS\Config\Application
         */
        $whmcsConfigInstance = $GLOBALS['whmcsAppConfig'];
        $whmcsCustomAdminPath = trim($whmcsConfigInstance->OffsetGet('customadminpath'), '/');
        $whmcsRootUrl = rtrim($GLOBALS['CONFIG']['Domain'], '/');

        $whmcsAdminUrl = "$whmcsRootUrl/$whmcsCustomAdminPath/$resource";

        return rtrim($whmcsAdminUrl, '/');
    }

    public static function getRootUrl(string $resource = ''): string
    {
        $whmcsRootUrl = rtrim($GLOBALS['CONFIG']['Domain'], '/');

        return rtrim("$whmcsRootUrl/$resource", '/');
    }

    /**
     * @since 1.0.0
     * @see https://stackoverflow.com/a/40081879/16530764
     *
     * @param array $array
     *
     * @return array
     */
    final public static function sanitizeApiRequest(array $array): array
    {
        $data = [];

        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $data[$key] = self::sanitizeApiRequest($value);
            } else {
                $data[$key] = trim(strip_tags($value));
            }
        }

        return $data;
    }

    final public static function api(bool $success, array $data = []): void
    {
        $response = ['success' => $success];

        if (count($data) > 0) {
            $response['data'] = $data;
        }

        http_response_code(200);

        echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    final public static function log(
        string $action,
        array|object|string|null $request,
        array|object|string|null $response = ''
    ): void {
        $request = (array) $request;
        $request = empty($request) ? '' : json_encode($request, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        $response = is_string($response) ? $response : json_encode((array) ($response), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        logModuleCall(
            'lknnoteplus',
            $action,
            $request,
            $response
        );
    }

    public static function lang(?string $text = null): array|string
    {
        $lang = (function (): array {
            $whmcsLang = $GLOBALS['CONFIG']['Language'];
            $moduleLang = in_array($whmcsLang, ['english', 'portuguese-br', 'portuguese-pt'], true) ? $whmcsLang : 'english';

            require __DIR__ . "/../lang/{$moduleLang}.php";

            return $_ADDONLANG;
        })();

        return $text ? $lang[$text] : $lang;
    }

    /**
     * Returns a constant defined in configs.php.
     *
     * @since 1.0.0
     *
     * @param string $constant
     *
     * @return mixed
     */
    final public static function constant(string $constant): mixed
    {
        $constants = require __DIR__ . '/constants.php';

        return $constants[$constant];
    }
}
