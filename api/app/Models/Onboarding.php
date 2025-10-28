<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Onboarding extends Model
{
    use HasFactory;

    protected $table = 'onboardings';

    protected $fillable = [
        'name',
        'doctor',
        'reg_no',
        'gender',
        'dob',
        'qualifications',
        'department',
        'contact',
        'clinic_address',
        'clinics',
        'schedule',
        'fee',
        'declaration',
    ];

    protected $casts = [
        'qualifications' => 'array',
        'schedule' => 'array',
        'clinics' => 'array',
        'dob' => 'date',
        'fee' => 'decimal:2',
        'declaration' => 'boolean',
    ];
}
