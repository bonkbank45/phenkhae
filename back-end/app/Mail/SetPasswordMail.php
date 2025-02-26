<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $token,
        public string $name
    ) {
    }

    public function build()
    {
        return $this->view('emails.set-password')
            ->subject('ตั้งค่ารหัสผ่านบัญชีของคุณ');
    }
}