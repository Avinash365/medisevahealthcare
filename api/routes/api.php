
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OnboardingController;



// login 
Route::get('/onboarding', [OnboardingController::class, 'index']);
Route::post('/onboarding', [OnboardingController::class, 'store']);


