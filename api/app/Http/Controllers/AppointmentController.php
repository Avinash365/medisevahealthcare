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
                'time_slot' => 'nullable|string|max:100',
                'fee' => 'nullable|numeric',
                'agent_name' => 'nullable|string|max:255',
                'payment_type' => 'nullable|string|max:50',
                'payment_amount' => 'nullable|numeric',
                'payment_mode' => 'nullable|string|max:50',
                'payment_status' => 'nullable|string|max:50',
                'doctor_id' => 'nullable|integer',
                'clinic' => 'nullable|array',
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
        $query = Appointment::query();

        // optional filtering by doctor and date for frontend slot blocking
        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->get('doctor_id'));
        }
        if ($request->has('appointment_date')) {
            $query->whereDate('appointment_date', $request->get('appointment_date'));
        }

        // search across patient name, mobile, city
        if ($request->filled('search')) {
            $s = $request->input('search');
            $query->where(function($q) use ($s) {
                $q->where('patient_name', 'like', "%{$s}%")
                  ->orWhere('mobile_primary', 'like', "%{$s}%")
                  ->orWhere('city', 'like', "%{$s}%");
            });
        }

        // server-side payment filter: payment=full|partial|all
        $payment = $request->input('payment', 'all');
        if ($payment === 'full') {
            $query->where(function($q) {
                $q->whereRaw("LOWER(COALESCE(payment_status, '')) IN ('paid','full')")
                  ->orWhereRaw('(COALESCE(payment_amount,0) >= COALESCE(fee,0) AND COALESCE(fee,0) > 0)');
            });
        } elseif ($payment === 'partial') {
            $query->where(function($q) {
                $q->whereRaw("LOWER(COALESCE(payment_status, '')) LIKE '%partial%'")
                  ->orWhereRaw('(COALESCE(payment_amount,0) > 0 AND COALESCE(fee,0) > 0 AND COALESCE(payment_amount,0) < COALESCE(fee,0))');
            });
        } elseif ($payment === 'counter') {
            // paid at counter: payment_mode or payment_gateway may indicate counter/cash, or explicit status
            $query->where(function($q) {
                $q->whereRaw("LOWER(COALESCE(payment_mode, '')) LIKE '%counter%'")
                  ->orWhereRaw("LOWER(COALESCE(payment_gateway, '')) LIKE '%counter%'")
                  ->orWhereRaw("LOWER(COALESCE(payment_mode, '')) LIKE '%cash%'")
                  ->orWhereRaw("LOWER(COALESCE(payment_status, '')) IN ('paid','full')");
            });
        }

        // server-side consult filter: consult=consulted|pending|all
        $consult = $request->input('consult', 'all');
        if ($consult === 'consulted') {
            $query->where(function($q) {
                $q->whereRaw("LOWER(COALESCE(status, '')) IN ('consulted','seen','completed')")
                  ->orWhere('consulted', true);
            });
        } elseif ($consult === 'pending') {
            $query->where(function($q) {
                $q->whereRaw("LOWER(COALESCE(status, '')) NOT IN ('consulted','seen','completed')")
                  ->where(function($qq) {
                      $qq->whereNull('consulted')->orWhere('consulted', false);
                  });
            });
        }

        // pagination params
        $perPage = (int) $request->input('per_page', 25);
        $page = (int) $request->input('page', 1);

        $p = $query->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $p->items(),
            'total' => $p->total(),
            'per_page' => $p->perPage(),
            'current_page' => $p->currentPage(),
        ], 200);
    }

    /**
     * Update appointment fields (used for status/payment updates)
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'status' => 'nullable|string|max:50',
                'payment_status' => 'nullable|string|max:50',
                'payment_amount' => 'nullable|numeric',
                'payment_mode' => 'nullable|string|max:50',
                'consulted' => 'nullable|boolean',
            ]);

            $appt = Appointment::find($id);
            if (!$appt) {
                return response()->json(['success' => false, 'error' => 'Appointment not found'], 404);
            }

            // only allow whitelisted fields to be updated
            $allowed = ['status','payment_status','payment_amount','payment_mode','consulted'];
            foreach ($allowed as $k) {
                if (array_key_exists($k, $data)) {
                    $appt->{$k} = $data[$k];
                }
            }

            // convenience: if status indicates consultation, mark consulted flag
            if (array_key_exists('status', $data) && $data['status']) {
                $s = strtolower($data['status']);
                if (in_array($s, ['consulted','seen','completed','checked'])) {
                    $appt->consulted = true;
                } elseif ($s === 'pending') {
                    $appt->consulted = false;
                }
            }
            $appt->save();

            return response()->json(['success' => true, 'data' => $appt], 200);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['success' => false, 'errors' => $ve->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Appointment update error: '.$e->getMessage());
            return response()->json(['success' => false, 'error' => 'Failed to update appointment'], 500);
        }
    }
}
