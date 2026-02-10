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

        if ($sid && $token) {
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
            // Ensure the number is formatted for WhatsApp (e.g., "whatsapp:+1234567890")
            if (!str_starts_with($to, 'whatsapp:')) {
                $to = 'whatsapp:' . $to;
            }

            // Ensure the "from" number is also formatted
            $from = $this->from;
            if (!str_starts_with($from, 'whatsapp:')) {
                $from = 'whatsapp:' . $from;
            }

            return $this->client->messages->create($to, [
                'from' => $from,
                'body' => $message
            ]);
        } catch (\Exception $e) {
            Log::error('Twilio WhatsApp Error: ' . $e->getMessage());
            return false;
        }
    }
}
