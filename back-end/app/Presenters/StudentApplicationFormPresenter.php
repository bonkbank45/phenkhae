<?php

namespace App\Presenters;

use App\Models\Student;
use App\Presenters\ApplicationFormLayoutConfig as FormLayoutConfig;
use Carbon\Carbon;

class StudentApplicationFormPresenter
{
    private Student $student;

    public function __construct(Student $student)
    {
        $this->student = $student;
    }

    public function getFormattedContent(): string
    {
        $html = '';

        // Prename Thai
        $prenameThaiText = $this->getPrenameThaiText();
        $prenameThaiShow = in_array($prenameThaiText, ['นาย', 'นาง', 'นางสาว']) ?
            '' : $prenameThaiText;
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['FIRST_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['PRENAME_X'],
            $prenameThaiShow
        );

        // First name Thai
        $firstNameStartX = $this->calculateFirstNameStartX($prenameThaiText, 'THAI', 'PRENAME_X');
        $html .= $this->createPositionedDiv(
            FormLayoutConfig::POSITION['FIRST_LINE_Y'],
            $firstNameStartX,
            $this->student->firstname_tha . '&nbsp;'
        );

        // Last name Thai
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['FIRST_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['LASTNAME_X'],
            $this->student->lastname_tha
        );

        // Prename English
        $prenameEngText = $this->getPrenameEngText();
        $prenameEngShow = in_array($prenameEngText, ['Mr.', 'Mrs.', 'Miss']) ?
            '' : $prenameEngText;
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['SECOND_LINE_Y'],
            FormLayoutConfig::ENG_TEXT['PRENAME_X'],
            $prenameEngShow
        );

        // First name English
        $firstNameStartX = $this->calculateFirstNameStartX($prenameEngText, 'ENG', 'PRENAME_X');
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['SECOND_LINE_Y'],
            $firstNameStartX,
            $this->student->firstname_eng
        );

        // Last name English
        $lastNameStartX = $this->calculateLastNameStartX($prenameEngText, 'ENG', 'PRENAME_X');
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['SECOND_LINE_Y'],
            $lastNameStartX,
            $this->student->lastname_eng
        );

        // Citizen ID
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['THIRD_LINE_Y'],
            FormLayoutConfig::NUMBER['CITIZEN_ID_X'],
            $this->student->citizenid_card
        );

        // Birth date
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['THIRD_LINE_Y'],
            FormLayoutConfig::NUMBER['BIRTH_DATE_X'],
            Carbon::parse($this->student->birthdate)->format('d/m/Y')
        );

        // Age
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['FOURTH_LINE_Y'],
            FormLayoutConfig::NUMBER['AGE_X'],
            Carbon::parse($this->student->birthdate)->age . ' ปี'
        );

        // Birth province
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['FOURTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['BIRTH_PROVINCE_X'],
            $this->student->birth_province->name_in_thai
        );

        //Father name
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['FOURTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['FATHER_NAME_X'],
            $this->student->father_fname . '&nbsp;&nbsp;&nbsp;&nbsp;' . $this->student->father_lname
        );

        // Marital status
        $maritalStatusMap = [
            '1' => 'MARRIED',
            '2' => 'SINGLE',
            '3' => 'WIDOWED',
            '4' => 'DIVORCED'
        ];

        if (isset($maritalStatusMap[$this->student->marital_id])) {
            $html .= $this->createPositionedDiv(
                FormLayoutConfig::POSITION['FIFTH_LINE_Y'],
                FormLayoutConfig::CHECK_SYMBOL[$maritalStatusMap[$this->student->marital_id] . '_X'],
                FormLayoutConfig::CHECK_SYMBOL['CHECK_UNICODE']
            );
        }


        // Address number
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['SIXTH_LINE_Y'],
            FormLayoutConfig::NUMBER['ADDRESS_NUMBER_X'],
            $this->student->address_num
        );

        // Address moo *add - later
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['SIXTH_LINE_Y'],
            FormLayoutConfig::NUMBER['ADDRESS_MOO_X'],
            $this->student->address_moo
        );

        // Address soi *add - later
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['SIXTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['ADDRESS_SOI_X'],
            $this->student->address_soi
        );

        // Address road *add - later
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['SIXTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['ADDRESS_ROAD_X'],
            $this->student->address_road
        );

        // Address subdistrict
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['SEVENTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['ADDRESS_SUBDISTRICT_X'],
            $this->student->subdistrict->name_in_thai
        );

        // Address district
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['SEVENTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['ADDRESS_DISTRICT_X'],
            $this->student->subdistrict->districts->name_in_thai
        );

        // Address province
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['SEVENTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['ADDRESS_PROVINCE_X'],
            $this->student->subdistrict->districts->provinces->name_in_thai
        );

        // Address zip code
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['SEVENTH_LINE_Y'],
            FormLayoutConfig::NUMBER['ADDRESS_ZIP_CODE_X'],
            $this->student->address_zip_code
        );

        // Phone number
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['EIGHTH_LINE_Y'],
            FormLayoutConfig::NUMBER['PHONE_NUMBER_X'],
            $this->student->phonenumber
        );

        // Email
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['EIGHTH_LINE_Y'],
            FormLayoutConfig::ENG_TEXT['EMAIL_X'],
            $this->student->email
        );

        // Occupation
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['EIGHTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['OCCUPATION_X'],
            $this->student->occupation->occupation_name
        );

        // Education qualification
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['NINTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['EDUCATION_QUALIFICATION_X'],
            $this->student->edu_qual->edu_qual_name
        );

        // Education institution
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['NINTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['EDUCATION_INSTITUTION_X'],
            $this->student->edu_ins
        );

        // Medical condition *add - later
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['TENTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['MEDICAL_CONDITION_X'],
            $this->student->medical_condition->name ?? '-'
        );

        // Surgery history *add - later
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['TENTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['SURGERY_HISTORY_X'],
            $this->student->surgery_history
        );

        // Work experience
        if ($this->student->work_massage == '1') {
            $html .= $this->createPositionedDivAddSpace(
                FormLayoutConfig::POSITION['TWELFTH_LINE_Y'],
                FormLayoutConfig::CHECK_SYMBOL['WORK_EXPERIENCE_X'],
                FormLayoutConfig::CHECK_SYMBOL['CHECK_UNICODE']
            );
            $html .= $this->createPositionedDivAddSpace(
                FormLayoutConfig::POSITION['TWELFTH_LINE_Y'],
                FormLayoutConfig::THAI_TEXT['WORK_EXPERIENCE_DESCRIPTION_X'],
                $this->student->work_massage_description
            );
        }
        if ($this->student->learn_massage == '1') {
            $html .= $this->createPositionedDivAddSpace(
                FormLayoutConfig::POSITION['ELEVENTH_LINE_Y'],
                FormLayoutConfig::CHECK_SYMBOL['LEARN_MASSAGE_X'],
                FormLayoutConfig::CHECK_SYMBOL['CHECK_UNICODE']
            );
            $html .= $this->createPositionedDivAddSpace(
                FormLayoutConfig::POSITION['ELEVENTH_LINE_Y'],
                FormLayoutConfig::THAI_TEXT['LEARN_MASSAGE_DESCRIPTION_X'],
                $this->student->learn_massage_description
            );
        }
        if ($this->student->work_massage == '0' && $this->student->learn_massage == '0') {
            $html .= $this->createPositionedDivAddSpace(
                FormLayoutConfig::POSITION['ELEVENTH_LINE_Y'],
                FormLayoutConfig::CHECK_SYMBOL['NO_MASSAGE_EXPERIENCE_X'],
                FormLayoutConfig::CHECK_SYMBOL['CHECK_UNICODE']
            );
        }

        // Course
        $coursesMap = [
            '1' => [
                'course_name' => 'นวดไทยเพื่อสุขภาพ ๑๕๐ ชั่วโมง',
                'line_position_y' => 'THIRTEENTH_LINE_Y'
            ],
            '2' => [
                'course_name' => 'การนวดฝ่าเท้าเพื่อสุขภาพ ๖๐ ชั่วโมง',
                'line_position_y' => 'FOURTEENTH_LINE_Y'
            ],
            '3' => [
                'course_name' => 'การดูแลสุขภาพสตรีหลังเรือนไฟ ๑๕๐ ชั่วโมง',
                'line_position_y' => 'FIFTEENTH_LINE_Y'
            ],
            '4' => [
                'course_name' => 'การนวดด้วยน้ำมันหอมระเหย ๑๕๐ ชั่วโมง',
                'line_position_y' => 'SIXTEENTH_LINE_Y'
            ],
            '5' => [
                'course_name' => 'การนวดสวีดิช ๑๕๐ ชั่วโมง',
                'line_position_y' => 'SEVENTEENTH_LINE_Y'
            ],
            '6' => [
                'course_name' => 'ผู้ช่วยแพทย์แผนไทย (นวดไทย ๓๓๐ ชม.)',
                'line_position_y' => 'THIRTEENTH_LINE_Y'
            ],
            '7' => [
                'course_name' => 'ผดุงครรภ์ไทย',
                'line_position_y' => 'FOURTEENTH_LINE_Y'
            ],
            '8' => [
                'course_name' => 'วิชาชีพการนวดไทย (800 ชม.)',
                'line_position_y' => 'FIFTEENTH_LINE_Y'
            ],
            '9' => [
                'course_name' => 'เภสัชกรรมไทย',
                'line_position_y' => 'SIXTEENTH_LINE_Y'
            ],
            '10' => [
                'course_name' => 'เวชกรรมไทย',
                'line_position_y' => 'SEVENTEENTH_LINE_Y'
            ],
        ];

        if (isset($this->student->enrollments)) {
            foreach ($this->student->enrollments as $enrollment) {
                if (isset($coursesMap[(string) $enrollment->course_group->course_id])) {
                    $html .= $this->createPositionedDivAddSpace(
                        FormLayoutConfig::POSITION[$coursesMap[(string) $enrollment->course_group->course_id]['line_position_y']],
                        FormLayoutConfig::CHECK_SYMBOL[$coursesMap[(string) $enrollment->course_group->course_id]['course_name'] . '_X'],
                        FormLayoutConfig::CHECK_SYMBOL['CHECK_UNICODE'],
                    );
                }
            }
        }

        $isLongPrename = $this->getLengthWithoutExcludedChars($prenameThaiText, true) > 4;
        // Add signature
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['EIGHTEENTH_LINE_Y'],
            FormLayoutConfig::THAI_TEXT['SIGNATURE_PRENAME_X'],
            $isLongPrename ? '' : $prenameThaiText
        );

        // Add signature first name
        // Align with prename
        $isLongFirstName = $this->getLengthWithoutExcludedChars($this->student->firstname_tha, true) >= 5;
        $isLongLastName = $this->getLengthWithoutExcludedChars($this->student->lastname_tha, true) >= 7;

        if ($isLongPrename) {
            $startFirstNameXpos = $isLongFirstName ?
                FormLayoutConfig::THAI_TEXT['SIGNATURE_PRENAME_X'] :
                FormLayoutConfig::THAI_TEXT['SIGNATURE_FIRSTNAME_X'];
        } else {
            $startFirstNameXpos = $this->calculateFirstNameStartX($prenameThaiText, 'THAI', 'SIGNATURE_PRENAME_X');
        }

        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['EIGHTEENTH_LINE_Y'],
            $startFirstNameXpos,
            $this->student->firstname_tha
        );

        // Add signature last name
        // Align with first name
        if (!$isLongFirstName && $isLongLastName) { // นาง  กนก ลิ้มไพบูลย์
            $startLastNameXpos = FormLayoutConfig::THAI_TEXT['SIGNATURE_LASTNAME_X'];
        } else if ($isLongPrename) { // ธนภัทร ลิ้มไพบูลย์
            $startLastNameXpos = $this->calculateFirstNameStartX($this->student->firstname_tha, 'THAI', 'SIGNATURE_PRENAME_X');
            $startLastNameXpos += 10; // Offset to make it align with the first name
        } else { // มีคำนำหน้า แต่ชื่อยาว
            if (
                $this->getLengthWithoutExcludedChars($this->student->lastname_tha, true) +
                $this->getLengthWithoutExcludedChars($this->student->firstname_tha, true) > 15
            ) { // พ.ต.อ. ธนภัทร ลิ้มไพบูลย์ยาว
                $startLastNameXpos = $this->calculateLastNameStartX($prenameThaiText, 'THAI', 'SIGNATURE_FIRSTNAME_X');
                $startLastNameXpos -= 10;
            } else { // พ.ต.อ. สั้น สั้น
                $startLastNameXpos = $this->calculateLastNameStartX($prenameThaiText, 'THAI', 'SIGNATURE_FIRSTNAME_X');
            }

        }

        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['EIGHTEENTH_LINE_Y'],
            $startLastNameXpos,
            $this->student->lastname_tha
        );

        // Add date register from form
        $html .= $this->createPositionedDivAddSpace(
            FormLayoutConfig::POSITION['NINETEENTH_LINE_Y'],
            FormLayoutConfig::NUMBER['DATE_REGISTER_FROM_FORM_X'],
            Carbon::parse($this->student->date_register_from_form)->format('d/m/Y')
        );

        return $html;
    }

    private function getPrenameThaiText(): string
    {
        if ($this->student->prename->prename_short_tha) {
            return $this->student->prename->prename_short_tha;
        }
        return $this->student->prename->prename_tha;
    }

    private function getPrenameEngText(): string
    {
        if ($this->student->prename->prename_short_eng) {
            return $this->student->prename->prename_short_eng;
        } else if ($this->student->prename->prename_eng) {
            return $this->student->prename->prename_eng;
        }
        return '';
    }

    private function calculateFirstNameStartX(string $prenameText, string $language, string $prenameXpos): int
    {
        $languageConfig = [
            'THAI' => [
                'getPrenameText' => 'getPrenameThaiText',
                'config' => FormLayoutConfig::THAI_TEXT,
            ],
            'ENG' => [
                'getPrenameText' => 'getPrenameEngText',
                'config' => FormLayoutConfig::ENG_TEXT,
            ],
        ];

        $config = $languageConfig[$language];

        // Variable method name
        $prenameText = $this->{$config['getPrenameText']}();

        $prenameLength = $this->getLengthWithoutExcludedChars($prenameText, $language === 'THAI');

        return $config['config'][$prenameXpos] +
            ($prenameLength * FormLayoutConfig::CHAR_WIDTH[$language]) +
            $config['config']['SPACE_AFTER_PRENAME'];
    }

    private function calculateLastNameStartX(string $prenameText, string $language, string $firstNameXpos): int
    {
        $firstNameMap = [
            'THAI' => 'firstname_tha',
            'ENG' => 'firstname_eng',
        ];

        $firstNameStartX = $this->calculateFirstNameStartX($prenameText, $language, $firstNameXpos);

        $firstNameText = $this->student->{$firstNameMap[$language]};

        $firstNameLength = $this->getLengthWithoutExcludedChars($firstNameText, $language === 'THAI');

        $configKey = $language === 'THAI' ? 'THAI_TEXT' : 'ENG_TEXT';

        return $firstNameStartX +
            ($firstNameLength * FormLayoutConfig::CHAR_WIDTH[$language]) +
            FormLayoutConfig::{$configKey}['SPACE_AFTER_FIRSTNAME'];
    }

    private function getLengthWithoutExcludedChars(string $text, bool $isThai): int
    {
        $excludeChars = ['.', '(', ')', '-'];
        $text = str_replace($excludeChars, '', $text);
        if ($isThai) {
            $excludeThai = ['่', '้', '๊', '๋', 'ะ', 'ั', '้', 'ิ', 'ี', 'ื', 'ุ', 'ู', '์'];
            $text = str_replace($excludeThai, '', $text);
            return mb_strlen($text, 'UTF-8');
        }
        return strlen($text);
    }

    private function createPositionedDiv(int $top, int $left, ?string $content): string
    {
        $content = $content ?? '-';
        return "<div style='position: absolute; top: {$top}px; left: {$left}px;'>
            <span>{$content}</span>
        </div>";
    }

    private function createPositionedDivAddSpace(int $top, int $left, ?string $content): string
    {
        $content = $content ?? '-';
        $paddedContent = $content . '&nbsp;&nbsp;&nbsp;&nbsp;';
        return "<div style='position: absolute; top: {$top}px; left: {$left}px;'>
            <span style=''>{$paddedContent}</span>
        </div>";
    }
}