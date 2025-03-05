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
            font-family: 'Sarabun_new', sans-serif;
            margin: 0;
            padding: 0;
            position: relative;
            min-height: 100vh;
        }


        h1 {
            font-size: 28px;
            /* font-weight: 100; */
            color: black;
            text-align: center;
            margin: 0px 0px; 
        }

        h2 {
            font-size: 26px;
            /* font-weight: 500; */
            color: black;
            text-align: center;
            margin: 0px 0px;
        }

        p {
            font-size: 22px;
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
            position: absolute;
            bottom: 20mm;
            /* ชิดขอบล่างของกระดาษ A4 */
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 20px;
            color: #555;
        }

        .logo {
            /* border: 1px solid #000; */
            width: 150px;
            height: 150px;
        }

        .section-left {
            /* border: 1px solid red; */
            width: 49.5%;
            float: left;
            /* width: 50%; */
            /* ทำให้ทั้งสองคอลัมน์มีความกว้างใกล้เคียงกัน */
        }

        .section-right {
            /* border: 1px solid green; */
            width: 49.5%;
            float: right;
        }

        .box {
            width: 100%;
            border: 2px solid black;
        }

        .boxL {
            /* border: 2px solid black; */
            width: 30%;
            float: left;
        }

        .boxR {
            /* border: 2px solid black; */
            width: 30%;
            float: right;
        }

        .note {
            color: red;
            font-size: 30px;
        }
    </style>
</header>

<body>

    <?php 
$data = [
    ["course_name" => "การนวดไทยเพื่อสุขภาพ 150 ชม.", "cost" => "9,000"],
    ["course_name" => "การนวดฝ่าเท้าเพื่อสุขภาพ 60 ชม.", "cost" => "4,000"],
    ["course_name" => "การดูแลสตรีหลังเรือนไฟ 150 ชม.", "cost" => "9,500"],
    ["course_name" => "การนวดด้วยน้ำมันหอมระเหย 150 ชม.", "cost" => "9,500"],
    ["course_name" => "การนวดไสวีดิช 150 ชม.", "cost" => "10,000"],
    ["course_name" => "การนวดไทย 330 ชม.(ผู้ช่วยแพทย์แผนไทย)", "cost" => "9,500"],
    ["course_name" => "หลักสูตรผดุงครรภ์ไทย", "cost" => "8,000"],
    ["course_name" => "หลักสูตรนวดไทย 800 ชม.", "cost" => "10,000"],
    ["course_name" => "หลักสูตรเภสัชกรรมไทย", "cost" => "10,000"],
    ["course_name" => "หลักสูตรเวชกรรมไทย", "cost" => "10,000"],
];
?>

    <div class="content">
        <?php if (count($data) < 6) {?>
        <div class="header">
            <div class="section-left" style="text-align: left;">
                <p>เล่มที่ <span class="note"><?php    echo $vol ?></span></p>
            </div>
            <div class="section-right" style="text-align: right;">
                <p>เลขที่ <span class="note"><?php    echo $no ?></span></p>
            </div>
        </div>
        <div class="header">
            <div style="margin-top: -35px;">
                <img src="{{public_path('images/logo_Phenkae.jpg')  }} " class="logo">
            </div>
        </div>

        <h1>โรงเรียนเพ็ญแขแพทย์แผนไทย</h1>
        <h2>17/86 ม.6 ซอย 6/3 ต.คลองสาม อ.คลองหลวง จ.ปทุมธานี<br>โทร. 02-9011144, 081-6185658, 081-3339430</h2>
        <h1><u>ใบรับเงิน</u></h1>

        <div style="width: 100%">
            <div class="section-right" style="text-align: right;">
                <p>วันที่..20..เดือน.....กุมภาพันธ์.....พ.ศ..2568..</p>
            </div>
        </div>
        <p>ได้รับเงินจาก
            ชื่อ........นายไตรภพ................นามสกุล...........ประสงค์ไทย.................
        </p>
        <hr>
        <div style="width: 100%; text-align: center;">
            <div class="boxL">
                <p>รายการ</p>
            </div>
            <div class="boxR">
                <p>จำนวนเงินที่ชำระ</p>
            </div>
        </div>
        <hr>

        <div style="width: 100%; ">
            <?php    foreach ($data as $row) { ?>
            <div style="width: 49.5%; float: left; ">
                <p style="margin-left: 2em;"><?php        echo $row["course_name"] ?></p>
            </div>
            <div style="width: 49.5%; float: right; text-align: right;">
                <p style="margin-right: 3em;"><?php        echo $row["cost"] ?> บาท</p>
            </div>
            <?php    } ?>
        </div>

        <div class="footer" style="margin-top: 55mm;">
            <p>รวมทั้งสิ้น......47,500......บาท</p>
            <hr>
            {{-- <div class="box" style="text-align: left;">
                <p>จำนวนเงินตัวอักษร(บาท)</p>
            </div> --}}

            <div style="width: 100%; margin-top: 5mm;">
                <!-- ส่วนซ้าย -->
                <div class="section-left" style="text-align: center">
                    <p>ผู้รับเงิน_____________________</p>
                </div>

                <!-- ส่วนขวา -->
                <div class="section-right" style="text-align: center">
                    <p>ผู้ชำระเงิน_____________________</p>
                </div>
            </div>
            <br>
            <p>หมายเหตุ.........................................................................................................................................................
            </p>
        </div>
        <?php } else { ?>
        <div class="header">
            <div class="section-left" style="text-align: left;">
                <p>เล่มที่ <span class="note"><?php    echo $vol ?></span></p>
            </div>
            <div class="section-right" style="text-align: right;">
                <p>เลขที่ <span class="note"><?php    echo $no ?></span></p>
            </div>
        </div>
        <div class="header">
            <div style="margin-top: -35px;">
                <img src="{{public_path('images/logo_Phenkae.jpg')  }} " class="logo">
            </div>
        </div>

        <h1>โรงเรียนเพ็ญแขแพทย์แผนไทย</h1>
        <h2>17/86 ม.6 ซอย 6/3 ต.คลองสาม อ.คลองหลวง จ.ปทุมธานี<br>โทร. 02-9011144, 081-6185658, 081-3339430</h2>
        <h1><u>ใบรับเงิน</u></h1>

        <div style="width: 100%">
            <div class="section-right" style="text-align: right;">
                <p>วันที่..20..เดือน.....กุมภาพันธ์.....พ.ศ..2568..</p>
            </div>
        </div>
        <p>ได้รับเงินจาก
            ชื่อ........นายไตรภพ................นามสกุล...........ประสงค์ไทย.................
        </p>
        <hr>
        <div style="width: 100%; text-align: center;">
            <div class="boxL">
                <p>รายการ</p>
            </div>
            <div class="boxR">
                <p>จำนวนเงินที่ชำระ</p>
            </div>
        </div>
        <hr>

        <div style="width: 100%; ">
            <?php    foreach ($data as $row) { ?>
            <div style="width: 49.5%; float: left; ">
                <p style="margin-left: 2em;"><?php        echo $row["course_name"] ?></p>
            </div>
            <div style="width: 49.5%; float: right; text-align: right;">
                <p style="margin-right: 3em;"><?php        echo $row["cost"] ?> บาท</p>
            </div>
            <?php    } ?>
        </div>

        <div class="footer" style="margin-top: 11mm;">
            <p>รวมทั้งสิ้น......47,500......บาท</p>
            <hr>
            {{-- <div class="box" style="text-align: left;">
                <p>จำนวนเงินตัวอักษร(บาท)</p>
            </div> --}}

            <div style="width: 100%; margin-top: 5mm;">
                <!-- ส่วนซ้าย -->
                <div class="section-left" style="text-align: center">
                    <p>ผู้รับเงิน_____________________</p>
                </div>

                <!-- ส่วนขวา -->
                <div class="section-right" style="text-align: center">
                    <p>ผู้ชำระเงิน_____________________</p>
                </div>
            </div>
            <br>
            <p>หมายเหตุ.........................................................................................................................................................
            </p>
        </div>
        <?php } ?>
    </div>
</body>

</html>