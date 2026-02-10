<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TwilioService;

class WhatsAppController extends Controller
{
    protected $twilioService;

    public function __construct(TwilioService $twilioService)
    {
        $this->twilioService = $twilioService;
    }

    public function send(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'message' => 'required|string',
        ]);

        $result = $this->twilioService->sendWhatsAppMessage($request->phone, $request->message);

        if ($result) {
            return response()->json(['success' => true, 'message' => 'WhatsApp message sent successfully.', 'sid' => $result->sid]);
        }

        return response()->json(['success' => false, 'message' => 'Failed to send WhatsApp message.'], 500);
    }
}
