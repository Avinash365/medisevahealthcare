
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\OnboardingController;

// CORS preflight handler for API routes: respond to OPTIONS requests
Route::options('{any}', function (Request $request) {
	return response('', 200)
		->header('Access-Control-Allow-Origin', '*')
		->header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
		->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
})->where('any', '.*');

Route::get('/onboarding', [OnboardingController::class, 'index']);
Route::post('/onboarding', [OnboardingController::class, 'store']);


