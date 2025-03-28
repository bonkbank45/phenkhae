import React, { useState } from 'react';
import { useBillByCourseBatchIdData } from '../../hooks/api/useBillData';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';
import { FileAdditionOne } from '../../common/FileAdditionOne';
import Modal from '../../components/Modal';
import Spinner from '../../common/Spinner';
import IconArrowLeft from '../../common/ArrowLeft';
import EditPen from '../../common/EditPen';
import CrossCircle from '../../common/CrossCircle';
import CourseBatchBillAdd from './CourseBatchBillPageForm/CourseBatchBillAdd';
import CourseBatchBillEdit from './CourseBatchBillPageForm/CourseBatchBillEdit';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import CourseBatchBillDelete from './CourseBatchBillPageForm/CourseBatchBillDelete';
import { ErrorResponse } from '../../types/error_response';
import RoundRemoveRedEye from '../../common/RoundRemoveRedEye';
import CourseBatchBillView from './CourseBatchBillPageForm/CourseBatchBillView';

const CourseBatchBillPage = () => {
  const { user } = useAuth();
  const { id: courseBatchId } = useParams();
  const navigate = useNavigate();
  const [isAddBillModalOpen, setIsAddBillModalOpen] = useState(false);
  const [isAddBillManualModalOpen, setIsAddBillManualModalOpen] =
    useState(false);
  const [isViewBillModalOpen, setIsViewBillModalOpen] = useState(false);
  const [isEditBillModalOpen, setIsEditBillModalOpen] = useState(false);
  const [isDeleteBillModalOpen, setIsDeleteBillModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const { data: billData, isLoading: billLoading } = useBillByCourseBatchIdData(
    courseBatchId,
    currentPage,
  );
  const handleBack = () => {
    navigate(`/courses/batchs/${courseBatchId}`);
  };

  console.log(billData);

  const handleFormSubmitSuccess = () => {
    setIsAddBillModalOpen(false);
    toast.success('บันทึกข้อมูลเรียบร้อย');
  };

  const handleFormSubmitError = (error: string) => {
    toast.error(error);
  };

  const handleFormEditSuccess = () => {
    setIsEditBillModalOpen(false);
    toast.success('แก้ไขข้อมูลเรียบร้อย');
  };

  const handleFormEditError = (error: ErrorResponse) => {
    toast.error(error.response.data.message);
  };

  const handleFormDeleteSuccess = () => {
    setIsDeleteBillModalOpen(false);
    toast.success('ลบใบเสร็จเรียบร้อย');
  };

  const handleFormDeleteError = (error: ErrorResponse) => {
    toast.error(error.response.data.message);
  };

  const columns = [
    {
      header: 'ไอดีนักเรียน',
      key: 'id',
      render: (student) => student.student_id || '-',
    },
    {
      header: 'ชื่อ',
      key: 'firstname_tha',
      render: (student) => student.firstname_tha || '-',
    },
    {
      header: 'นามสกุล',
      key: 'lastname_tha',
      render: (student) => student.lastname_tha || '-',
    },
    {
      header: 'วันที่สมัคร',
      key: 'enrollment_date',
      render: (student) =>
        student.enrollment_date
          ? format(new Date(student.enrollment_date), 'dd/MM/yyyy')
          : '-',
    },
    {
      header: 'จำนวนเงินที่ต้องจ่าย',
      key: 'course_price',
      render: (student) => student.course_price + ' บาท' || '-',
    },
    {
      header: 'สถานะการจ่ายเงิน',
      key: 'payment_status',
      render: (student) =>
        student.bill_infos_vol === null || student.bill_infos_no === null ? (
          <div className="text-red-500">ยังไม่ชำระเงิน</div>
        ) : (
          <div className="text-green-500">ชำระเงินเรียบร้อย</div>
        ),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (student) => (
        <>
          {student.bill_infos_vol === null || student.bill_infos_no === null ? (
            <button
              className="cursor-pointer"
              onClick={() => {
                setSelectedStudent(student);
                setIsEditBillModalOpen(false);
                setIsDeleteBillModalOpen(false);
                setIsAddBillModalOpen(true);
              }}
            >
              <FileAdditionOne color="#808080" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="cursor-pointer"
                onClick={() => {
                  setSelectedStudent(student);
                  setIsAddBillModalOpen(false);
                  setIsDeleteBillModalOpen(false);
                  setIsEditBillModalOpen(false);
                  setIsViewBillModalOpen(true);
                }}
              >
                <RoundRemoveRedEye />
              </button>
              <button
                className="cursor-pointer"
                onClick={() => {
                  setSelectedStudent(student);
                  setIsAddBillModalOpen(false);
                  setIsDeleteBillModalOpen(false);
                  setIsEditBillModalOpen(true);
                }}
              >
                <EditPen />
              </button>
              {user?.role === 'admin' && (
                <button
                  className="cursor-pointer"
                onClick={() => {
                  setSelectedStudent(student);
                  setIsAddBillModalOpen(false);
                  setIsEditBillModalOpen(false);
                  setIsDeleteBillModalOpen(true);
                }}
              >
                <CrossCircle />
                </button>
              )}
            </div>
          )}
        </>
      ),
    },
  ];

  if (billLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <div>
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center mb-4">
        <Button
          variant="text"
          type="button"
          className="mb-4 px-0 py-0 flex items-center gap-2 underline"
          onClick={() => {
            navigate(-1);
          }}
        >
          <IconArrowLeft className="w-4 h-4 text-black dark:text-white" />{' '}
          <span className="text-black dark:text-white">ย้อนกลับ</span>
        </Button>
        <div className="flex gap-2">
          <Button
            color="green"
            onClick={() => {
              setIsAddBillManualModalOpen(true);
            }}
            className="font-notoLoopThaiRegular"
          >
            เพิ่มข้อมูลใบเสร็จเพิ่มเติม
          </Button>
          <Button
            color="blue"
            onClick={() => {
              navigate(`/courses/batchs/${courseBatchId}/bills/paid`);
            }}
            className="font-notoLoopThaiRegular"
          >
            เอกสารใบเสร็จ นักเรียนที่จ่ายเงินแล้ว
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 dark:bg-boxdark">
        <h1 className="text-2xl font-semibold dark:text-white font-notoExtraBold">
          ข้อมูลการชำระเงินของนักเรียน
        </h1>
        <div className="text-sm text-gray-500 font-notoLoopThaiRegular mt-4">
          <span className="font-bold text-red-500">* </span>
          หากต้องการจัดการให้นักเรียนจ่ายเงินมากกว่า 1 คอร์ส ในใบเสร็จเดียว
          สามารถกรอก No. และ Vol. เดียวกันได้
        </div>
        <PaginatedTable
          columns={columns}
          data={billData.data}
          isLoading={billLoading}
        />
        <Pagination
          isFetching={billLoading}
          currentPage={currentPage}
          totalPages={billData.data.last_page}
          from={billData.data.from}
          to={billData.data.to}
          total={billData.data.total}
          onPageChange={setCurrentPage}
          hasNextPage={billData.data.next_page_url !== null}
          hasPrevPage={billData.data.prev_page_url !== null}
        />
      </div>

      <Modal
        isOpen={isAddBillModalOpen}
        onClose={() => setIsAddBillModalOpen(false)}
        title="เพิ่มใบเสร็จ"
      >
        {selectedStudent && (
          <CourseBatchBillAdd
            onSuccess={handleFormSubmitSuccess}
            onError={handleFormSubmitError}
            courseGroupId={Number(courseBatchId)}
            studentId={selectedStudent.student_id}
          />
        )}
      </Modal>
      <Modal
        isOpen={isViewBillModalOpen}
        onClose={() => setIsViewBillModalOpen(false)}
        title="รายละเอียดใบเสร็จ"
      >
        {selectedStudent && (
          <CourseBatchBillView
            vol={selectedStudent.bill_infos_vol}
            no={selectedStudent.bill_infos_no}
            exactCourseGroupId={Number(courseBatchId)}
            studentId={Number(selectedStudent.student_id)}
          />
        )}
      </Modal>
      <Modal
        isOpen={isEditBillModalOpen}
        onClose={() => setIsEditBillModalOpen(false)}
        title="แก้ไขใบเสร็จ"
      >
        {selectedStudent && (
          <CourseBatchBillEdit
            onSuccess={handleFormEditSuccess}
            onError={handleFormEditError}
            studentBillInfo={selectedStudent}
          />
        )}
      </Modal>
      <Modal
        isOpen={isDeleteBillModalOpen}
        onClose={() => setIsDeleteBillModalOpen(false)}
        title="ลบใบเสร็จ"
      >
        {selectedStudent && (
          <CourseBatchBillDelete
            studentBillInfo={selectedStudent}
            onSuccess={handleFormDeleteSuccess}
            onError={handleFormDeleteError}
            onClose={() => setIsDeleteBillModalOpen(false)}
          />
        )}
      </Modal>
      <Modal
        isOpen={isAddBillManualModalOpen}
        onClose={() => setIsAddBillManualModalOpen(false)}
        title="เพิ่มใบเสร็จ"
      >
        <CourseBatchBillAdd
          onSuccess={handleFormSubmitSuccess}
          onError={handleFormSubmitError}
          courseGroupId={Number(courseBatchId)}
          isManual={true}
        />
      </Modal>
    </div>
  );
};

export default CourseBatchBillPage;
