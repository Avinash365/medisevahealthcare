<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'appointments';

    protected $fillable = [
        'patient_name',
        'age',
        'guardian_name',
        'address',
        'mobile_primary',
        'mobile_alternate',
        'disease',
        'appointment_date',
        'doctor_id',
        'state',
        'city',
    ];

    protected $casts = [
        'address' => 'array',
        'appointment_date' => 'date',
    ];
}
