<!DOCTYPE html>
<html lang="th">

<head>
    <meta http-equiv="Content-Language" content="th" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>PDF บัตรนักเรียน</title>
    <style>
        @page {
            margin: 10mm;
        }

        body {
            font-family: "sarabun_new", sans-serif;
            font-size: 16px;

        }

        .content {
            /* border: 1px solid red; */
            width: 100%;
            height: 100%;
            margin: 0px 0px;
            padding: 0px 0px;
        }

        .table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;

        }

        .table td {
            height: 20mm;
            border: 1px solid black;
            vertical-align: middle;
            padding: 10px;
            font-weight: bold;
            padding: 2px 1px;
            padding-left: 2px;
            /* margin: 0; */
        }

        .inner-table {
            width: 100%;
            /* border: none; */
            border-collapse: collapse;
            /* ลบเส้นขอบของ table ด้านใน */
        }

        .inner-table td {
            border: none;
            /* ลบเส้นของ td ใน table ด้านใน */
        }

        .body {
            margin-top: 10px;
        }

        .logo {
            width: 75px;
            /* ลดขนาดโลโก้ */
            height: 75px;
            object-fit: contain;
        }
    </style>
</head>

<body>
    <div class="content">
        <table class="table">
            @foreach (array_chunk($students, 3) as $index => $row)  <!-- แบ่งเป็น 3 คอลัมน์ -->
                <tr>
                    @foreach ($row as $student)
                        <td>
                            <table class="inner-table">
                                <tr>
                                    <td
                                        style="width: 55%; border-top: 1px solid black; border-left: 1px solid black; border-bottom: 1px solid black;">
                                        <p style="font-size: 25.7px; color: blue;">
                                            บัตรนักเรียนแพทย์แผนไทย<br>ร.ร.เพ็ญแขแพทย์แผนไทย
                                        </p>
                                    </td>
                                    <td align="left"
                                        style="width: 25%; border-top: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black;">
                                        <img src="{{public_path('images/logo_Phenkae.jpg') }}" class="logo">
                                    </td>
                                    <td style="width: 20%;">

                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3">
                                        <p style="font-size: 25px;">ชื่อ <span
                                                style="font-size: 32px; color: blue;">{{ $student->name }}</span></p>
                                        <p style="font-size: 25px;">เรียนวิชา
                                            {{ $student->course }}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="text-align: center;">
                                        <p style="font-size: 24px; ">รุ่นที่ {{ $student->batch }} เลขที่
                                            {{ $student->student_id }}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    @endforeach
                    <!-- เมื่อมีข้อมูลน้อยกว่า 3 รายการ ให้เติมคอลัมน์ที่เหลือด้วย colspan -->
                    @if ($index == 0 && count($row) < 3)
                        @for ($i = count($row); $i < 3; $i++)
                            <td style=" width: 35.33%; height: 20mm; border: none"></td>
                            <!-- เติมคอลัมน์ที่เหลือ -->
                        @endfor
                    @endif
                </tr>
            @endforeach
        </table>
    </div>
</body>

</html>