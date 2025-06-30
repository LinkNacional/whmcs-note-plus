<?php

namespace Lkn\NotePlus\App\Card;

use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Lkn\NotePlus\App\Card\Models\CardModel;
use Lkn\NotePlus\App\Card\Services\CardLoadService;
use Lkn\NotePlus\App\Card\Services\SendEmailToMentionsService;
use Lkn\NotePlus\Utils;
use Throwable;
use WHMCS\Database\Capsule;

final class CardController
{
    public function searchMention(array $request): void
    {
        try {
            $search = filter_var(substr($request['search'], 0, 255), FILTER_SANITIZE_FULL_SPECIAL_CHARS);

            $query = Capsule::table('tbladmins')->where('disabled', 0);

            if (!empty($search)) {
                $query = $query->where('firstname', 'LIKE', "%{$search}%")
                    ->orWhere('lastname', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('username', 'LIKE', "%{$search}%");
            }

            $results = $query->get(['email as display', 'username as id']);

            Utils::api(true, ['results' => $results]);
        } catch (Throwable $e) {
            Utils::api(false, ['errorCode' => 'internal-error']);
        }
    }

    public function searchNewCardOwner(array $request): void
    {
        try {
            $filter = $request['filter'];

            $clients = Capsule::table('tblclients')
                ->leftJoin('tbldomains', function ($join) {
                    $join->on('tblclients.id', '=', 'tbldomains.userid')
                        ->whereRaw('tbldomains.id = (SELECT MAX(id) FROM tbldomains WHERE tbldomains.userid = tblclients.id)');
                })
                ->select(
                    Capsule::raw("CONCAT(tblclients.firstname, ' ', tblclients.lastname) AS name"),
                    'email',
                    'tblclients.id',
                    'tbldomains.domain'
                )
                ->where('tblclients.firstname', 'like', "%$filter%")
                ->orWhere('tblclients.lastname', 'like', "%$filter%")
                ->orWhere('tblclients.email', 'like', "%$filter%")
                ->orWhere('tblclients.id', $filter)
                ->orWhere('tbldomains.domain', 'like', "%$filter%")
                ->groupBy('tblclients.id')
                ->limit(15)
                ->get();

            Utils::api(true, ['clients' => $clients]);
        } catch (Throwable $e) {
            Utils::log('Search new card owner', $request, ['error' => $e->__toString()]);
            Utils::api(false, ['errorCode' => 'internal-error']);
        }
    }

    public function index(array $request): void
    {
        try {
            $cards = Capsule::table('mod_lknnoteplus_cards as card')
                ->select('card.id', 'card.list_id', 'card.refer_id', 'card.refer_type', 'card.state', 'card.created_at')
                ->selectRaw('
                    CASE
                        WHEN card.refer_type = ' . CardReferType::INVOICE->value . ' THEN (SELECT description FROM tblinvoiceitems WHERE tblinvoiceitems.invoiceid = invoice.id ORDER BY tblinvoiceitems.id ASC LIMIT 1)
                        WHEN card.refer_type = ' . CardReferType::DOMAIN->value . ' THEN domain.domain
                        WHEN card.refer_type = ' . CardReferType::TICKET->value . ' THEN ticket.title
                        WHEN card.refer_type = ' . CardReferType::CLIENT->value . " THEN CONCAT(client.firstname, ' ',client.lastname)
                        ELSE NULL
                    END AS title
                ")
                ->leftJoin('tblinvoices as invoice', function ($join) {
                    $join->on('card.refer_id', '=', 'invoice.id')->where('card.refer_type', '=', CardReferType::INVOICE->value);
                })
                ->leftJoin('tbldomains as domain', function ($join) {
                    $join->on('card.refer_id', '=', 'domain.id')->where('card.refer_type', '=', CardReferType::DOMAIN->value);
                })
                ->leftJoin('tbltickets as ticket', function ($join) {
                    $join->on('card.refer_id', '=', 'ticket.id')->where('card.refer_type', '=', CardReferType::TICKET->value);
                })
                ->leftJoin('tblclients as client', function ($join) {
                    $join->on('card.refer_id', '=', 'client.id')->where('card.refer_type', '=', CardReferType::CLIENT->value);
                })
                ->leftJoin('mod_lknnoteplus_lists as list', function ($join) {
                    $join->on('card.list_id', '=', 'list.id');
                })
                ->limit(200)
                ->get();

            Utils::api(true, ['cards' => $cards]);
        } catch (Throwable $e) {
            Utils::log('Update list', $request, ['error' => $e->__toString()]);
            Utils::api(false, ['errorCode' => 'internal-error', 'error' => $e->getMessage()]);
        }
    }

    public function indexArchived(array $request): void
    {
        try {
            $cards = CardModel::all();
            $cards = Capsule::table('mod_lknnoteplus_cards as card')
                ->select('card.id', 'card.list_id', 'card.refer_id', 'card.refer_type')
                ->selectRaw('
                    CASE
                        WHEN card.refer_type = ' . CardReferType::INVOICE->value . ' THEN (SELECT description FROM tblinvoiceitems WHERE tblinvoiceitems.invoiceid = invoice.id ORDER BY tblinvoiceitems.id ASC LIMIT 1)
                        WHEN card.refer_type = ' . CardReferType::DOMAIN->value . ' THEN domain.domain
                        WHEN card.refer_type = ' . CardReferType::TICKET->value . ' THEN ticket.title
                        WHEN card.refer_type = ' . CardReferType::CLIENT->value . " THEN CONCAT(client.firstname, ' ',client.lastname)
                        ELSE NULL
                    END AS title
                ")
                ->leftJoin('tblinvoices as invoice', function ($join) {
                    $join->on('card.refer_id', '=', 'invoice.id')->where('card.refer_type', '=', CardReferType::INVOICE->value);
                })
                ->leftJoin('tbldomains as domain', function ($join) {
                    $join->on('card.refer_id', '=', 'domain.id')->where('card.refer_type', '=', CardReferType::DOMAIN->value);
                })
                ->leftJoin('tbltickets as ticket', function ($join) {
                    $join->on('card.refer_id', '=', 'ticket.id')->where('card.refer_type', '=', CardReferType::TICKET->value);
                })
                ->leftJoin('tblclients as client', function ($join) {
                    $join->on('card.refer_id', '=', 'client.id')->where('card.refer_type', '=', CardReferType::CLIENT->value);
                })
                ->leftJoin('mod_lknnoteplus_lists as list', function ($join) {
                    $join->on('card.list_id', '=', 'list.id');
                })
                ->where('card.state', CardState::ARCHIVED->value)
                ->get();

            Utils::api(true, ['cards' => $cards]);
        } catch (Throwable $e) {
            Utils::log('Update list', $request, ['error' => $e->__toString()]);
            Utils::api(false, ['errorCode' => 'internal-error', 'error' => $e->getMessage()]);
        }
    }

    public function newCardSearch(array $request): void
    {
        $search = $request['search'];
        $filter = $request['filter']; // all, invoice, client, ticket, domain
        $response = [];

        try {
            if (in_array($filter, ['all', 'client'], true)) {
                $clientSearch = Capsule::table('tblclients')
                    ->where('id', $search)
                    ->orWhere('firstname', 'like', "%$search%")
                    ->orWhere('lastname', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->limit(5)
                    ->get(['id', 'firstname', 'lastname', 'email']);

                foreach ($clientSearch as $client) {
                    $response[] = [
                        'refer_type' => CardReferType::CLIENT,
                        'id' => $client->id,
                        'title' => trim("{$client->firstname} {$client->lastname}")
                    ];
                }
            }

            if (in_array($filter, ['all', 'domain'], true)) {
                $domainSearch = Capsule::table('tbldomains')
                    ->where('id', $search)
                    ->orWhere('domain', 'like', "%$search%")
                    ->orWhere('additionalnotes', 'like', "%$search%")
                    ->limit(5)
                    ->get();

                foreach ($domainSearch as $domain) {
                    $response[] = [
                        'refer_type' => CardReferType::DOMAIN,
                        'id' => $domain->id,
                        'title' => trim("{$domain->domain}")
                    ];
                }
            }

            if (in_array($filter, ['all', 'ticket'], true)) {
                $ticketsSearch = Capsule::table('tbltickets')
                    ->where('id', $search)
                    ->orWhere('tid', 'like', "%$search%")
                    ->orWhere('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('title', 'like', "%$search%")
                    ->limit(5)
                    ->get();

                foreach ($ticketsSearch as $ticket) {
                    $response[] = [
                        'refer_type' => CardReferType::TICKET,
                        'id' => $ticket->id,
                        'title' => $ticket->title
                    ];
                }
            }

            if (in_array($filter, ['all', 'invoice'], true)) {
                $invoiceSearch = Capsule::table('tblinvoices')
                    ->where('tblinvoices.id', 'like', "%$search%")
                    ->orWhere('invoicenum', 'like', "%$search%")
                    ->leftJoin('tblinvoiceitems', 'tblinvoices.id', '=', 'tblinvoiceitems.invoiceid')
                    ->whereExists(function ($query) {
                        $query->selectRaw(1)
                            ->from('tblinvoiceitems as ii')
                            ->whereColumn('ii.invoiceid', 'tblinvoices.id')
                            ->limit(1);
                    })
                    ->limit(5)
                    ->get(['tblinvoices.id', 'tblinvoiceitems.description as lastItemDescrip']);

                foreach ($invoiceSearch as $invoice) {
                    $response[] = [
                        'refer_type' => CardReferType::INVOICE,
                        'id' => $invoice->id,
                        'title' => $invoice->lastItemDescrip
                    ];
                }
            }

            Utils::api(true, ['results' => $response]);
        } catch (Exception $e) {
            Utils::log('New card search error', $request, ['error' => $e->__toString()]);

            echo '<pre>e->_toString():';
            print_r($e->__toString());
            echo '</pre><hr>';

            Utils::api(false);
        }
    }

    public function update(array $request): void
    {
        try {
            $cardId = filter_var($request['cardId'], FILTER_SANITIZE_NUMBER_INT);
            $card = CardModel::with('notes:tblnotes.id')->find($cardId);

            if (!empty($request['state'])) {
                $card->state = CardState::from(filter_var($request['state'], FILTER_SANITIZE_NUMBER_INT))->value;
            }

            $adminNote = substr($request['note'], 0, 1000);
            $client = $card->client[0] ?? $card->client;
            $previousAdminNote = $client->notes;
            $client->notes = $adminNote;

            $wasAdminNoteSaved = $client->save();

            if (!$wasAdminNoteSaved) {
                Utils::api(false, ['errorCode' => 'unable-to-save-admin-note']);

                return;
            }

            $cardService = CardLoadService::fromId($cardId);

            // $previousAdminNote = '@(souzadavi), este cliente entrou em contato com @(macedo.fabricio) na última sexta-feira.';
            // $mentionText = '@(souzadavi), este cliente entrou em contato com @(macedo.fabricio) na última sexta-feira, solicitando que @(lopes.emanuel) desenvolvesse o plugin Cielo 4.0. Todavia, @(caldas.joao).';

            if (!empty($adminNote)) {
                $service = new SendEmailToMentionsService($adminNote, $cardService, 'admin-note', $previousAdminNote);
                $service->send();
            }

            $wasCardArchived = $card->save();

            Utils::api($wasCardArchived);
        } catch (Throwable $e) {
            Utils::log('Archive card', $request, ['error' => $e->__toString()]);

            Utils::api(false, ['errorCode' => 'internal-error', $e->__toString()]);
        }
    }

    public function create(array $request): void
    {
        try {
            $listId = (int) ($request['listId']);
            $referId = (int) ($request['referId']);
            $referType = (int) ($request['referType']);

            $card = CardModel::create([
                'list_id' => $listId,
                'refer_id' => $referId,
                'refer_type' => $referType,
                'state' => CardState::IN_PROGRESS->value,
            ]);

            Utils::api(true, ['card' => CardLoadService::fromModel($card)->getCard()]);
        } catch (Throwable $e) {
            Utils::log('Create card', $request, ['error' => $e->__toString()]);
            Utils::api(false, ['errorCode' => 'internal-error']);
        }
    }

    public function show(array $request)
    {
        $cardId = (int) ($request['cardId']);

        try {
            $cardService = CardLoadService::fromId($cardId);
            $cardService->loadNotes();
            $cardService->loadClient();

            Utils::api(true, ['card' => $cardService->getCard()]);
        } catch (ModelNotFoundException $e) {
            Utils::log('Show card', $request, ['error' => $e->__toString()]);
            Utils::api(false, ['errorCode' => 'not-found']);
        } catch (Throwable $e) {
            echo $e->__toString();
            Utils::log('Show card', $request, ['error' => $e->__toString()]);
            Utils::api(false, ['errorCode' => 'internal-error']);
        }
    }
}
