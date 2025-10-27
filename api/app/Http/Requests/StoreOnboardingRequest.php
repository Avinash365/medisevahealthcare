<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOnboardingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * For now allow all — secure later as needed.
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'doctor' => 'nullable|string|max:255',
            'reg_no' => 'required|string|max:100',
            'gender' => 'nullable|in:male,female,other',
            'dob' => 'nullable|date',
            'qualifications' => 'nullable|array',
            'qualifications.*' => 'string|max:255',
            'department' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:50',
            'clinic_address' => 'nullable|string',
            'schedule' => 'nullable|array',
            'fee' => 'nullable|numeric',
            'declaration' => 'nullable|boolean',
        ];
    }

    public function prepareForValidation()
    {
        // Convert declaration truthy values to boolean
        if ($this->has('declaration')) {
            $val = $this->input('declaration');
            $this->merge(['declaration' => filter_var($val, FILTER_VALIDATE_BOOLEAN)]);
        }
    }
}