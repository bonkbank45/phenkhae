<?php

if (!function_exists('formatDateCertificate')) {
    function formatDateCertificate($date)
    {
        $date = new DateTime($date);
        return $date->format('d') . ' ' . mapCertificateMonth($date->format('m')) . ' ' . ($date->format('Y') + 543);
    }
}

if (!function_exists('mapCertificateMonth')) {
    function mapCertificateMonth($month)
    {
        $months = [
            'มกราคม',
            'กุมภาพันธ์',
            'มีนาคม',
            'เมษายน',
            'พฤษภาคม',
            'มิถุนายน',
            'กรกฎาคม',
            'สิงหาคม',
            'กันยายน',
            'ตุลาคม',
            'พฤศจิกายน',
            'ธันวาคม'
        ];
        return $months[$month - 1];
    }
}

if (!function_exists('formatNumberCertificate')) {
    function formatNumberCertificate($courseCompletion)
    {
        $date = new DateTime($courseCompletion->course_group->date_start);
        return str_pad($courseCompletion->course_group->course->id, 2, '0', STR_PAD_LEFT) .
            str_pad($courseCompletion->id, 3, '0', STR_PAD_LEFT) .
            '/' . ($date->format('Y') + 543);
    }
}

if (!function_exists('formatDateBackOfPageCertificate')) {
    function formatDateBackOfPageCertificate($date)
    {
        $date = new DateTime($date);
        return 'วันที่ ' . $date->format('d') . ' เดือน ' . mapCertificateMonth($date->format('m')) . ' ปี ' . ($date->format('Y') + 543);
    }
}

if (!function_exists('formatDateBill')) {
    function formatDateBill($date)
    {
        $date = new DateTime($date);
        return 'วันที่...' . $date->format('d') . '...เดือน...' . mapCertificateMonth($date->format('m')) . '...ปี...' . ($date->format('Y') + 543) . '...';
    }
}
