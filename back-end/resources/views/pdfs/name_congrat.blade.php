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
            font-size: 25px;
            /* border: 1px solid red; */
            /* font-weight: 500; */
            color: black;
            margin: 0px 0px;
        }

        p {
            font-size: 25px;
            line-height: 1.2;
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
            margin: 0px;
            padding: 0px;
        }

        .header {
            /* border: 1px solid blue; */
            width: 100%;

        }

        .header-left {
            border: 1px solid white;
            width: 40%;
            overflow: hidden;
            float: left;
            /* text-align: center; */
        }

        .header-right {
            /* border: 1px solid green; */
            width: auto;
            overflow: hidden;
            float: right;
            /* text-align: center; */
        }

        .center-text {
            text-align: center;
            vertical-align: middle;
        }

        .page-break {
            page-break-before: always;
            padding-top: 12.7mm;
        }
    </style>
</header>

<body>
    <div class="content">

        <?php

$rowsPerPage = 15;
// ข้อมูลในรูปแบบอาเรย์
$data = [
    ["q" => 1, "idstd" => "3/2564", "id" => "1101401431850", "prename" => "นางสาว", "fname" => "ราชารวี", "lname" => " ปานทอง", "congrat" => " 30-01-67",],
    ["q" => 2, "idstd" => "7/2564", "id" => "1101401431850", "prename" => "นางสาว", "fname" => "ฐิติธร", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 3, "idstd" => "6/2564", "id" => "1101401431850", "prename" => "นาง", "fname" => "จิตร", "lname" => " ดีใจ", "congrat" => " 30-01-67",],
    ["q" => 4, "idstd" => "20/2565", "id" => "1101401431850", "prename" => "นาง", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 5, "idstd" => "15/2567", "id" => "1101401431850", "prename" => "นาง", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 6, "idstd" => "11/2567", "id" => "1101401431850", "prename" => "นางสาว", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 7, "idstd" => "2/2564", "id" => "1101401431850", "prename" => "นา", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 8, "idstd" => "4/2565", "id" => "1101401431850", "prename" => "นางสาว", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 9, "idstd" => "20/2565", "id" => "1101401431850", "prename" => "นาง", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 10, "idstd" => "15/2567", "id" => "1101401431850", "prename" => "นาง", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 11, "idstd" => "11/2567", "id" => "1101401431850", "prename" => "นางสาว", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 12, "idstd" => "2/2564", "id" => "1101401431850", "prename" => "นา", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 13, "idstd" => "4/2565", "id" => "1101401431850", "prename" => "นางสาว", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 14, "idstd" => "20/2565", "id" => "1101401431850", "prename" => "นาง", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 15, "idstd" => "15/2567", "id" => "1101401431850", "prename" => "นาง", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 16, "idstd" => "11/2567", "id" => "1101401431850", "prename" => "นางสาว", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 17, "idstd" => "2/2564", "id" => "1101401431850", "prename" => "นา", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],
    ["q" => 18, "idstd" => "4/2565", "id" => "1101401431850", "prename" => "นางสาว", "fname" => "วิภารัตน์", "lname" => " วาจาพัฒนา", "congrat" => " 30-01-67",],

];

    $courseMap = [
    1 => ["นวดไทย 150 ชั่วโมง", "นวดไทย 150 ชั่วโมง"],
    2 => ["การนวดฝ่าเท้าเพื่อสุขภาพ 60 ชั่วโมง", "การนวดฝ่าเท้าเพื่อสุขภาพ 60 ชั่วโมง"],
    3 => ["การดูแลสุขภาพสตรีหลังเรือนไฟ 150 ชั่วโมง", "การดูแลสุขภาพสตรีหลังเรือนไฟ 150 ชั่วโมง"],
    4 => ["การนวดด้วยน้ำมันหอมระเหย 150 ชั่วโมง", "การนวดด้วยน้ำมันหอมระเหย 150 ชั่วโมง"],
    5 => ["การนวดด้วยสวีดิช 150 ชั่วโมง", "การนวดด้วยสวีดิช 150 ชั่วโมง"],
    6 => ["นวดไทย 150,330 ชั่วโมง", "นวดไทย 150,330 ชั่วโมง"],
    7 => ["วิชาชีพแพทย์แผนไทย", "สาขาผดุงครรภ์ไทย"],
    8 => ["วิชาชีพแพทย์แผนไทย", "สาขานวดไทย"],
    9 => ["วิชาชีพแพทย์แผนไทย", "สาขาเภสัชกรรมไทย"],
    10 => ["วิชาชีพแพทย์แผนไทย", "สาขาเวชกรรมไทย"],
];

$totalRows = count($students);
$pages = ceil($totalRows / $rowsPerPage);

for ($page = 0; $page < $pages; $page++) {
    if ($page > 0) {
        echo '<div class="page-break"></div>';

    }

        ?>

        <div class="header">
            <h1>รายชื่อ<span
                    style="color: blue">ผู้สำเร็จการศึกษา</span>หรือสำเร็จการฝึกอบรมและมีคุณสมบัติครบถ้วนตามหลักสูตรแต่ละด้านจากสถาบันหรือสถานพยาบาล
            </h1>
            <div class="header-left">
            </div>
            <div class="header-right">
                <p><b>ที่สภาการแพทย์ไทยรับรอง ตามมาตรา 12(2)(ก)</b></p>
                <h2>โรงเรียน เพ็ญแขแพทย์แผนไทย</h2>
                <p style="color: blue">รายชื่อผู้ที่สำเร็จการศึกษา {{ $courseMap[$students[0]['course_id']][1] }}</p>
            </div>
        </div>
        <table>
            <tr>
                <th>ลำดับที่</th>
                <th>รหัสนักศึกษา</th>
                <th>เลขประจำตัวประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th>ปีที่จะสำเร็จการศึกษา</th>
            </tr>
            <?php
    // วนลูปข้อมูลเพื่อแสดงในตาราง
    for ($i = $page * $rowsPerPage; $i < min(($page + 1) * $rowsPerPage, $totalRows); $i++) {
        $row = $students[$i];

        echo "<tr>";
        echo "<td class='center-text'>" . $row["q"] . "</td>";
        echo "<td class='center-text'>" . "&nbsp;" . $row["idstd"] . "</td>";
        echo "<td class='center-text'>" . $row["id"] . "</td>";
        echo "<td class='center-text'>" . $row["prename"] . "</td>";
        echo "<td class='center-text'>" . $row["fname"] . "</td>";
        echo "<td class='center-text'>" . $row["lname"] . "</td>";
        echo "<td class='center-text'>" . $row["congrat"] . "</td>";
        echo "</tr>";
    }
            ?>
        </table>
        <?php } ?>
    </div>
</body>

</html>