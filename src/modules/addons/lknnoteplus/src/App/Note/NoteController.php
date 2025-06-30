<?php

namespace Lkn\NotePlus\App\Note;

use Lkn\NotePlus\App\Card\Models\CardNoteModel;
use Lkn\NotePlus\App\Card\Services\CardLoadService;
use Lkn\NotePlus\App\Card\Services\SendEmailToMentionsService;
use Lkn\NotePlus\Utils;
use Throwable;
use WHMCS\Authentication\CurrentUser;

final class NoteController
{
    public function create(array $request): void
    {
        $adminId = (new CurrentUser())->admin()->id ?? 1;
        $cardId = filter_var($request['cardId'], FILTER_SANITIZE_NUMBER_INT);
        $clientId = filter_var($request['clientId'], FILTER_SANITIZE_NUMBER_INT);
        $note = substr($request['note'], 0, 1000);
        $isImportant = (bool) ($request['isImportant']);

        try {
            $noteInstance = NoteModel::create([
                'userid' => $clientId,
                'adminid' => $adminId,
                'note' => $note,
                'sticky' => $isImportant
            ]);

            CardNoteModel::create([
                'card_id' => $cardId,
                'note_id' => $noteInstance->id
            ]);

            $cardService = CardLoadService::fromId($cardId);

            $service = new SendEmailToMentionsService($note, $cardService, 'note');
            $service->send();

            Utils::api(true, [
                'note' => [
                    'id' => $noteInstance->id,
                    'modified' => $noteInstance->modified,
                    'admin' => [
                        'fullName' => trim("{$noteInstance->admin->firstname} {$noteInstance->admin->lastname}"),
                        'email' => $noteInstance->admin->email
                    ],
                    'note' => $noteInstance->note
                ]
            ]);
        } catch (Throwable $e) {
            Utils::log('Create note', $request, ['error' => $e->__toString()]);
            Utils::api(false, ['errorCode' => 'internal-error', 'error' => $e->getMessage()]);
        }
    }

    public function delete(array $request): void
    {
        try {
            $noteId = filter_var($request['noteId'], FILTER_SANITIZE_NUMBER_INT);

            NoteModel::destroy($noteId);

            Utils::api(true);
        } catch (Throwable $e) {
            Utils::log('Delete note', $request, ['error' => $e->__toString()]);
            Utils::api(false, ['errorCode' => 'internal-error', 'error' => $e->getMessage()]);
        }
    }

    public function index(array $request): void
    {
        try {
            $notes = NoteModel::with('card', 'admin:id,firstname,lastname,email')
                ->select('tblnotes.modified', 'tblnotes.sticky', 'tblnotes.userid', 'tblnotes.adminid')
                ->selectRaw('tblnotes.id, SUBSTRING(tblnotes.note, 1, 200) as note')
                ->limit(150)
                ->orderBy('modified', 'DESC')
                ->get();

            Utils::api(true, ['notes' => $notes]);
        } catch (Throwable $e) {
            Utils::log('Index notes', $request, ['error' => $e->__toString()]);
            Utils::api(false, ['errorCode' => 'internal-error', 'error' => $e->getMessage()]);
        }
    }
}
