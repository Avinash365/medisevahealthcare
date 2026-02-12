<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Onboarding;
use App\Services\TwilioService;

class PaymentController extends Controller
{
    protected $twilioService;

    public function __construct(TwilioService $twilioService)
    {
        $this->twilioService = $twilioService;
    }

    // create an order at Razorpay using server-side secret
    public function createOrder(Request $request)
    {
        $data = $request->validate([
            'amount' => 'required|integer', // in paise
            'currency' => 'nullable|string|in:INR',
            'receipt' => 'nullable|string'
        ]);

        $key = env('RAZORPAY_KEY_ID');
        $secret = env('RAZORPAY_KEY_SECRET');
        if (!$key || !$secret) {
            return response()->json(['success' => false, 'error' => 'Payment gateway not configured'], 500);
        }

        $payload = [
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'INR',
            'receipt' => $data['receipt'] ?? 'rcpt_' . time(),
            'payment_capture' => 1
        ];

        $ch = curl_init('https://api.razorpay.com/v1/orders');
        curl_setopt($ch, CURLOPT_USERPWD, $key . ':' . $secret);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        $res = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);

        if ($res === false) {
            Log::error('Razorpay create order error: ' . $err);
            return response()->json(['success' => false, 'error' => 'Failed to create order'], 500);
        }

        $json = json_decode($res, true);
        if ($code >= 400) {
            Log::error('Razorpay create order response: ' . $res);
            return response()->json(['success' => false, 'error' => $json['error'] ?? 'Order creation failed'], $code);
        }

        return response()->json(['success' => true, 'data' => $json, 'key' => $key], 200);
    }

    // verify Razorpay signature and create appointment record with payment info
    public function verifyAndCreateAppointment(Request $request)
    {
        $data = $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string',
            'appointment' => 'required|array'
        ]);

        $orderId = $data['razorpay_order_id'];
        $paymentId = $data['razorpay_payment_id'];
        $signature = $data['razorpay_signature'];
        $secret = env('RAZORPAY_KEY_SECRET');
        if (!$secret) return response()->json(['success' => false, 'error' => 'Payment gateway not configured'], 500);

        $payload = $orderId . '|' . $paymentId;
        $expected = hash_hmac('sha256', $payload, $secret);
        if (!hash_equals($expected, $signature)) {
            Log::warning('Razorpay signature mismatch', ['order' => $orderId, 'payment' => $paymentId]);
            return response()->json(['success' => false, 'error' => 'Invalid signature'], 400);
        }

        // create appointment with payment fields
        $appt = $data['appointment'];
        // sanitize minimal required fields (rely on AppointmentController validation in other flows)
        try {
            $appt['payment_status'] = 'paid';
            $appt['payment_mode'] = $appt['payment_mode'] ?? 'razorpay';
            $appt['payment_amount'] = isset($appt['payment_amount']) ? $appt['payment_amount'] : null;
            $appt['payment_reference'] = $paymentId;
            $appt['payment_gateway'] = 'razorpay';
            $appt['payment_verified_at'] = now();

            $appointment = Appointment::create($appt);

            // Send WhatsApp notification
            try {
                $docName = 'Doctor';
                if (!empty($appointment->doctor_id)) {
                    $docUser = Onboarding::find($appointment->doctor_id);
                    if ($docUser) {
                        $docName = $docUser->name;
                    }
                }

                $clinicName = 'Mediseva Healthcare';
                $clinicAddr = '';
                if (!empty($appointment->clinic) && is_array($appointment->clinic)) {
                    $clinicName = $appointment->clinic['clinic_name'] ?? ($appointment->clinic['name'] ?? 'Mediseva Clinic');
                    $clinicAddr = $appointment->clinic['clinic_address'] ?? ($appointment->clinic['address'] ?? '');
                }

                $apptDate = $appointment->appointment_date;
                if ($apptDate instanceof \Carbon\Carbon) {
                    $dStr = $apptDate->format('d M Y');
                } else {
                    $dStr = date('d M Y', strtotime($apptDate)); 
                }

                $msg  = "Hello {$appointment->patient_name},\n";
                $msg .= "Your appointment is confirmed (Paid)! ✅\n\n";
                $msg .= "👨‍⚕️ Doctor: Dr. {$docName}\n";
                $msg .= "📅 Date: {$dStr}\n";
                if (!empty($appointment->time_slot)) {
                    $msg .= "⏰ Time: {$appointment->time_slot}\n";
                }
                $msg .= "🏥 Clinic: {$clinicName}\n";
                if ($clinicAddr) {
                    $msg .= "📍 Address: {$clinicAddr}\n";
                } elseif (!empty($appointment->city)) {
                     $msg .= "📍 City: {$appointment->city}\n";
                }
                
                // Fee & Payment Details
                if (!empty($appointment->fee)) {
                    $msg .= "💰 Fee: ₹{$appointment->fee}\n";
                }
                $msg .= "💳 Payment: Paid (via " . ($appointment->payment_mode ?? 'Online') . ")\n";
                if ($appointment->payment_amount) {
                    $msg .= "💵 Amount: ₹{$appointment->payment_amount}\n";
                }
                $msg .= "🧾 Ref: {$paymentId}\n";
                
                $msg .= "\nThank you for choosing Mediseva Healthcare! 🙏";

                if ($appointment->mobile_primary) {
                    $this->twilioService->sendWhatsAppMessage($appointment->mobile_primary, $msg);
                }
            } catch (\Exception $e) {
                Log::error('WhatsApp Auto-Send Error (Payment): ' . $e->getMessage());
            }

            return response()->json(['success' => true, 'data' => $appointment], 201);
        } catch (\Exception $e) {
            Log::error('Create appointment after payment failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Failed to create appointment'], 500);
        }
    }
}
