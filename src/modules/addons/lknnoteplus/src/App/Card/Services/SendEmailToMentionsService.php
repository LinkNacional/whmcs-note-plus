<?php

namespace Lkn\NotePlus\App\Card\Services;

use Exception;
use Lkn\NotePlus\Helpers\View;
use Lkn\NotePlus\Utils;
use WHMCS\Authentication\CurrentUser;
use WHMCS\Database\Capsule;

final class SendEmailToMentionsService
{
    public readonly array $emailAddressesToSend;

    /**
     * @param string          $mentionText The mention text in the format
     *                                     "@(user.name), this is a demo text."
     * @param CardLoadService $card
     * @param string          $mentioedIn
     * @param string|null     $newText
     */
    public function __construct(
        public readonly string $mentionText,
        public readonly CardLoadService $card,
        public readonly string $mentioedIn,
        public readonly ?string $previousMentionText = null,
    ) {
        if (!in_array($mentioedIn, ['admin-note', 'note'], true)) {
            throw new Exception('Invalid $mentioedAt. Must be "admin-note" or "note".');
        }

        $this->defineNewMentionsEmailAddresses();
    }

    public function send()
    {
        $currentAdminData = $this->getCurrentAdmin();

        $title = "{$currentAdminData['username']} " . Utils::lang('mentioned you in the card') . " {$this->card->getCardTitle()}";
        $cardUrl = $this->card->getCardUrl();
        $mentionTextPreview = $this->getMentionTextWithoutMentionMask();

        $headers = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type:text/html;charset=UTF-8' . "\r\n";

        foreach ($this->emailAddressesToSend as $email) {
            $body = View::render('mention_email', [
                'mentionTextPreview' => $mentionTextPreview,
                'cardUrl' => $cardUrl
            ]);

            $wasEmailDelivered = mail(
                $email,
                $title,
                $body,
                $headers
            );

            Utils::log('Send email about mention', [
                'email' => $email,
                'title' => $title,
                'headers' => $headers,
                'body' => $body
            ], ['wasEmailDelivered' => $wasEmailDelivered]);
        }
    }

    private function getMentionTextWithoutMentionMask()
    {
        return preg_replace('/@\((.*?)\)/', '$1', $this->mentionText);
    }

    private function getCurrentAdmin()
    {
        $currentAdmin = (new CurrentUser())->admin();

        return [
            'email' => $currentAdmin->email,
            'username' => $currentAdmin->username
        ];
    }

    private function defineNewMentionsEmailAddresses()
    {
        preg_match_all('/(@)([\w.]+(?<!\.))/', $this->mentionText, $mentionedAdminUsernames, PREG_SET_ORDER);
        $mentionedAdminUsernames = array_column($mentionedAdminUsernames, 2);

        if ($this->previousMentionText) {
            preg_match_all('/(@)([\w.]+(?<!\.))/', $this->previousMentionText, $mentionsFromPreviousNote, PREG_SET_ORDER);

            $mentionedAdminUsernames = array_diff($mentionedAdminUsernames, array_column($mentionsFromPreviousNote, 2));
        }

        $emailsToSend = Capsule::table('tbladmins')
            ->whereIn('username', $mentionedAdminUsernames)
            ->get('email')
            ->pluck('email')
            ->toArray();

        $this->emailAddressesToSend = $emailsToSend;
    }
}
