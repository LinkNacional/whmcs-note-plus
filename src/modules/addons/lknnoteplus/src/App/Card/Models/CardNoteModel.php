<?php

namespace Lkn\NotePlus\App\Card\Models;

use Illuminate\Database\Eloquent\Model;
use Lkn\NotePlus\App\Note\NoteModel;

final class CardNoteModel extends Model
{
    protected $table = 'mod_lknnoteplus_cards_notes';
    public $timestamps = false;
    protected $fillable = ['card_id', 'note_id'];

    public function card()
    {
        return $this->belongsTo(CardModel::class, 'card_id');
    }

    public function note()
    {
        return $this->belongsTo(NoteModel::class, 'note_id');
    }
}
