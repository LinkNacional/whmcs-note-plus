<?php

namespace Lkn\NotePlus\App\Card\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Lkn\NotePlus\App\Card\CardReferType;
use Lkn\NotePlus\App\Note\NoteModel;
use Lkn\NotePlus\Utils;
use WHMCS\User\Client;

final class CardModel extends Model
{
    protected $table = 'mod_lknnoteplus_cards';
    public $timestamps = false;
    protected $fillable = ['refer_id', 'refer_type', 'state', 'list_id'];
    protected $hidden = [
        'laravel_through_key'
    ];

    public function notes(): BelongsToMany
    {
        return $this->belongsToMany(NoteModel::class, 'mod_lknnoteplus_cards_notes', 'card_id', 'note_id');
    }

    public static function boot(): void
    {
        static::deleted(function (Model $card): void {
            Utils::log('Card deleted', $card->getAttributes());

            foreach ($card->notes as $note) {
                $note->delete();
            }
        });

        static::created(function (Model $card): void {
            Utils::log('Card created', $card->getAttributes());
        });

        static::updated(function (Model $card): void {
            Utils::log('Card updated', [
                'original' => $card->getOriginal(),
                'new' => $card->getAttributes()
            ]);
        });
    }

    public function client()
    {
        switch ($this->refer_type) {
            case CardReferType::CLIENT->value:
                return $this->belongsTo(Client::class, 'refer_id', 'id');
            case CardReferType::INVOICE->value:
                return $this->belongsToMany(Client::class, InvoiceModel::class, 'id', 'userid', 'refer_id');

            case CardReferType::DOMAIN->value:
                return $this->belongsToMany(Client::class, DomainModel::class, 'id', 'userid', 'refer_id');

            case CardReferType::TICKET->value:
                return $this->belongsToMany(Client::class, TicketModel::class, 'id', 'userid', 'refer_id');
        }
    }
}
