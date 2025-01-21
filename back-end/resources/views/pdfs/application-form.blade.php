<html>
    <header>
        <title>pdf</title>
        <meta http-equiv="Content-Language" content="th" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style>
            @page {
                margin: 0mm;
                /* กำหนดขอบทั้งหมด 0mm */
            }

            body {
                font-family: "Sarabun_new", sans-serif;
                margin: 0;
                padding: 0;
            }

            h1 {
                font-size: 35px;
                /* font-weight: 100; */
                color: black;
                text-align: center;
                margin: 0px 0px; /* บนล่าง 1px ซ้ายขวา 1px */
            }

            h2 {
                font-size: 24px;
                /* font-weight: 500; */
                color: black;
                text-align: center;
                margin: 0px 0px; /* บนล่าง 1px ซ้ายขวา 1px */
            }

            strong {
                color: black;
                font-size: 22px;
            }

            p {
                font-size: 18px;
                line-height: 1.5;
                margin: 0px;
            }

            table,
            th,
            td {
                /* border: 1px solid; */
                font-size: 20px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            /* กำหนดการตกแต่งสำหรับเนื้อหาภายใน */
            .content {
                /* border: 1px solid red; */
                /* กำหนดขอบดำรอบๆ เนื้อหา */
                padding-top: 12.7mm;
                padding-bottom: 12.7mm;
                padding-left: 25.4mm;
                padding-right: 25.4mm;

                /* ระยะห่างจากขอบ 25.4mm */
            }

            .header {
                /* border: 1px solid blue; */
                width: 100%;
                overflow: hidden;
                text-align: center;
            }

            .checkbox {
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
            }

            /* ตัวอย่างของ Footer */
            .footer {
                position: fixed;
                bottom: 20mm;
                /* ระยะห่างจากขอบล่าง */
                left: 0;
                width: 100%;
                text-align: center;
                font-size: 10px;
                color: #555;
            }

            .logo {
                border: 1px solid #000;
                width: 100px;
                height: 100px;
                float: left;
            }

            .photo {
                border: 1px solid #000;
                width: 100px;
                /* ขนาดความกว้างของรูปภาพเป็น 1 นิ้ว */
                height: 120px;
                /* ขนาดความสูงของรูปภาพเป็น 1 นิ้ว */
                text-align: center;
                float: right;
                margin-top: 1px;
            }

            .form-section {
                /* display: flex; */
                width: 100%;
                align-items: flex-start;
            }

            .form-section-left_right {
                width: 100%;
                /* display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin: 0;
            padding: 0; */
            }

            .section-left {
                width: 50%;
                float: left;
                /* width: 50%; */
                /* ทำให้ทั้งสองคอลัมน์มีความกว้างใกล้เคียงกัน */
            }

            .section-right {
                width: 50%;
                float: right;
            }

            .section-left-note {
                width: 12%;
                float: left;
            }

            .section-right-note {
                width: 88%;
                float: right;
            }

            .note {
                color: red;
                font-size: 17px;
            }

            .signature {
                text-align: right;
                /* margin-top: 50px; */
            }

            .large-dot {
                font-size: 30px; /* ขยายขนาดจุด */
                color: #000; /* เปลี่ยนสีจุด */
            }

            .dotted-line {
                position: relative;
                display: inline-block;
            }

            .text-above {
                position: absolute;
                top: -5px; /* ปรับระยะห่างจากเส้นประ */
                left: 0;
                width: 100%;
                text-align: center;
            }
        </style>
    </header>

    <body>
        <div class="content">
            <div class="header">
                <div class="photo">
                    <p style="margin-top: 40px">รูปถ่าย</p>
                </div>
                <div style="height: 15px"></div>
                <!-- เว้นว่างขนาด 15px -->
                <img
                    src="{{ public_path('images/logo_Phenkae.jpg') }}"
                    alt="โลโก้โรงเรียน"
                    class="logo"
                /><br />
                <h1>
                    ใบสมัครเรียน
                    <h2>โรงเรียนเพ็ญแขแพทย์แผนไทย</h2>
                </h1>
            </div>

            <p style="margin-top: 15px">
                ชื่อ นาย/นาง/นางสาว
                .........................................................................
                นามสกุล
                ...............................................................................<br />
                ชื่อภาษาอังกฤษ
                Mr./Mrs./Miss..........................................................................................................................................................<br />
                เลขประจำตัวประชาชน เลขที่
                ............................................................
                วัน/เดือน/ปีเกิด......................................................................<br />
                อายุ .................... สถานที่เกิด
                ........................................................
                บิดา-มารดา
                ชื่อ..........................................................................<br />

                สถานภาพ
                <span
                    class="checkbox"
                    style="display: inline-flex; align-items: center"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&#9744; สมรส</span
                >
                <span
                    class="checkbox"
                    style="display: inline-flex; align-items: center"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&#9744; โสด</span
                >
                <span
                    class="checkbox"
                    style="display: inline-flex; align-items: center"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&#9744; หม้าย</span
                >
                <span
                    class="checkbox"
                    style="display: inline-flex; align-items: center"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&#9744; หย่าร้าง</span
                ><br />

                ที่อยู่ปัจจุบัน: เลขที่ .............. หมู่ที่ .................
                ตรอก/ซอย ....................................................
                ถนน ................................................<br />
                แขวง/ตำบล ................................... เขต/อำเภอ
                .................................. จังหวัด
                ..................................... รหัสไปรษณีย์
                ..................<br />
                เบอร์โทรศัพท์ ......................................... อีเมล์
                ....................................................
                อาชีพปัจจุบัน
                ....................................................<br />
                วุฒิการศึกษาสูงสุด
                ........................................................
                จากสถานศึกษา..........................................................................................<br />

                <span style="color: darkblue"
                    >โรคประจำตัว
                    ....................................................................
                    ประวัติผ่าตัด
                    ...........................................................................................</span
                >
            </p>

            <div class="form-section">
                <strong>ประสบการณ์ในการนวด</strong><br />
                <div style="margin-left: 25px">
                    <p>
                        <span class="checkbox">□ ไม่เคยนวด/เรียน</span>
                        <span class="checkbox"
                            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□ เคยนวด/เรียน
                            &nbsp;&nbsp;ระบุ
                            .................................................................................................................</span
                        ><br />
                        <span class="checkbox"
                            >□ เคยทำงานเกี่ยวกับการนวดไทย ระบุสถานที่
                            ........................................................................................................................</span
                        >
                    </p>
                </div>
                <strong style="margin-bottom: -10px"
                    >ต้องการอบรมหลักสูตร</strong
                >
                <div class="form-section-left_right" style="margin-top: -10px">
                    <!-- ส่วนซ้าย -->
                    <div class="section-left">
                        <p>
                            <strong
                                ><span class="large-dot">&#8226;</span>
                                หลักสูตรที่ได้รับรอง จาก สบส.</strong
                            ><br />
                            <span class="checkbox"
                                >□ 1. นวดไทยเพื่อสุขภาพ ๑๕๐ ชั่วโมง</span
                            ><br />
                            <span class="checkbox"
                                >□ 2. การนวดฝ่าเท้าเพื่อสุขภาพ ๖๐ ชม.</span
                            ><br />
                            <span class="checkbox"
                                >□ 3. การดูแลสุขภาพสตรีหลังเรือนไฟ ๑๕๐ ชม.</span
                            ><br />
                            <span class="checkbox"
                                >□ 4. การนวดด้วยน้ำมันหอมระเหย ๑๕๐ ชั่วโมง</span
                            ><br />
                            <span class="checkbox"
                                >□ 5. การนวดสวีดิช ๑๕๐ ชั่วโมง</span
                            >
                        </p>
                    </div>

                    <!-- ส่วนขวา -->
                    <div class="section-right">
                        <p>
                            <strong
                                ><span class="large-dot">&#8226;</span>
                                หลักสูตรที่ได้รับรอง จาก สภาแพทย์แผนไทย</strong
                            ><br />
                            <span class="checkbox"
                                >□ 6. ผู้ช่วยแพทย์แผนไทย (นวดไทย ๓๓๐ ชม.)</span
                            ><br />
                            <span class="checkbox">□ 7. ผดุงครรภ์ไทย</span
                            ><br />
                            <span class="checkbox"
                                >□ 8. วิชาชีพการนวดไทย (800 ชม.)</span
                            ><br />
                            <span class="checkbox">□ 9. เภสัชกรรมไทย</span
                            ><br />
                            <span class="checkbox">□ 10.เวชกรรมไทย</span><br />
                        </p>
                    </div>
                </div>
            </div>

            <div class="form-section-left_right">
                <!-- ส่วนซ้าย -->
                <div class="section-left-note">
                    <p><u>หมายเหตุ :</u></p>
                </div>
                <!-- ส่วนขวา -->
                <div class="section-right-note">
                    <div class="note">
                        <b
                            >- กรณีนักเรียน ขาดเรียน เกิน 6 เดือน
                            ถือว่าสิ้นสุดสถานภาพการเป็นนักเรียนของโรงเรียน<br />
                            - ค่าเรียนไม่สามารถเรียกคืนได้ทุกกรณี<br />
                            -
                            ข้าพเจ้ายินยอมให้โรงเรียนถ่ายภาพร่วมกิจกรรมการเรียน
                            เพื่อใช้ลงสื่อของโรงเรียนและใช้ยืนยันการเข้าเรียนได้<br />
                            -
                            ข้าพเจ้ายินดีปฏิบัติตามกฎระเบียบของโรงเรียนโดยเคร่งครัด</b
                        >
                    </div>
                </div>
            </div>

            <div class="signature">
                <br />
                <p>
                    ลงชื่อ
                    .....................................................................
                    (ผู้สมัคร)
                </p>
                <p style="padding-right: 45px">
                    (...............................................................)
                </p>
            </div>
            <div class="form-section-left_right">
                <!-- ส่วนซ้าย -->
                <div class="section-left">
                    <p>
                        <u style="color: darkblue">เอกสารประกอบการสมัครเรียน</u>
                    </p>
                </div>

                <!-- ส่วนขวา -->
                <div class="section-right">
                    <p>
                        วันที่สมัคร
                        ................................................................................
                    </p>
                </div>
            </div>
            <table>
                <tr>
                    <td>1.สำเนาบัตรประจำตัวประชาชน</td>
                    <td>2.สำเนาทะเบียนบ้าน</td>
                    <td>3.สำเนาวุฒิการศึกษา(ขั้นต่ำม.3)</td>
                </tr>
                <tr>
                    <td>4.รูปถ่ายขนาด1.5 นิ้ว จำนวน 3 รูป</td>
                    <td>5.ใบรับรองแพทย์</td>
                    <td>6.เอกสารอื่นถ้ามี เช่น ใบเปลี่ยนชื่อ</td>
                </tr>
            </table>
        </div>
    </body>
</html>
