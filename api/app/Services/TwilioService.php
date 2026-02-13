<?php

namespace App\Services;

use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

class TwilioService
{
    protected $client;
    protected $from;

    public function __construct()
    {
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $this->from = config('services.twilio.whatsapp_from');
        
        $enabled = config('services.twilio.enabled');

        if ($sid && $token && $enabled) {
            $this->client = new Client($sid, $token);
        }
    }

    public function sendWhatsAppMessage($to, $message)
    {
        if (!$this->client) {
            Log::error('Twilio credentials not set.');
            return false;
        }

        try {
            // Check if input already has + prefix
            $hasPlus = str_starts_with(trim($to), '+');
            
            // Remove everything except digits
            $digits = preg_replace('/[^0-9]/', '', $to);

            // Logic to determine E.164 number
            if ($hasPlus) {
                // If it had a +, trust the user provided full code
                $e164 = '+' . $digits;
            } else {
                // No + provided, apply heuristic
                if (strlen($digits) == 10) {
                    // 10 digits -> Assume India (+91)
                    $e164 = '+91' . $digits;
                } elseif (strlen($digits) == 11 && str_starts_with($digits, '0')) {
                    // 11 digits starting with 0 -> Assume local mobile, strip 0, add +91
                     $e164 = '+91' . substr($digits, 1);
                } else {
                     // Fallback: just add +, let Twilio validation fail if invalid
                     $e164 = '+' . $digits;
                }
            }

            // Ensure the number is formatted for WhatsApp (e.g., "whatsapp:+1234567890")
            if (!str_starts_with($e164, 'whatsapp:')) {
                $e164 = 'whatsapp:' . $e164;
            }

            // Ensure the "from" number is also formatted
            $from = $this->from;
            if (!str_starts_with($from, 'whatsapp:')) {
                $from = 'whatsapp:' . $from;
            }

            return $this->client->messages->create($e164, [
                'from' => $from,
                'body' => $message
            ]);
        } catch (\Exception $e) {
            Log::error('Twilio WhatsApp Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
