<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TwilioService;
use App\Services\MetaWhatsAppService;

class WhatsAppController extends Controller
{
    protected $twilioService;
    protected $metaService;

    public function __construct(TwilioService $twilioService, MetaWhatsAppService $metaService)
    {
        $this->twilioService = $twilioService;
        $this->metaService = $metaService;
    }

    public function send(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'message' => 'required|string',
        ]);

        try {
            // Check enabled services
            $metaEnabled = config('services.meta.enabled');
            $twilioEnabled = config('services.twilio.enabled'); // Or use env check if config not reliable immediately after update

            // Prioritize Meta if both are enabled, or if only Meta is enabled
            if ($metaEnabled) {
                $result = $this->metaService->sendWhatsAppMessage($request->phone, $request->message);
                 return response()->json([
                    'success' => true, 
                    'message' => 'Message sent via Meta! (Note: For trial accounts, ensure recipient is in "Test Numbers" list on Meta Dashboard).', 
                    'data' => $result
                ]);
            } elseif ($twilioEnabled) {
                $result = $this->twilioService->sendWhatsAppMessage($request->phone, $request->message);
                return response()->json([
                    'success' => true, 
                    'message' => 'Message sent via Twilio! (Note: For sandbox, recipient must have joined by sending the code to sandbox number).', 
                    'sid' => $result->sid
                ]);
            } else {
                 throw new \Exception('No WhatsApp provider is enabled in Settings.');
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => 'Failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
