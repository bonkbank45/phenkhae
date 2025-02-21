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
        }


        h1 {
            font-size: 35px;
            /* font-weight: 100; */
            color: black;
            text-align: center;
            margin: 0px 0px; 
        }

        h2 {
            font-size: 20px;
            /* border: 1px solid red; */
            /* font-weight: 500; */
            color: black;
            text-align: center;
            margin: 0px 0px;
        }

        strong {
            color: black;
            font-size: 22px;
        }

        p {
            font-size: 20px;
            line-height: 1.5;
            margin: 0px;

        }

        table,
        th,
        td {
            border: 1px solid;
            font-size: 20px;
        }

        table {
            /* table-layout: fixed; */
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

        .header-left {
            /* border: 1px solid blue; */
            width: 16%;
            overflow: hidden;
            float: left;
            text-align: center;
        }

        .header-right {
            /* border: 1px solid green; */
            width: auto;
            overflow: hidden;
            float: right;
            text-align: center;
        }

        .checkbox {
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
        }

        /* ตัวอย่างของ Footer */
        .footer {
            width: 100%;
            text-align: center;
            font-size: 18px;
            color: black;
        }

        .form-section {
            /* display: flex; */
            width: 100%;
            align-items: flex-start;
        }

        .form-section-left_right {
            width: 100%;
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

        .red {
            color: red;
        }

        .center-text {
            text-align: center;
            vertical-align: middle;
        }
    </style>
</header>

<?php
    $courseMap = [
    1 => ["นวดไทยเพื่อสุขภาพ 150 ชั่วโมง", "....-...."],
    2 => ["การนวดฝ่าเท้าเพื่อสุขภาพ 60 ชั่วโมง", "....-...."],
    3 => ["การดูแลสุขภาพสตรีหลังเรือนไฟ 150 ชั่วโมง", "....-...."],
    4 => ["การนวดด้วยน้ำมันหอมระเหย 150 ชั่วโมง", "....-...."],
    5 => ["การนวดด้วยสวีดิช 150 ชั่วโมง", "....-...."],
    6 => ["ผู้ช่วยแพทย์แผนไทย", "-"],
    7 => ["วิชาชีพแพทย์แผนไทย", "ผดุงครรภ์ไทย"],
    8 => ["วิชาชีพแพทย์แผนไทย", "นวดไทย"],
    9 => ["วิชาชีพแพทย์แผนไทย", "เภสัชกรรมไทย"],
    10 => ["วิชาชีพแพทย์แผนไทย", "เวชกรรมไทย"],
];
?>

<body>
    <div class="content">
        <div class="header">
            <div class="header-left">
                <img src="{{ public_path('images/logo_Phenkae.jpg') }}" alt="โลโก้โรงเรียน" class="logo">
            </div>
            <div class="header-right">
                <div style="height: 30px;"></div>
                <h2 style="padding-right: 70px;">ใบเซ็นชื่อเข้าเรียน <span class="red">สำหรับนักเรียนรุ่น {{ $course_group->batch }}</span>
                    <h2 style="margin-top: 5px;">โรงเรียนเพ็ญแขแพทย์แผนไทย
                    </h2>
                </h2>
                <h2 style="margin-top: 5px;">หลักสูตร..{{ $courseMap[$course_group->course_id][0] }}..วิชา.....<span
                        class={{ $courseMap[$course_group->course_id][1] !== '....-....' ? 'red' : '' }}>{{ $courseMap[$course_group->course_id][1] }}</span>....
                    วันที่.......{{ Carbon\Carbon::createFromFormat('d/m/Y', $attendence_date)->addYears(543)->format('d/m/Y') }}........</h2>

            </div>
        </div>
        <table style="margin-top: 30px;">
            <tr>
                <th>ที่</th>
                <th>ชื่อ-สกุล</th>
                <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                <th>ลายมือชื่อ<br> 9.00-12.00</th>
                <th>เวลาเรียน<br> 13.00-16.00</th>
                <th>อุณหภูมิ</th>
            </tr>
            <?php
// ข้อมูลในรูปแบบอาเรย์
$data = [
    ["id" => 1, "fname" => "น.ส.ราชารวี ปานทอง"],
    ["id" => 2, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา"],
    ["id" => 3, "fname" => "จิตร ดีใจ"],
    ["id" => 4, "fname" => "นส.พิทยา เชิดชูบัณฑิต"],
    ["id" => 5, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา"],
    ["id" => 6, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา"],
    ["id" => 7, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา"],
    ["id" => 8, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา"],

];

// วนลูปข้อมูลเพื่อแสดงในตาราง
foreach ($enrollments as $index => $enrollment) {
    echo "<tr>";
    echo "<td class='center-text'>" . $index + 1 . "</td>";
    echo "<td>" . "&nbsp;" . (isset($enrollment->student->prename->prename_short_tha) ?
         $enrollment->student->prename->prename_short_tha : $enrollment->student->prename->prename_tha) . " " . $enrollment->student->firstname_tha . " " . $enrollment->student->lastname_tha . "</td>";
    echo "<td>" . "</td>";
    echo "<td>" . "</td>";
    echo "<td>" . "</td>";
    echo "<td>" . "</td>";
    echo "</tr>";
}
            ?>
        </table>

        <div class="form-section-left_right" style="margin-top: 40px">
            <!-- ส่วนซ้าย -->
            <div class="section-left" style="text-align: center">
                <p>1. ลายมือชื่อ .................................................... (อาจารย์ผู้สอน)</p>
                <p>(....................................................................)</p>
            </div>

            <!-- ส่วนขวา -->
            <div class="section-right" style="text-align: center">
                <p>2. ลายมือชื่อ .................................................... (อาจารย์ผู้สอน)</p>
                <p>(....................................................................)</p>
            </div>
        </div>

        <div class="footer" style="margin-top: 10px">
            <p>สรุปจำนวน ผู้เข้าเรียน.....................คน</p>
        </div>
    </div>
</body>

</html>