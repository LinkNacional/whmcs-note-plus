<?php

namespace Lkn\NotePlus\App\Note;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Lkn\NotePlus\App\Card\Models\CardModel;
use Lkn\NotePlus\App\Card\Models\CardNoteModel;
use Lkn\NotePlus\App\Shared\AdminModel;
use Lkn\NotePlus\Utils;

final class NoteModel extends Model
{
    protected $table = 'tblnotes';
    protected $dateFormat = 'Y-m-d H:i:s.u';
    public const CREATED_AT = 'created';
    public const UPDATED_AT = 'modified';
    protected $fillable = [
        'userid',
        'adminid',
        'note',
        'sticky'
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(AdminModel::class, 'adminid');
    }

    public function card()
    {
        return $this->hasManyThrough(CardModel::class, CardNoteModel::class, 'note_id', 'id');
    }

    public static function boot(): void
    {
        static::deleted(function (Model $note): void {
            Utils::log('Note deleted', $note->getAttributes());
        });

        static::created(function (Model $note): void {
            Utils::log('Note created', $note->getAttributes());
        });

        static::updated(function (Model $note): void {
            Utils::log('Note updated', [
                'original' => $note->getOriginal(),
                'new' => $note->getAttributes()
            ]);
        });
    }
}
