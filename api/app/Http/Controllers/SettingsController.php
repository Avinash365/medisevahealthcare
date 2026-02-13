<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function getSmsSettings()
    {
        return response()->json([
            'twilio' => [
                'sid' => env('TWILIO_SID'),
                'auth_token' => env('TWILIO_AUTH_TOKEN'),
                'sender_id' => env('TWILIO_FROM'),
                'enabled' => env('TWILIO_ENABLED') === 'true' || env('TWILIO_ENABLED') === true,
            ],
            'meta' => [
                'phone_number_id' => env('META_WHATSAPP_PHONE_ID'),
                'access_token' => env('META_WHATSAPP_TOKEN'),
                'business_account_id' => env('META_WHATSAPP_BUSINESS_ID'),
                'enabled' => env('META_WHATSAPP_ENABLED') === 'true' || env('META_WHATSAPP_ENABLED') === true,
            ],
        ]);
    }

    public function updateSmsSettings(Request $request)
    {
        $input = $request->validate([
            'twilio.sid' => 'nullable|string',
            'twilio.auth_token' => 'nullable|string',
            'twilio.sender_id' => 'nullable|string',
            'twilio.enabled' => 'nullable|boolean',
            'meta.phone_number_id' => 'nullable|string',
            'meta.access_token' => 'nullable|string',
            'meta.business_account_id' => 'nullable|string',
            'meta.enabled' => 'nullable|boolean',
        ]);

        if (isset($input['twilio'])) {
            $envUpdates = [];
            
            if (array_key_exists('sid', $input['twilio'])) {
                $envUpdates['TWILIO_SID'] = $input['twilio']['sid'] ?? '';
            }
            if (array_key_exists('auth_token', $input['twilio'])) {
                $envUpdates['TWILIO_AUTH_TOKEN'] = $input['twilio']['auth_token'] ?? '';
            }
            if (array_key_exists('sender_id', $input['twilio'])) {
                $envUpdates['TWILIO_FROM'] = $input['twilio']['sender_id'] ?? '';
                $envUpdates['TWILIO_WHATSAPP_FROM'] = $input['twilio']['sender_id'] ?? '';
            }
            if (array_key_exists('enabled', $input['twilio'])) {
                 $envUpdates['TWILIO_ENABLED'] = $input['twilio']['enabled'] ? 'true' : 'false';
            }

            if (!empty($envUpdates)) {
                $this->updateEnv($envUpdates);
            }
        }

        if (isset($input['meta'])) {
          $envUpdates = [];
          
          if (array_key_exists('phone_number_id', $input['meta'])) {
              $envUpdates['META_WHATSAPP_PHONE_ID'] = $input['meta']['phone_number_id'] ?? '';
          }
          if (array_key_exists('access_token', $input['meta'])) {
              $envUpdates['META_WHATSAPP_TOKEN'] = $input['meta']['access_token'] ?? '';
          }
          if (array_key_exists('business_account_id', $input['meta'])) {
              $envUpdates['META_WHATSAPP_BUSINESS_ID'] = $input['meta']['business_account_id'] ?? '';
          }
          if (array_key_exists('enabled', $input['meta'])) {
               $envUpdates['META_WHATSAPP_ENABLED'] = $input['meta']['enabled'] ? 'true' : 'false';
          }

          if (!empty($envUpdates)) {
              $this->updateEnv($envUpdates);
          }
      }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    private function updateEnv($data = [])
    {
        $path = base_path('.env');

        if (file_exists($path)) {
            $currentEnv = file_get_contents($path);
            
            foreach ($data as $key => $value) {
                // If key exists, replace it
                if (preg_match("/^{$key}=/m", $currentEnv)) {
                    $currentEnv = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $currentEnv);
                } else {
                    // Otherwise append it
                    $currentEnv .= "\n{$key}={$value}";
                }
            }

            file_put_contents($path, $currentEnv);
        }
    }
}
