interface CourseCategory {
  id: number;
  category_name: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: CourseCategory[];
}

export type { CourseCategory, ApiResponse };
