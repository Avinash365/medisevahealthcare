<?php

namespace App\Http\Controllers;

use App\Models\Onboarding;
use App\Http\Requests\StoreOnboardingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; 


class OnboardingController extends Controller
{
    /**
     * Return all onboarding records from database
     */
    public function index()
    {
        // If DB is empty but there are existing file-based records, import them once
        if (Onboarding::count() === 0) {
            $file = storage_path('app/onboardings.json');
            if (file_exists($file)) {
                $data = json_decode(file_get_contents($file), true) ?: [];
                foreach ($data as $row) {
                    // map known fields; ignore id/created_at from file
                    $record = [
                        'name' => $row['name'] ?? null,
                        'doctor' => $row['doctor'] ?? null,
                        'reg_no' => $row['reg_no'] ?? null,
                        'gender' => $row['gender'] ?? null,
                        'dob' => $row['dob'] ?? null,
                        'qualifications' => isset($row['qualifications']) ? $row['qualifications'] : null,
                        'department' => $row['department'] ?? null,
                        'contact' => $row['contact'] ?? null,
                        'clinic_address' => $row['clinic_address'] ?? null,
                        'schedule' => isset($row['schedule']) ? $row['schedule'] : null,
                        'fee' => $row['fee'] ?? null,
                        'declaration' => isset($row['declaration']) ? (bool)$row['declaration'] : false,
                    ];
                    // qualifications/schedule may already be arrays or strings
                    if (is_array($record['qualifications'])) {
                        $record['qualifications'] = json_encode($record['qualifications']);
                    }
                    if (is_array($record['schedule'])) {
                        $record['schedule'] = json_encode($record['schedule']);
                    }
                    // skip empty rows without name
                    if (empty($record['name'])) {
                        continue;
                    }
                    Onboarding::create($record);
                }
            }
        }

        $items = Onboarding::orderBy('created_at', 'desc')->get();
        return response()->json($items, 200);
             
    }

    /**
     * Store onboarding payload into DB using validation
     */
    public function store(Request $request)
    {
        try {
            //  Validate input
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'doctor' => 'required|string|max:255',
                'reg_no' => 'required|string|max:100|unique:onboardings,reg_no',
                'gender' => 'required|string',
                'dob' => 'required|date',
                'qualifications' => 'nullable|array',
                'department' => 'required|string|max:255',
                'contact' => 'required|string|max:20',
                'clinic_address' => 'required|string|max:255',
                'schedule' => 'nullable|array',
                'fee' => 'required|numeric',
                'declaration' => 'required|boolean',
            ]);

            //  Convert arrays to JSON strings for DB storage
            if (isset($data['qualifications']) && is_array($data['qualifications'])) {
                $data['qualifications'] = json_encode($data['qualifications']);
            }

            if (isset($data['schedule']) && is_array($data['schedule'])) {
                $data['schedule'] = json_encode($data['schedule']);
            }

            //  Create record
            $onboarding = Onboarding::create($data);

            //  Return JSON response
            return response()->json([
                'success' => true,
                'data' => $onboarding,
            ], 201);

        } catch (\Exception $e) {
            //  Log error for debugging
            Log::error('Onboarding Store Error: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}