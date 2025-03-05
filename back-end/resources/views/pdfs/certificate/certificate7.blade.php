<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-Language" content="th" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Certificate การผดุงครรภ์ไทย</title>
        <style>
            @page {
                margin: 8.5mm;
            }

            body {
                font-family: "Sarabun_new", sans-serif;
                margin: 0;
                padding: 0;
            }

            .content {
                border: 1px solid green;
                width: 100%;
                height: 100%;
                padding: 1px 1px;
            }

            .content_m {
                border: 4px solid rgb(10, 119, 10);
                width: 99%;
                height: 99%;
                padding: 1px 1px;
            }

            .content_in_pic {
                border: 1px solid green;
                width: 100%;
                height: 97.8%;
                padding: 1px 1px;
                background-image: url("{{ public_path('images/bg_Certificate.jpg') }}");
                background-size: cover;
                background-repeat: no-repeat;
                background-image-opacity: 0.5;
            }

            .content_in {
                border: 1px solid green;
                width: 100%;
                height: 97.8%;
                padding: 1px 1px;
            }

            .header {
                /* border: 1px solid blue; */
                width: 100%;
            }

            .logo {
                width: 1.55in;
                height: 1.53in;
            }

            .photo {
                border: 1.5px solid #000;
                width: 21mm;
                /* ขนาดความกว้างของรูปภาพเป็น 1 นิ้ว */
                height: 18.5mm;
                /* ขนาดความสูงของรูปภาพเป็น 1 นิ้ว */

                float: right;
                margin-top: 10mm;
                margin-right: 20mm;
            }

            .No {
                /* border: 1px solid #000; */
                text-align: left;
            }

            .section-left {
                /* border: 1px solid pink; */
                width: 25%;
                height: 15%;
                float: left;
                /* width: 50%; */
                /* ทำให้ทั้งสองคอลัมน์มีความกว้างใกล้เคียงกัน */
            }

            .section-right {
                /* border: 1px solid yellowgreen; */
                width: 25%;
                float: right;
            }

            .box {
                width: 65mm;
                height: 39mm;
                text-align: right;
                border: 1.5px solid black;
            }

            .footer {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                text-align: center;
                font-size: 20pt;
                /* background-color: rgba(0, 0, 0, 0.1); */
                /* padding: 5px; */
            }

            #img1 {
                filter: brightness(150%);
            }

            h1 {
                font-size: 36pt;
                /* font-weight: 100; */
                color: rgb(22, 122, 22);
                text-align: center;
                margin: 0px 0px;
            }

            h2 {
                font-size: 30pt;
                /* font-weight: 500; */
                color: rgb(22, 122, 22);

                text-align: center;
                margin: 0px 0px;
            }

            p {
                font-size: 20pt;
                line-height: 1.2;
                margin: 0px;
            }
        </style>
    </head>

    <body>
        <div class="content">
            <div class="content_m">
                <div class="content_in_pic">
                    <div class="header">
                        <div class="section-left">
                            <div class="No">
                                <p style="margin-top: 22px; margin-left: 2em">
                                    เลขที่ &nbsp;&nbsp;{{ formatNumberCertificate($courseCompletion) }}
                                </p>
                            </div>
                        </div>
                        <div class="section-right">
                            <div>
                                <span>&nbsp;</span>
                            </div>
                        </div>
                        <div style="margin-top: 14.4mm; text-align: center">
                            <img
                                src="{{
                                    public_path('images/logo_Certificate.png')
                                }}"
                                alt="โลโก้โรงเรียน"
                                class="logo"
                            /><br />
                        </div>
                        <!-- เว้นว่างขนาด 15px -->
                    </div>

                    <!-- เนื้อหาอื่น ๆ ที่ต้องการแสดงบนใบประกาศนียบัตร -->
                    <h1 style="margin-top: 1.5mm">โรงเรียนเพ็ญแขแพทย์แผนไทย</h1>
                    <p style="text-align: center">
                        เลขที่ 17/86 หมู่ที่ 6 ตำบลคลองสาม อำเภอคลองหลวง
                        จังหวัดปทุมธานี
                    </p>
                    <p style="text-align: center">
                        ได้รับรองหลักสูตรคณะกรรมการวิชาชีพ สาขาแพทย์แผนไทย
                    </p>
                    <p
                        style="
                            text-align: center;
                            font-size: 18pt;
                            margin-top: 1mm;
                        "
                    >
                        <b>ขอมอบประกาศนียบัตรนี้ให้ไว้เพื่อแสดงว่า</b>
                    </p>
                    <p style="text-align: center; margin-top: 2.6mm">
                        <b style="font-size: 32pt; color: rgb(22, 122, 22)"
                            >{{ $courseCompletion->student->firstname_tha }} {{ $courseCompletion->student->lastname_tha }}</b
                        >
                    </p>
                    <p
                        style="
                            text-align: center;
                            font-size: 20pt;
                            margin-top: 2mm;
                        "
                    >
                        <b>ได้ผ่านการอบรม</b>
                    </p>
                    <h2 style="text-align: center; color: black">
                        หลักสูตรวิชาชีพสาขาการแพทย์แผนไทย ประเภทการผดุงครรภ์ไทย
                    </h2>
                    <p
                        style="
                            text-align: center;
                            font-size: 22pt;
                            color: rgb(22, 122, 22);
                        "
                    >
                        <b>ให้ไว้ ณ วันที่ {{ formatDateCertificate($courseCompletion->completion_date) }}</b>
                    </p>
                    <p
                        style="
                            text-align: center;
                            font-size: 22pt;
                            margin-bottom: 35px;
                        "
                    >
                        <b>ขอให้มีความสุข ความเจริญ เทอญ</b>
                    </p>
                    <div class="footer">
                        <p><b>( ดร. เพ็ญแข &nbsp;วงษ์ศิริ )</b></p>
                        <p style="font-size: 18pt">
                            ผู้บริหาร โรงเรียนเพ็ญแขแพทย์แผนไทย
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="content_m">
                <div class="content_in">
                    <div
                        class="box"
                        style="margin-top: 145mm; margin-left: 195mm"
                    >
                        <p
                            style="
                                text-align: center;
                                font-size: 16pt;
                                color: black;
                                margin-top: 2mm;
                            "
                        >
                            <b>ตรวจสอบแล้วมีความถูกต้อง</b>
                        </p>
                        <p
                            style="
                                text-align: center;
                                font-size: 16pt;
                                color: black;
                                margin-top: 15mm;
                            "
                        >
                            <b>( พญ.จันทนา วงษ์ศิริ )</b>
                        </p>
                        <p
                            style="
                                text-align: center;
                                font-size: 15pt;
                                color: black;
                            "
                        >
                            <b>{{ formatDateBackOfPageCertificate($courseCompletion->completion_date) }}</b>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
