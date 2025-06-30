<?php

namespace Lkn\NotePlus\App\List;

enum ListState: int
{
    case IN_PROGRESS = 1;
    case ARCHIVED = 2;

    public function label(): string
    {
        return match ($this) {
            ListState::IN_PROGRESS => 'In progress',
            ListState::ARCHIVED => 'Archived'
        };
    }
}
