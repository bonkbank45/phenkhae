export const filterOptions = {
  ageRange: [
    { value: 'all', label: 'ทั้งหมด' },
    { value: '20-30', label: '20-30 ปี' },
    { value: '31-40', label: '31-40 ปี' },
    { value: '41-50', label: '41-50 ปี' },
    { value: '51+', label: '51 ปีขึ้นไป' },
  ],

  experience: [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'hasExpLearn', label: 'เคยนวด/เรียน' },
    { value: 'hasExpWork', label: 'เคยทำงานเกี่ยวข้องกับนวดไทย' },
  ],

  education: [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'below', label: 'ต่ำกว่าปริญญาตรี' },
    { value: 'bachelor', label: 'ปริญญาตรี' },
    { value: 'above', label: 'สูงกว่าปริญญาตรี' },
  ],

  recentlyAdded: [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'today', label: 'วันนี้' },
    { value: 'yesterday', label: 'เมื่อวาน' },
    { value: 'last7days', label: '7 วันที่ผ่านมา' },
    { value: 'last30days', label: '30 วันที่ผ่านมา' },
  ],

  statusOptions: [
    { value: 'all', label: 'ทั้งหมด' },
    { label: 'แสดง', value: 1 },
    { label: 'ไม่แสดง', value: 0 },
  ],

  courseBatchStatus: [
    { value: 'all', label: 'สถานะทั้งหมด' },
    { value: 'enrolling', label: 'กำลังเปิดรับสมัคร' },
    { value: 'in_progress', label: 'กำลังเรียนอยู่' },
    { value: 'closed', label: 'ปิดรุ่นแล้ว' },
  ],
};
