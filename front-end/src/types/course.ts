interface CourseCategory {
  id: number;
  category_name: string;
}

interface CourseCategoryBill {
  id: number;
  category_bill_name: string;
}

interface Course {
  id: number;
  course_name: string;
  course_description: string;
  course_category_id: number;
  course_category_bill_id: number;
  course_category: CourseCategory;
  course_category_bill: CourseCategoryBill;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationData<Type> {
  current_page: number;
  data: Type[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface ApiResponse<Type> {
  status: string;
  message: string;
  data: PaginationData<Type>;
}

export type { Course, CourseCategory, CourseCategoryBill, ApiResponse };
