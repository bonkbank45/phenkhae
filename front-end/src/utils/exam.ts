export const getExamPeriod = (examType: number) => {
  switch (examType) {
    case 1:
      return 'กลางภาค';
    case 2:
      return 'ปลายภาค';
    case 3:
      return 'เพิ่มเติม';
    default:
      return 'พิเศษ';
  }
};
