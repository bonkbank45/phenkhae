export interface BillInfo {
  id: number;
  bill_infos_vol: number;
  bill_infos_no: number;
  bill_infos_date: string;
  bill_infos_receiver: string;
  bill_infos_note?: string;
  course_group_id: number;
  student_id: number;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface SelectedStudentBillInfo extends BillInfo {
  firstname_tha: string;
  lastname_tha: string;
  activity_case_status: number;
  enrollment_date: string;
  enrollment_date_start: string;
  enrollment_date_end: string;
  enrollment_created_at: string;
  enrollment_updated_at: string;
}

export interface BillInfoViewGroup {
  bill_infos_vol: number;
  bill_infos_no: number;
  bill_infos_course: BillInfoCourse[];
  bill_infos_category: BillInfoCategory[];
  bill_infos_receiver: string;
  bill_infos_note?: string;
  bill_infos_date: string;
}

export interface BillInfoCategory {
  id: number;
  name: string;
}

export interface BillInfoCourse {
  id: number;
  name: string;
  bill_infos_category: number;
}

export type BillInfoForm = Omit<BillInfo, 'id' | 'created_at' | 'updated_at'>;
