interface CourseCategory {
  id: number;
  category_name: string;
}

interface CourseCategoryBill {
  id: number;
  category_bill_name: string;
}

interface CoursePrice {
  id: number;
  course_id: number;
  price: string;
  date_start: string;
  date_end: string | null;
  created_at: string;
  updated_at: string;
}

interface Course {
  id: number;
  course_category_id: number;
  course_category_bill_id: number;
  course_name: string;
  course_description: string;
  created_at: string;
  updated_at: string;
  course_category: CourseCategory;
  course_category_bill: CourseCategoryBill;
  latest_course_price: CoursePrice;
}

export interface CourseGroupByCourseIdResponse {
  message: string;
  status: string;
  data: {
    [key: number]: CourseGroupTable[];
  };
}

export interface CourseGroupTable {
  id: number;
  course_id: number;
  max_students: number;
  batch: number;
  date_start: string;
  date_end: string | null;
  created_at: string;
  updated_at: string;
  course: Course;
}

interface CourseGroupResponse {
  id: number;
  course_id: number;
  max_students: number;
  batch: number;
  date_start:
    | string
    | `${number}-${number}-${number} ${number}:${number}:${number}`;
  date_end:
    | string
    | `${number}-${number}-${number} ${number}:${number}:${number}`
    | null;
  created_at: string;
  updated_at: string;
  students_enrolled: number;
  course: Course;
}

interface PaginatedResponse<Type> {
  data: {
    data: Type[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export const STATUS = {
  ENROLLING: 'กำลังเปิดรับสมัคร',
  IN_PROGRESS: 'กำลังเรียน',
  CLOSED: 'ปิดรุ่น',
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];
export type CourseGroup = CourseGroupResponse;
export type PaginatedCourseGroup = PaginatedResponse<CourseGroup>;
