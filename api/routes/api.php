
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\AppointmentController;



// login 
Route::get('/onboarding', [OnboardingController::class, 'index']);
Route::get('/onboarding/{id}', [OnboardingController::class, 'show']);
Route::post('/onboarding', [OnboardingController::class, 'store']);
Route::put('/onboarding/{id}', [OnboardingController::class, 'update']);
Route::delete('/onboarding/{id}', [OnboardingController::class, 'destroy']);

// Appointments (bookings) endpoint used by frontend
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::get('/appointments', [AppointmentController::class, 'index']);


