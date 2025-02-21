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
            font-size: 27px;
            /* font-weight: 100; */
            color: black;
            text-align: center;
            margin: 0px 0px;
        }

        h2 {
            font-size: 21px;
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
            height: 50px;
            border-collapse: collapse;
        }

        /* กำหนดการตกแต่งสำหรับเนื้อหาภายใน */
        .content {
            /* border: 1px solid red; */
            /* กำหนดขอบดำรอบๆ เนื้อหา */
            padding-top: 12.7mm;
            padding-bottom: 12.7mm;
            padding-left: 12.7mm;
            padding-right: 12.7mm;

            /* ระยะห่างจากขอบ 25.4mm */
        }

        .header {
            /* border: 1px solid blue; */
            width: 100%;

        }

        .header-left {
            /* border: 1px solid blue; */
            width: 20%;
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

        .logo {
            /* border: 1px solid #000; */
            width: 140px;
            height: 140px;
            float: left;
        }
    </style>
</header>

<?php
    $courseMap = [
    1 => ["นวดไทย 150,330 ชั่วโมง", "....-...."],
    2 => ["การนวดฝ่าเท้าเพื่อสุขภาพ 60 ชั่วโมง", "....-...."],
    3 => ["การดูแลสุขภาพสตรีหลังเรือนไฟ 150 ชั่วโมง", "....-...."],
    4 => ["การนวดด้วยน้ำมันหอมระเหย 150 ชั่วโมง", "....-...."],
    5 => ["การนวดด้วยสวีดิช 150 ชั่วโมง", "....-...."],
    6 => ["นวดไทย 150,330 ชั่วโมง", "-"],
    7 => ["วิชาชีพแพทย์แผนไทย", "ผดุงครรภ์ไทย"],
    8 => ["วิชาชีพแพทย์แผนไทย", "นวดไทย"],
    9 => ["วิชาชีพแพทย์แผนไทย", "เภสัชกรรมไทย"],
    10 => ["วิชาชีพแพทย์แผนไทย", "เวชกรรมไทย"],
];

$monthMap = [
    1 => "มกราคม",
    2 => "กุมภาพันธ์",
    3 => "มีนาคม",
    4 => "เมษายน",
    5 => "พฤษภาคม",
    6 => "มิถุนายน",
    7 => "กรกฎาคม",
    8 => "สิงหาคม",
    9 => "กันยายน",
    10 => "ตุลาคม",
    11 => "พฤศจิกายน",
    12 => "ธันวาคม",
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
                <h1 style="padding-right: 120px;">โรงเรียน เพ็ญแขแพทย์แผนไทย</h1>
                <h2 style="padding-right: 50px; padding-top: 10px;">หลักสูตร...........{{ $courseMap[$course_group->course_id][0] }}.........
                    วิชา.................{{ $courseMap[$course_group->course_id][1] }}.....................</h2>
                <h2 style="padding-right: 50px;">
                    วันที่........{{ explode('-', $attendence->attendence_date)[2] }}........เดือน........{{ $monthMap[intval(explode('-', $attendence->attendence_date)[1])] }}........พ.ศ........{{ intval(explode('-', $attendence->attendence_date)[0]) + 543 }}........
                </h2>

            </div>
        </div>

        <?php 
            
        ?>
        <table style="margin-top: 30px;">
            <tr>
                <th>ลำดับ</th>
                <th>ชื่อ-สกุล<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;นักศึกษาที่เข้าเรียน&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </th>
                @if($course_group->course_id == 1 || $course_group->course_id == 6)
                    <th>150<br>ชั่วโมง</th>
                    <th>330<br>ชั่วโมง</th>
                @else
                    <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                @endif
                <th>ลายเซ็น<br> 9.00-16.00</th>
                <th>อุณหภูมิ</th>
                <th>ความดันโลหิต</th>
                <th>ชีพจร</th>
            </tr>
            <?php
// ข้อมูลในรูปแบบอาเรย์
$data = 20;

// วนลูปข้อมูลเพื่อแสดงในตาราง
for ($i = 1; $i <= $data; $i++) {
    echo "<tr>";
    echo "<td class='center-text'>" . $i . "</td>";
    echo "<td>" . "</td>";
    echo "<td>" . "</td>";
    echo "<td>" . "</td>";
    echo "<td>" . "</td>";
    echo "<td>" . "</td>";
    echo "<td>" . "</td>";
    if($course_group->course_id == 1 || $course_group->course_id == 6){
        echo "<td>" . "</td>";
    }
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