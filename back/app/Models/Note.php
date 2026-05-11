<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    // This allows Laravel to save these specific fields
    protected $fillable = ['title', 'content', 'user_id'];

    // This tells Laravel: "A note belongs to one user"
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}