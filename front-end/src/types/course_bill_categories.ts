interface CourseCategoryBill {
  id: number;
  category_bill_name: string;
}

interface ApiResponse {
  data: CourseCategoryBill[];
  message: string;
  status: boolean;
}

export type { CourseCategoryBill, ApiResponse };
