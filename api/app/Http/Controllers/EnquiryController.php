<?php

namespace App\Http\Controllers;

use App\Models\Enquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EnquiryController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Enquiry::query();
            if ($request->filled('search')) {
                $s = $request->input('search');
                $query->where(function ($q) use ($s) {
                    $q->where('name', 'like', "%{$s}%")
                      ->orWhere('mobile', 'like', "%{$s}%")
                      ->orWhere('city', 'like', "%{$s}%")
                      ->orWhere('message', 'like', "%{$s}%")
                      ->orWhere('remark', 'like', "%{$s}%");
                });
            }

            $perPage = (int)$request->input('per_page', 10);
            $page = (int)$request->input('page', 1);
            $p = $query->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'data' => $p->items(),
                'total' => $p->total(),
                'per_page' => $p->perPage(),
                'current_page' => $p->currentPage(),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Enquiry Index error: '.$e->getMessage());
            return response()->json(['data' => [] , 'total' => 0], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // allow partial submissions; only sanitize types
            $data = $request->validate([
                'name' => 'nullable|string|max:255',
                'mobile' => 'nullable|string|max:50',
                'city' => 'nullable|string|max:255',
                'message' => 'nullable|string',
                'agent_name' => 'nullable|string|max:255',
            ]);

            $enquiry = Enquiry::create($data);

            return response()->json(['success' => true, 'data' => $enquiry], 201);
        } catch (\Exception $e) {
            Log::error('Enquiry Store error: '.$e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $enquiry = Enquiry::findOrFail($id);
            $data = $request->validate([
                'name' => 'nullable|string|max:255',
                'mobile' => 'nullable|string|max:50',
                'city' => 'nullable|string|max:255',
                'message' => 'nullable|string',
                'remark' => 'nullable|string',
                'agent_name' => 'nullable|string|max:255',
            ]);
            $enquiry->update($data);
            return response()->json(['success' => true, 'data' => $enquiry], 200);
        } catch (\Exception $e) {
            Log::error('Enquiry Update error: '.$e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $enquiry = Enquiry::find($id);
            if (!$enquiry) return response()->json(['success' => false, 'error' => 'Not found'], 404);
            return response()->json(['success' => true, 'data' => $enquiry], 200);
        } catch (\Exception $e) {
            Log::error('Enquiry Show error: '.$e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $enquiry = Enquiry::find($id);
            if (!$enquiry) return response()->json(['success' => false, 'error' => 'Not found'], 404);
            $enquiry->delete();
            return response()->json(['success' => true], 200);
        } catch (\Exception $e) {
            Log::error('Enquiry Destroy error: '.$e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
