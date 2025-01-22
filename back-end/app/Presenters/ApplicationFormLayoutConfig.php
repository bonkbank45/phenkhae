<?php

namespace App\Presenters;

class ApplicationFormLayoutConfig
{
    public const CHAR_WIDTH = [
        'THAI' => 4,
        'ENG' => 5
    ];

    public const POSITION = [
        'FIRST_LINE_Y' => 189,
        'SECOND_LINE_Y' => 215,
        'THIRD_LINE_Y' => 243,
        'FOURTH_LINE_Y' => 270,
        'FIFTH_LINE_Y' => 295,
        'SIXTH_LINE_Y' => 324,
        'SEVENTH_LINE_Y' => 351,
        'EIGHTH_LINE_Y' => 378,
        'NINTH_LINE_Y' => 405,
        'TENTH_LINE_Y' => 432,
        'ELEVENTH_LINE_Y' => 490,
        'TWELFTH_LINE_Y' => 517,
        'THIRTEENTH_LINE_Y' => 612,
        'FOURTEENTH_LINE_Y' => 639,
        'FIFTEENTH_LINE_Y' => 666,
        'SIXTEENTH_LINE_Y' => 693,
        'SEVENTEENTH_LINE_Y' => 720,
        'EIGHTEENTH_LINE_Y' => 898,
        'NINETEENTH_LINE_Y' => 925
    ];

    public const NUMBER = [
        'CITIZEN_ID_X' => 260,
        'BIRTH_DATE_X' => 520,
        'AGE_X' => 130,
        'ADDRESS_NUMBER_X' => 200,
        'ADDRESS_MOO_X' => 278,
        'ADDRESS_ZIP_CODE_X' => 645,
        'PHONE_NUMBER_X' => 180,
        'DATE_REGISTER_FROM_FORM_X' => 530
    ];

    public const THAI_TEXT = [
        'PRENAME_X' => 230,
        'LASTNAME_X' => 500,
        'SPACE_AFTER_PRENAME' => 25,
        'SPACE_AFTER_FIRSTNAME' => 10,
        'BIRTH_PROVINCE_X' => 260,
        'FATHER_NAME_X' => 510,
        'MARITAL_STATUS_X' => 260,
        'ADDRESS_SOI_X' => 398,
        'ADDRESS_ROAD_X' => 570,
        'ADDRESS_SUBDISTRICT_X' => 180,
        'ADDRESS_DISTRICT_X' => 340,
        'ADDRESS_PROVINCE_X' => 480,
        'OCCUPATION_X' => 545,
        'EDUCATION_QUALIFICATION_X' => 190,
        'EDUCATION_INSTITUTION_X' => 440,
        'MEDICAL_CONDITION_X' => 180,
        'SURGERY_HISTORY_X' => 440,
        'LEARN_MASSAGE_DESCRIPTION_X' => 373,
        'WORK_EXPERIENCE_DESCRIPTION_X' => 360,
        'SIGNATURE_PRENAME_X' => 490,
        'SIGNATURE_FIRSTNAME_X' => 517,
        'SIGNATURE_LASTNAME_X' => 552
    ];

    public const ENG_TEXT = [
        'PRENAME_X' => 270,
        'FIRSTNAME_X' => 500,
        'LASTNAME_X' => 500,
        'SPACE_AFTER_PRENAME' => 15,
        'SPACE_AFTER_FIRSTNAME' => 15,
        'EMAIL_X' => 320
    ];

    public const CHECK_SYMBOL = [
        'CHECK_UNICODE' => '&#x2713;',
        'MARRIED_X' => 165,
        'SINGLE_X' => 228,
        'WIDOWED_X' => 282,
        'DIVORCED_X' => 345,
        'WORK_EXPERIENCE_X' => 123,
        'LEARN_MASSAGE_X' => 245,
        'NO_MASSAGE_EXPERIENCE_X' => 123,
        /* -- Course Checkmark Position -- */
        'นวดไทยเพื่อสุขภาพ ๑๕๐ ชั่วโมง_X' => 98,
        'การนวดฝ่าเท้าเพื่อสุขภาพ ๖๐ ชั่วโมง_X' => 98,
        'การดูแลสุขภาพสตรีหลังเรือนไฟ ๑๕๐ ชั่วโมง_X' => 98,
        'การนวดด้วยน้ำมันหอมระเหย ๑๕๐ ชั่วโมง_X' => 98,
        'การนวดสวีดิช ๑๕๐ ชั่วโมง_X' => 98,
        'ผู้ช่วยแพทย์แผนไทย (นวดไทย ๓๓๐ ชม.)_X' => 399,
        'ผดุงครรภ์ไทย_X' => 399,
        'วิชาชีพการนวดไทย (800 ชม.)_X' => 399,
        'เภสัชกรรมไทย_X' => 399,
        'เวชกรรมไทย_X' => 399,
        /* -- Course Checkmark Position -- */
    ];
}