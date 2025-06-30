<?php

namespace Lkn\NotePlus\App\Card;

enum CardState: int
{
    case IN_PROGRESS = 1;
    case ARCHIVED = 2;

    public function label(): string
    {
        return match ($this) {
            CardState::IN_PROGRESS => 'In progress',
            CardState::ARCHIVED => 'Archived'
        };
    }
}
