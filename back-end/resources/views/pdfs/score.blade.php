<html>
<header>
    <title>pdf</title>
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
            font-size: 30px;
            margin: 0px;
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
            text-align: center;
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
$rowsPerPage = 20;
$data = [
    ["id" => 1, "fname" => "น.ส.ราชารวี ปานทอง", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 2, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 3, "fname" => "จิตร ดีใจ", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 4, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 5, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 6, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => null, "execute" => null, "research" => null, "law" => null, "sum" => null, "percent" => null],
    ["id" => 7, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 8, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 9, "fname" => "จิตร ดีใจ", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 10, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 11, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 12, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => null, "execute" => null, "research" => null, "law" => null, "sum" => null, "percent" => null],
    ["id" => 13, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 14, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 15, "fname" => "จิตร ดีใจ", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 16, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 17, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 18, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => null, "execute" => null, "research" => null, "law" => null, "sum" => null, "percent" => null],
    ["id" => 19, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 20, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 21, "fname" => "จิตร ดีใจ", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 22, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 23, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 24, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => null, "execute" => null, "research" => null, "law" => null, "sum" => null, "percent" => null],
    ["id" => 25, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 26, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 27, "fname" => "จิตร ดีใจ", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 28, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 29, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 30, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => null, "execute" => null, "research" => null, "law" => null, "sum" => null, "percent" => null],
    ["id" => 31, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
    ["id" => 32, "fname" => "น.ส.วิภารัตน์ วาจาพัฒนา", "theory" => 87, "execute" => 89, "research" => 14, "law" => 39, "sum" => 229, "percent" => 84.81],
];

$totalRows = count($data);
$pages = ceil($totalRows / $rowsPerPage);

for ($page = 0; $page < $pages; $page++) {
    if ($page > 0) {
        echo '<div class="page-break"></div>';

    }

    echo '<div class="header">
                    <h1>คะแนนสอบ นักเรียน รุ่นที่ 15 ปี 1 เทอม 1</h1>
                    <h1>สอบวันที่ 22 มิ.ย. 2567</h1>
                  </div>';

    echo '<table>
                    <tr>
                        <th>&nbsp;ที่&nbsp;</th>
                        <th>ชื่อ-สกุล</th>
                        <th>เภสัจ</th>
                        <th>&nbsp;เวช&nbsp;</th>
                        <th>&nbsp;นวด&nbsp;</th>
                        <th>&nbsp;ผดุง&nbsp;</th>
                        <th>&nbsp;ทฤษฎีฯ&nbsp;<br>(100)</th>
                        <th>กายวิภาค<br>(100)</th>
                        <th>วิจัย<br>(20)</th>
                        <th>กฏหมาย<br>(50)</th>
                        <th>รวม</th>
                        <th>คิดเป็น<br>เปอร์เซ็น</th>
                    </tr>';

    for ($i = $page * $rowsPerPage; $i < min(($page + 1) * $rowsPerPage, $totalRows); $i++) {
        $row = $data[$i];

        echo "<tr>";
        echo "<td>{$row['id']}</td>";
        echo "<td>{$row['fname']}</td>";
        echo "<td></td>";
        echo "<td></td>";
        echo "<td></td>";
        echo "<td></td>";
        echo "<td>{$row['theory']}</td>";
        echo "<td>{$row['execute']}</td>";
        echo "<td>{$row['research']}</td>";
        echo "<td>{$row['law']}</td>";
        echo "<td>{$row['sum']}</td>";
        echo "<td>{$row['percent']}</td>";
        echo "</tr>";
    }

    echo "</table>";
}
        ?>
    </div>
</body>

</html>