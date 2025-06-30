<?php

namespace Lkn\NotePlus\App\List;

use Lkn\NotePlus\App\Card\CardReferType;
use Lkn\NotePlus\App\Card\CardState;
use Lkn\NotePlus\Utils;
use Throwable;
use WHMCS\Database\Capsule;
use stdClass;

final class ListController
{
    public function index(array $request): void
    {
        try {
            $lists = ListModel::all(['id', 'name', 'state']);

            Utils::api(true, ['lists' => $lists]);
        } catch (Throwable $e) {
            Utils::log('Update list', $request, ['error' => $e->__toString()]);

            Utils::api(false, ['errorCode' => 'internal-error', 'error' => $e->getMessage()]);
        }
    }

    public function indexArchived(array $request)
    {
        try {
            $lists = ListModel::all();

            Utils::api(true, ['lists' => $lists]);
        } catch (Throwable $e) {
            Utils::log('Update list', $request, ['error' => $e->__toString()]);
            Utils::api(false, ['errorCode' => 'internal-error', 'error' => $e->getMessage()]);
        }
    }

    public function update(array $request): void
    {
        try {
            $listId = (int) ($request['listId']);
            $list = ListModel::find($listId);

            if (!empty($request['name'])) {
                $list->name = substr($request['name'] ?? '', 0, 50);
            }

            if (!empty($request['state'])) {
                $list->state = (int) ($request['state']);
            }

            $list->save();

            Utils::api(true);
        } catch (Throwable $e) {
            Utils::log('Update list', $request, ['error' => $e->__toString()]);
            Utils::api(false, ['errorCode' => 'internal-error', 'error' => $e->getMessage()]);
        }
    }

    public function create(array $request): void
    {
        try {
            $name = substr($request['name'], 0, 50);

            $nameAlreadyExists = ListModel::where('name', $name)->exists();

            if ($nameAlreadyExists) {
                Utils::api(false, ['errorCode' => 'list-name-already-exists']);

                return;
            }

            $list = ListModel::create(['name' => $name]);

            Utils::api(true, ['list' => [
                'id' => $list->id,
                'name' => $list->name,
                'state' => ListState::IN_PROGRESS->value,
                'cards' => []
            ]]);
        } catch (Throwable $e) {
            Utils::log('Create list', $request, ['error' => $e->__toString()]);
            Utils::api(false, ['errorCode' => 'internal-error']);
        }
    }

    public function archive(array $request): void
    {
        try {
            $listId = filter_var($request['listId'], FILTER_SANITIZE_NUMBER_INT);

            $list = ListModel::find($listId);

            $list->state = ListState::ARCHIVED->value;

            $wasListArchived = $list->save();

            if (!$wasListArchived) {
                Utils::api(false);

                return;
            }
            Utils::api(true);
        } catch (Throwable $e) {
            Utils::log('archive list', $request, ['error' => $e->__toString()]);

            Utils::api(false, ['errorCode' => 'internal-error', 'error' => $e->getMessage()]);
        }
    }

    public function unarchive($request)
    {
        try {
            $listId = filter_var($request['listId'], FILTER_SANITIZE_NUMBER_INT);

            $list = ListModel::find($listId);

            $list->state = ListState::IN_PROGRESS->value;

            $wasListUnarchived = $list->save();

            if (!$wasListUnarchived) {
                Utils::api(false);

                return;
            }
            Utils::api(true);
        } catch (Throwable $e) {
            Utils::log('unarchive list', $request, ['error' => $e->__toString()]);

            Utils::api(false, ['errorCode' => 'internal-error', 'error' => $e->getMessage()]);
        }
    }
}
