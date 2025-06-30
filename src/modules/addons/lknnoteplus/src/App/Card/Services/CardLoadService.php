<?php

namespace Lkn\NotePlus\App\Card\Services;

use Lkn\NotePlus\App\Card\CardReferType;
use Lkn\NotePlus\App\Card\Models\CardModel;
use Lkn\NotePlus\Utils;
use WHMCS\Database\Capsule;

final class CardLoadService
{
    public CardModel $cardModelInstance;
    public string $title;
    public array $notes;
    public array $client;

    public static function fromId(int $cardId)
    {
        $cardService = new CardLoadService();

        $cardService->cardModelInstance = (CardModel::where('id', $cardId)->firstOrFail())->fresh();
        $cardService->title = $cardService->getCardTitle();

        return $cardService;
    }

    public static function fromModel(CardModel $cardModelInstance)
    {
        $cardService = new CardLoadService();

        $cardService->cardModelInstance = $cardModelInstance->fresh();
        $cardService->title = $cardService->getCardTitle();

        return $cardService;
    }

    public function loadClient()
    {
        $referId = $this->cardModelInstance->refer_id;

        switch (CardReferType::from($this->cardModelInstance->refer_type)) {
            case CardReferType::INVOICE:
                $this->client = (array) Capsule::table('tblinvoiceitems')->where('tblinvoiceitems.invoiceid', $referId)
                    ->leftJoin('tblclients', 'tblinvoiceitems.userid', '=', 'tblclients.id')
                    ->first(['tblclients.id', 'tblclients.notes as adminNotes']);

                break;
            case CardReferType::TICKET:
                $this->client = (array) Capsule::table('tbltickets')->where('tbltickets.id', $referId)
                    ->leftJoin('tblclients', 'tbltickets.userid', '=', 'tblclients.id')
                    ->first(['tblclients.id', 'tblclients.notes as adminNotes']);

                break;
            case CardReferType::CLIENT:
                $this->client = (array) Capsule::table('tblclients')->where('tblclients.id', $referId)
                    ->first(['tblclients.id', 'tblclients.notes as adminNotes']);

                break;
            case CardReferType::DOMAIN:
                $this->client = (array) Capsule::table('tbldomains')->where('tbldomains.id', $referId)
                    ->leftJoin('tblclients', 'tbldomains.userid', '=', 'tblclients.id')
                    ->first(['tblclients.id', 'tblclients.notes as adminNotes']);
                break;
        }
    }

    public function getCard(): array
    {
        $return = [
            'id' => $this->cardModelInstance->id,
            'list_id' => $this->cardModelInstance->list_id,
            'refer_id' => $this->cardModelInstance->refer_id,
            'refer_type' => $this->cardModelInstance->refer_type,
            'state' => $this->cardModelInstance->state,
            'title' => $this->title
        ];

        if (!empty($this->notes)) {
            $return['notes'] = $this->notes;
        }

        if (!empty($this->client)) {
            $return['client'] = $this->client;
        }

        return $return;
    }

    public function loadNotes()
    {
        $this->notes = $this->cardModelInstance->notes()->with('admin:id,firstname,lastname,email')->orderBy('id', 'desc')->get()->toArray();
    }

    public function getCardUrl()
    {
        return Utils::getAdminRootUrl("addonmodules.php?module=lknnoteplus#/{$this->cardModelInstance->id}");
    }

    public function getCardTitle(): string
    {
        $referId = $this->cardModelInstance->refer_id;
        $referType = CardReferType::from($this->cardModelInstance->refer_type);

        switch ($referType) {
            case CardReferType::INVOICE:
                return Capsule::table('tblinvoiceitems')->where('invoiceid', $referId)->orderBy('id', 'ASC')->limit(1)->value('description');

            case CardReferType::TICKET:
                return Capsule::table('tbltickets')->where('id', $referId)->value('title');

            case CardReferType::CLIENT:
                return Capsule::table('tblclients')->where('id', $referId)->selectRaw('CONCAT(firstname, " ", lastname) AS title')->value('title');

            case CardReferType::DOMAIN:
                return Capsule::table('tbldomains')->where('id', $referId)->value('domain');
        }
    }
}
