<div>
    <h2>สวัสดี คุณ{{ $name }}</h2>
    <p>กรุณาคลิกที่ลิงค์ด้านล่างเพื่อตั้งรหัสผ่านสำหรับบัญชีของคุณ:</p>
    <a
        href="{{
            config('app.frontend_url', 'http://localhost:5173')
        }}/set-password?token={{ $token }}"
        >ตั้งรหัสผ่าน</a
    >
    <p>ลิงค์นี้จะหมดอายุใน 24 ชั่วโมง</p>
</div>
