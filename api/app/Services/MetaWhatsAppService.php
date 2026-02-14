<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MetaWhatsAppService
{
    protected $phoneNumberId;
    protected $token;

    public function __construct()
    {
        $this->phoneNumberId = config('services.meta.phone_number_id');
        $this->token = config('services.meta.token');
    }

    public function sendWhatsAppMessage($to, $message)
    {
        if (!$this->phoneNumberId || !$this->token) {
            Log::error('Meta WhatsApp credentials not set.');
            throw new \Exception('Meta WhatsApp credentials not set.');
        }

        // Format number: Remove + and special chars
        $to = preg_replace('/[^0-9]/', '', $to);
        
        // Remove leading 0 if present (common in invalid formats)
        if (strlen($to) > 10 && str_starts_with($to, '0')) {
            $to = substr($to, 1);
        }

        // India number fix (simplistic) - Meta often requires country code
        // If length is 10, assume 91. 
        if (strlen($to) === 10) {
            $to = '91' . $to;
        }
        
        $url = "https://graph.facebook.com/v17.0/{$this->phoneNumberId}/messages";
        
        // If message is simple "hello" or "test", send hello_world template
        if (in_array(strtolower(trim($message)), ['hello_world_template_check'])) {
             $payload = [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'template',
                'template' => [
                    'name' => 'hello_world',
                    'language' => [
                        'code' => 'en_US'
                    ]
                ]
            ];
        } else {
            // Standard text message (only works if user initiated conversation in last 24h)
            $payload = [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'text',
                'text' => [
                    'body' => $message
                ]
            ];
        }
        
        $response = Http::withToken($this->token)->post($url, $payload);

        if ($response->successful()) {
            Log::info('Meta WhatsApp Success: ' . $response->body());
            return $response->json();
        } else {
             Log::error('Meta WhatsApp Error: ' . $response->body());
             throw new \Exception('Meta API Error: ' . $response->body());
        }
    }
}
