<?php

namespace App\Http\Controllers;

use App\Models\Onboarding;
use App\Http\Requests\StoreOnboardingRequest;
use Illuminate\Http\Request;

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
        return response()->json($items, 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
    }

    /**
     * Store onboarding payload into DB using validation
     */
    public function store(StoreOnboardingRequest $request)
    {
        $data = $request->validated();

        // Normalize JSON / array fields if present
        if (isset($data['qualifications']) && is_array($data['qualifications'])) {
            $data['qualifications'] = json_encode($data['qualifications']);
        }
        if (isset($data['schedule']) && is_array($data['schedule'])) {
            $data['schedule'] = json_encode($data['schedule']);
        }

        $onboarding = Onboarding::create($data);

        return response()->json(['success' => true, 'data' => $onboarding], 201)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
    }
}
