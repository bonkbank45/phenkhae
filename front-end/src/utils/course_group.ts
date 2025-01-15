import { Status, STATUS } from '../types/course_group';

const getStatusColor = (status: Status) => {
  switch (status) {
    case STATUS.ENROLLING:
      return 'bg-green-100 text-green-800';
    case STATUS.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800';
    case STATUS.CLOSED:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (date_start: string, date_end: string) => {
  const startDate = new Date(date_start);
  const endDate = new Date(date_end);
  const currentDate = new Date();
  if (currentDate < startDate) {
    return 'กำลังเปิดรับสมัคร';
  } else if (currentDate >= startDate && currentDate <= endDate) {
    return 'กำลังเรียน';
  } else {
    return 'ปิดรุ่น';
  }
};

export { getStatusColor, getStatusText };
