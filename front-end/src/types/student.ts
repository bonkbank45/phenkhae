export interface Student {
  id: number;
  prename_id: number;
  firstname_tha: string;
  lastname_tha: string;
  firstname_eng: string;
  lastname_eng: string;
  citizenid_card: string;
  birthdate: string; // ISO date string format
  birth_province_id: number;
  father_fname: string;
  father_lname: string;
  mother_fname: string;
  mother_lname: string;
  marital_id: number;
  address_num?: string;
  address_moo?: string;
  address_soi?: string;
  address_road?: string;
  address_subdistrict_id: number;
  phonenumber: string;
  email: string;
  occupation_id: string;
  medical_condition_id?: number;
  surgery_history?: string;
  edu_qual_id: string;
  edu_ins?: string;
  learn_massage: 0 | 1; // Using literal type for boolean-like values
  learn_massage_description?: string;
  work_massage: 0 | 1;
  work_massage_description?: string;
  profile_image?: string;
  created_at?: string; // ISO datetime string
  updated_at?: string; // ISO datetime string
}

// Optional: Add related interfaces for better type safety
export interface Prename {
  id: number;
  prename_tha: string;
  prename_eng?: string;
  prename_short_tha?: string;
  prename_short_eng?: string;
  show_status: number;
}
