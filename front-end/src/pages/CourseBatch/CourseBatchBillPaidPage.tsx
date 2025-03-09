import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import { useGetBillInfoPaidDataByCourseBatchId } from '../../hooks/api/useBillData';
import { FileAdditionOne } from '../../common/FileAdditionOne';
import { Button } from '@material-tailwind/react';
import IconArrowLeft from '../../common/ArrowLeft';
import { format } from 'date-fns';
import { useGeneratePdfBill } from '../../hooks/api/usePdfData';

const CourseBatchBillPaidPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isClickDownload, setIsClickDownload] = useState(false);
  const { data: billInfoPaidData, isLoading: isLoadingBillInfoPaid } =
    useGetBillInfoPaidDataByCourseBatchId(Number(id));
  const [selectedVolNo, setSelectedVolNo] = useState<string>('');

  const { mutate: generatePdfBill, isPending: isLoadingGeneratePdfBill } =
    useGeneratePdfBill();

  useEffect(() => {
    if (isClickDownload) {
      setIsClickDownload(false);
    }
  }, [isClickDownload]);

  if (isLoadingBillInfoPaid) return <div>Loading...</div>;

  const columns = [
    {
      header: 'เล่มที่',
      key: 'vol',
      render: (bill) => bill.vol,
    },
    {
      header: 'เลขที่',
      key: 'no',
      render: (bill) => bill.no,
    },
    {
      header: 'ชื่อนักเรียน',
      key: 'student_firstname_tha',
      render: (bill) => bill.student_firstname_tha,
    },
    {
      header: 'ชื่อหลักสูตร',
      key: 'course_name',
      render: (bill) => bill.course_name,
    },
    {
      header: 'วันที่จ่าย',
      key: 'date_submit',
      render: (bill) => format(new Date(bill.date_submit), 'dd/MM/yyyy'),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (bill) => (
        <button
          onClick={() => {
            setSelectedVolNo(`${bill.vol}-${bill.no}`);
            generatePdfBill({ vol: bill.vol, no: bill.no });
          }}
          disabled={isLoadingGeneratePdfBill}
        >
          <FileAdditionOne />
        </button>
      ),
    },
  ];

  // เพิ่มฟังก์ชันสำหรับจัดกลุ่มข้อมูล
  const groupBillData = (bills) => {
    if (!bills) return [];

    // สร้าง Map เพื่อจัดกลุ่มข้อมูลตาม vol และ no
    const groupedMap = new Map();

    bills.forEach((bill) => {
      const key = `${bill.vol}-${bill.no}`;
      if (!groupedMap.has(key)) {
        groupedMap.set(key, { ...bill });
      } else {
        // ถ้ามีข้อมูลอยู่แล้ว ให้เปรียบเทียบวันที่และใช้วันที่เก่าที่สุด
        const existingBill = groupedMap.get(key);
        if (new Date(bill.date_submit) < new Date(existingBill.date_submit)) {
          groupedMap.set(key, { ...bill });
        }

        if (bill.course_name !== existingBill.course_name) {
          groupedMap.set(key, {
            ...bill,
            course_name: [existingBill.course_name, bill.course_name].join(
              ', ',
            ),
          });
        }
      }
    });

    return Array.from(groupedMap.values());
  };

  // ใช้ข้อมูลที่จัดกลุ่มแล้วในการแสดงผล
  const groupedBillData = groupBillData(billInfoPaidData?.data || []);

  console.log(groupedBillData);

  return (
    <>
      <Button
        variant="text"
        type="button"
        className="mb-4 px-0 py-0 flex items-center gap-2 underline"
        onClick={() => navigate(-1)}
      >
        <IconArrowLeft className="w-4 h-4 text-black dark:text-white" />
        <span className="text-black dark:text-white">ย้อนกลับ</span>
      </Button>
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
        <PaginatedTable
          columns={columns}
          data={{
            data: groupedBillData,
            current_page: 1,
            from: 1,
            last_page: 1,
            per_page: 10,
            to: groupedBillData?.length || 0,
            total: groupedBillData?.length || 0,
            first_page_url: '',
            last_page_url: '',
            next_page_url: null,
            prev_page_url: null,
            links: [],
            path: '',
          }}
          isLoading={isLoadingBillInfoPaid}
        />
      </div>
    </>
  );
};

export default CourseBatchBillPaidPage;
