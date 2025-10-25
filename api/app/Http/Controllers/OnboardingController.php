<?php

namespace App\Http\Controllers;

use App\Models\Onboarding;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    public function index()
    {
        // If DB is empty but there are existing file-based records, import them once
        if (Onboarding::count() === 0) {
            $file = storage_path('app/onboardings.json');
            if (file_exists($file)) {
                $data = json_decode(file_get_contents($file), true) ?: [];
                foreach ($data as $row) {
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

                    if (is_array($record['qualifications'])) {
                        $record['qualifications'] = json_encode($record['qualifications']);
                    }
                    if (is_array($record['schedule'])) {
                        $record['schedule'] = json_encode($record['schedule']);
                    }

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


    public function store(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Onboarding data received successfully!'
        ], 200);
    }
}
