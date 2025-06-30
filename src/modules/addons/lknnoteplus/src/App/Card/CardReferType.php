<?php

namespace Lkn\NotePlus\App\Card;

enum CardReferType: int
{
    case CLIENT = 1;
    case INVOICE = 2;
    case DOMAIN = 3;
    case TICKET = 4;
}
