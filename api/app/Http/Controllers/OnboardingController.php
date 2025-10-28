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
    public function index(Request $request)
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

        // Build query with optional filters (search, month, year)
        $query = Onboarding::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('reg_no', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('doctor', 'like', "%{$search}%")
                  ->orWhere('department', 'like', "%{$search}%")
                  ->orWhere('clinic_address', 'like', "%{$search}%");
            });
        }

        if ($request->filled('month')) {
            $month = (int)$request->input('month');
            if ($month >= 1 && $month <= 12) {
                $query->whereMonth('created_at', $month);
            }
        }

        if ($request->filled('year')) {
            $year = (int)$request->input('year');
            if ($year > 0) {
                $query->whereYear('created_at', $year);
            }
        }

        // Pagination
        $perPage = (int)$request->input('per_page', 10);
        $page = (int)$request->input('page', 1);

        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);

        // Return items and total count to make frontend pagination simple
        return response()->json([
            'data' => $paginator->items(),
            'total' => $paginator->total(),
            'per_page' => $paginator->perPage(),
            'current_page' => $paginator->currentPage(),
        ], 200);
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
            'agent_name' => 'nullable|string|max:255',
            'contact' => 'required|string|max:20',
            'clinic_address' => 'required|string|max:65535',
            'clinics' => 'nullable|array',
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

        // store clinics as JSON if provided (array of clinic objects)
        if (isset($data['clinics']) && is_array($data['clinics'])) {
            $data['clinics'] = json_encode($data['clinics']);
        } else {
            // if clinics not provided but clinic_address exists, ensure clinics field is null or a single entry
            $data['clinics'] = null;
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

    /**
     * Update an onboarding record
     */
    public function update(Request $request, $id)
    {
        try {
            $onboarding = Onboarding::findOrFail($id);

            $data = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'doctor' => 'sometimes|required|string|max:255',
                'reg_no' => 'sometimes|required|string|max:100|unique:onboardings,reg_no,'.$id,
                'gender' => 'sometimes|required|string',
                'dob' => 'sometimes|required|date',
                'qualifications' => 'nullable|array',
                'department' => 'sometimes|required|string|max:255',
                'contact' => 'sometimes|required|string|max:20',
                'clinic_address' => 'sometimes|required|string|max:65535',
                'clinics' => 'nullable|array',
                'schedule' => 'nullable|array',
                'fee' => 'sometimes|required|numeric',
                'declaration' => 'sometimes|required|boolean',
            ]);

            if (isset($data['qualifications']) && is_array($data['qualifications'])) {
                $data['qualifications'] = json_encode($data['qualifications']);
            }

            if (isset($data['schedule']) && is_array($data['schedule'])) {
                $data['schedule'] = json_encode($data['schedule']);
            }

            if (isset($data['clinics']) && is_array($data['clinics'])) {
                $data['clinics'] = json_encode($data['clinics']);
            }

            $onboarding->update($data);

            return response()->json(['success' => true, 'data' => $onboarding], 200);
        } catch (\Exception $e) {
            Log::error('Onboarding Update Error: '.$e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show a single onboarding record
     */
    public function show($id)
    {
        try {
            $onboarding = Onboarding::find($id);
            if (!$onboarding) {
                return response()->json(['success' => false, 'error' => 'Not found'], 404);
            }
            return response()->json(['success' => true, 'data' => $onboarding], 200);
        } catch (\Exception $e) {
            Log::error('Onboarding Show Error: '.$e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Destroy an onboarding record
     */
    public function destroy($id)
    {
        try {
            $onboarding = Onboarding::find($id);
            if (!$onboarding) {
                return response()->json(['success' => false, 'error' => 'Not found'], 404);
            }
            $onboarding->delete();
            return response()->json(['success' => true], 200);
        } catch (\Exception $e) {
            Log::error('Onboarding Delete Error: '.$e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

}