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
        'clinic',
        'state',
        'city',
        'time_slot',
        'fee',
        'payment_type',
        'payment_amount',
        'payment_mode',
        'payment_status',
        'payment_reference',
        'payment_gateway',
        'payment_verified_at',
        'agent_name',
    ];

    protected $casts = [
        'address' => 'array',
        'clinic' => 'array',
        'appointment_date' => 'date',
        'fee' => 'decimal:2',
        'payment_amount' => 'decimal:2',
        'payment_verified_at' => 'datetime',
    ];
}
