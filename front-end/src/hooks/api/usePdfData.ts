import { useQuery } from '@tanstack/react-query';
import api from '../../services/axios/axiosClient';

export const usePdfRegisterStudent = (
  studentId: string,
  isClickDownload: boolean,
) => {
  return useQuery({
    queryKey: ['pdfRegisterStudent', studentId],
    queryFn: async () => {
      const response = await api.get(`/student/${studentId}/application-form`, {
        responseType: 'blob',
      });

      // สร้าง Blob URL
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // สร้าง element a เพื่อดาวน์โหลด
      const link = document.createElement('a');
      link.href = url;
      link.download = `application-form-${studentId}.pdf`; // ชื่อไฟล์ที่จะดาวน์โหลด
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return response;
    },
    enabled: !!isClickDownload,
  });
};
