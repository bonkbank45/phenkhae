<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class ClearExpiredData extends Command
{
    protected $signature = 'clear:expired-data';
    protected $description = 'Clear expired tokens and inactive users';

    public function handle()
    {
        // หา email ของ token ที่หมดอายุ
        $expiredEmails = DB::table('password_reset_tokens')
            ->where('created_at', '<', now()->subMinutes(5))
            ->pluck('email');

        if ($expiredEmails->isEmpty()) {
            \Log::info('No expired data found.');
            $this->info('No expired data found.');
            return;
        }

        // ลบ users ที่ยังไม่มีรหัสผ่านและมี token หมดอายุ
        $deletedUsers = User::whereIn('email', $expiredEmails)
            ->whereNull('password')
            ->delete();

        // ลบ tokens ที่หมดอายุ
        $deletedTokens = DB::table('password_reset_tokens')
            ->where('created_at', '<', now()->subMinutes(5))
            ->delete();

        $message = "Cleared {$deletedUsers} inactive users and {$deletedTokens} expired tokens.";
        $this->info($message);
    }
}