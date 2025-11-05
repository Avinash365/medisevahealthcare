<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\EnquiryController;



// login 
Route::get('/onboarding', [OnboardingController::class, 'index']);
Route::get('/onboarding/{id}', [OnboardingController::class, 'show']);
Route::post('/onboarding', [OnboardingController::class, 'store']);
Route::put('/onboarding/{id}', [OnboardingController::class, 'update']);
Route::delete('/onboarding/{id}', [OnboardingController::class, 'destroy']);

// Appointments (bookings) endpoint used by frontend
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::get('/appointments', [AppointmentController::class, 'index']);
// allow updating appointment fields such as status/payment_status/consulted
Route::patch('/appointments/{id}', [AppointmentController::class, 'update']);
Route::put('/appointments/{id}', [AppointmentController::class, 'update']);

// Enquiries
Route::get('/enquiries', [EnquiryController::class, 'index']);
Route::get('/enquiries/{id}', [EnquiryController::class, 'show']);
Route::post('/enquiries', [EnquiryController::class, 'store']);
Route::patch('/enquiries/{id}', [EnquiryController::class, 'update']);
Route::put('/enquiries/{id}', [EnquiryController::class, 'update']);
Route::delete('/enquiries/{id}', [EnquiryController::class, 'destroy']);

// Payments
use App\Http\Controllers\PaymentController;
Route::post('/payments/create-order', [PaymentController::class, 'createOrder']);
Route::post('/payments/verify-and-create', [PaymentController::class, 'verifyAndCreateAppointment']);

use App\Http\Controllers\AuthController;
// Authentication
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware(\App\Http\Middleware\ApiTokenAuth::class);


