import { BillInfo } from '../types/bill_info';
import { Enrollment } from '../types/enrollment';

function getPaymentStatus(enrollment: Enrollment, billInfos: BillInfo[]) {
  return billInfos.find(
    (bill) =>
      bill.course_group_id === enrollment.course_group_id &&
      bill.student_id === enrollment.student_id,
  );
}

export { getPaymentStatus };
