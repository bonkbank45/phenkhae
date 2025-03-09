<html>
<header>
    <title>คะแนนสอบ</title>
    <meta http-equiv="Content-Language" content="th" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style>
        @page {
            margin: 0mm;
        }

        body {
            font-family: 'Sarabun_new', sans-serif;
            margin: 0;
            padding: 0;
        }

        .content {
            padding-top: 12.7mm;
            /* padding-bottom: 12.7mm; */
            padding-left: 12.7mm;
            padding-right: 12.7mm;
        }

        .header {
            text-align: center;
        }

        h1 {
            font-size: 20pt;
            margin: 0px;
        }

        p {
            font-size: 14pt;
        }

        table {
            table-layout: fixed;
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            page-break-inside: avoid;
        }

        th,
        td {
            border: 1px solid;
            font-size: 20px;
            /* text-align: center; */
            padding: 5px;

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
$No = 0;
$rowsPerPage = 20;
$data = [
    ["id" => 1165304620001, "fname" => "ทำงาน ", "lname" => "การบ้านงานหนัก", "execute" => 89, "status" => 1],
    ["id" => 1165304620002, "fname" => "เค้าแมว ", "lname" => "ไงจั๊ฟ", "execute" => 50, "status" => 0],
    ["id" => 1165304620003, "fname" => "จีจี้ ", "lname" => "มาแล้ว", "execute" => 70, "status" => 1],
    ["id" => 1165304620004, "fname" => "พรพิมาน ", "lname" => "ปานตะวัน", "execute" => 44, "status" => 0],

];

$totalRows = count($examInviduals);
$pages = ceil($totalRows / $rowsPerPage);

for ($page = 0; $page < $pages; $page++) {
    if ($page > 0) {
        echo '<div class="page-break"></div>';

    }

    echo "<div class=\"header\">
                    <h1>คะแนนสอบ" . $exam->course_group->course->course_name . " นักเรียน รุ่นที่ " . $exam->course_group->batch . " ปี " . $exam->year . " เทอม " . $exam->term . "</h1>
                    <h1>สอบวันที่ " . Carbon\Carbon::parse($exam->date_start_exam)->format('d/m/') . (Carbon\Carbon::parse($exam->date_start_exam)->format('Y') + 543) . "</h1>
                  </div>";

    echo "<table>
                    <tr>
                        <th style=\"width: 5%;\">&nbsp;ที่&nbsp;</th>
                        <th style=\"width: 20%;\">ไอดีนักเรียน</th>
                        <th style=\"width: 29%;\">ชื่อ</th>
                        <th style=\"width: 29%;\">นามสกุล</th>
                        <th style=\"width: 12%;\">คะแนนที่ได้<br>(" . $exam->score_full . ")</th>
                        <th style=\"width: 5%;\">&nbsp;สถานะ&nbsp;</th>
                    </tr>";

    for ($i = $page * $rowsPerPage; $i < min(($page + 1) * $rowsPerPage, $totalRows); $i++) {
        $row = $examInviduals[$i];
        $No++;

        echo "<tr>";
        echo "<td style='text-align: center; '><b><p>{$No}</p></b></td>";
        echo "<td style='text-align: center; '><b><p>{$row['student']['id']}</p></b></td>";
        echo "<td><b><p>{$row['student']['firstname_tha']}</p></b></td>";
        echo "<td><b><p>{$row['student']['lastname_tha']}</p></b></td>";
        echo "<td style='text-align: center; '><b><p>{$row['score_get']}</p></b></td>";
        if ($row['score_get'] >= $exam->score_pass) {
            echo "<td style='text-align: center; '><b><p style='color: green;'>ผ่าน</p></b></td>";
        } else {
            echo "<td style='text-align: center; '><b><p style='color: red;'>ไม่ผ่าน</p></b></td>";
        }
        echo "</tr>";
    }

    echo "</table>";
}
        ?>
    </div>
</body>

</html>