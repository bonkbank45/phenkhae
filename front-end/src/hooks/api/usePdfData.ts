import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../services/axios/axiosClient';
import { ErrorResponse } from '../../types/error_response';

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
      await downloadPdf(response.data, `application-form-${studentId}.pdf`);
      return response;
    },
    enabled: !!isClickDownload,
  });
};

export const usePdfStudentList = (
  courseGroupId: string,
  attendenceId: string,
  isClickDownload: boolean,
) => {
  return useQuery({
    queryKey: ['pdfStudentList', courseGroupId, attendenceId],
    queryFn: async () => {
      const response = await api.get(
        `/course_group/${courseGroupId}/pdf-student-list/${attendenceId}`,
        {
          responseType: 'blob',
        },
      );
      const filename = response.headers['content-disposition']
        .split('filename=')[1]
        .replace(/"/g, '');
      await downloadPdf(response.data, filename);
      return response;
    },
    enabled: !!isClickDownload,
  });
};

export const usePdfStudentEmptyList = (
  courseGroupId: string,
  attendenceId: string,
  isClickDownload: boolean,
) => {
  return useQuery({
    queryKey: ['pdfStudentEmptyList', courseGroupId, attendenceId],
    queryFn: async () => {
      const response = await api.get(
        `/course_group/${courseGroupId}/pdf-empty-student-list/${attendenceId}`,
        {
          responseType: 'blob',
        },
      );
      const filename = response.headers['content-disposition']
        .split('filename=')[1]
        .replace(/"/g, '');
      await downloadPdf(response.data, filename);
      return response;
    },
    enabled: !!isClickDownload,
  });
};

export const usePdfStudentCard = (
  courseGroupId: string,
  isClickDownload: boolean,
) => {
  return useQuery({
    queryKey: ['pdfStudentCard', courseGroupId],
    queryFn: async () => {
      const response = await api.get(
        `/course_group/${courseGroupId}/pdf-student-card`,
        { responseType: 'blob' },
      );
      const filename = response.headers['content-disposition']
        .split('filename=')[1]
        .replace(/"/g, '');
      await downloadPdf(response.data, filename);
      return response;
    },
    enabled: !!isClickDownload,
  });
};

export const useGeneratePdfStudentQual = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post(
        '/student_license_qual/pdf-student-qual',
        data,
        { responseType: 'blob' },
      );
      const filename = response.headers['content-disposition']
        .split('filename=')[1]
        .replace(/"/g, '');
      await downloadPdf(response.data, filename);
      return response;
    },
    onSuccess: () => {
      console.log('success');
    },
    onError: (error: ErrorResponse) => {
      console.log(error);
    },
  });
};

export const useGeneratePdfStudentCertificate = (
  courseCompletionId: string,
  isClickDownload: boolean,
) => {
  return useQuery({
    queryKey: ['pdfStudentCertificate', courseCompletionId],
    queryFn: async () => {
      const response = await api.get(
        `/course_completion/pdf-student-certificate/${courseCompletionId}`,
        { responseType: 'blob' },
      );
      console.log(response);
      const filename = decodeURIComponent(
        response.headers['content-disposition']
          .split('filename=')[1]
          .replace(/"/g, ''),
      );
      await downloadPdf(response.data, filename);
      return response;
    },
    enabled: !!isClickDownload,
  });
};

const downloadPdf = async (data: Blob, filename: string) => {
  const blob = new Blob([data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
