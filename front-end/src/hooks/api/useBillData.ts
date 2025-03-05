import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { BillInfoForm } from '../../types/bill_info';

export const useBillByCourseBatchIdData = (
  courseBatchId: string,
  page: number,
) => {
  return useQuery({
    queryKey: ['bill-info', courseBatchId, page],
    queryFn: async () => {
      const response = await api.get(
        `/bill_info/get-bill-info/${courseBatchId}?page=${page}`,
      );
      return response.data;
    },
    placeholderData: (prevData) => prevData,
    // enabled: !!courseBatchId,
  });
};

export const useAddBillData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BillInfoForm) => {
      const response = await api.post('/bill_info', data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Add bill data success');
      queryClient.invalidateQueries({
        queryKey: ['bill-info'],
        exact: false,
      });
    },
    onError: (error) => {
      console.log('Add bill data error', error);
    },
  });
};

export const useUpdateBillData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BillInfoForm) => {
      const response = await api.put(
        `/bill_info/${data.bill_infos_vol}-${data.bill_infos_no}-${data.course_group_id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      console.log('Update bill data success');
      queryClient.invalidateQueries({
        queryKey: ['bill-info'],
        exact: false,
      });
    },
    onError: (error) => {
      console.log('Update bill data error', error);
    },
  });
};

export const useDeleteBillData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BillInfoForm) => {
      const response = await api.delete(
        `/bill_info/${data.bill_infos_vol}-${data.bill_infos_no}`,
      );
      return response.data;
    },
    onSuccess: () => {
      console.log('Delete bill data success');
      queryClient.invalidateQueries({
        queryKey: ['bill-info'],
        exact: false,
      });
    },
    onError: (error) => {
      console.log('Delete bill data error', error);
    },
  });
};

export const useGetLatestBillVolData = () => {
  return useQuery({
    queryKey: ['bill-info', 'latest-bill-vol'],
    queryFn: async () => {
      const response = await api.get('/bill_info/get-latest-bill-vol');
      return response.data;
    },
  });
};

export const useGetBillInfoPaidDataByCourseBatchId = (
  courseBatchId: string | number,
) => {
  return useQuery({
    queryKey: ['bill-info', 'bill-info-paid', courseBatchId],
    queryFn: async () => {
      const response = await api.get(
        `/bill_info/get_bill_info_paid/course_group/${Number(courseBatchId)}`,
      );
      return response.data;
    },
  });
};
