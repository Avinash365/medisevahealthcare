<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AppointmentController extends Controller
{
    /**
     * Store a new appointment.
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'patient_name' => 'required|string|max:255',
                'age' => 'nullable|integer',
                'guardian_name' => 'nullable|string|max:255',
                'address' => 'nullable|array',
                'mobile_primary' => 'required|string|max:20',
                'mobile_alternate' => 'nullable|string|max:20',
                'disease' => 'nullable|string|max:255',
                'appointment_date' => 'required|date',
                'doctor_id' => 'nullable|integer',
                'state' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:255',
            ]);

            $appointment = Appointment::create($data);

            return response()->json(['success' => true, 'data' => $appointment], 201);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['success' => false, 'errors' => $ve->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Appointment store error: '.$e->getMessage());
            return response()->json(['success' => false, 'error' => 'Failed to create appointment'], 500);
        }
    }

    /**
     * Simple index for debugging - return recent appointments
     */
    public function index(Request $request)
    {
        $q = Appointment::orderBy('created_at', 'desc')->limit(200)->get();
        return response()->json(['success' => true, 'data' => $q], 200);
    }
}
