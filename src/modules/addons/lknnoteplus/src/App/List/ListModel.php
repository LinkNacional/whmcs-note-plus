<?php

namespace Lkn\NotePlus\App\List;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Lkn\NotePlus\App\Card\Models\CardModel;
use Lkn\NotePlus\Utils;

final class ListModel extends Model
{
    protected $table = 'mod_lknnoteplus_lists';
    public $timestamps = false;
    protected $fillable = ['name'];

    public function cards(): HasMany
    {
        return $this->hasMany(CardModel::class, 'list_id');
    }

    public static function boot(): void
    {
        static::deleted(function (Model $list): void {
            Utils::log('List deleted', $list->getAttributes());
        });

        static::created(function (Model $list): void {
            Utils::log('List created', $list->getAttributes());
        });

        static::updated(function (Model $list): void {
            Utils::log('List updated', [
                'original' => $list->getOriginal(),
                'new' => $list->getAttributes()
            ]);
        });
    }
}
