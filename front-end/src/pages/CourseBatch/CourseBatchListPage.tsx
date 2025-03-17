import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiPlus } from 'react-icons/fi';
import { Button } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import { useCourseBatchDataTable } from '../../hooks/api/useCourseBatchData';
import { useCourseData } from '../../hooks/api/useCourseData';
import useDebounce from '../../hooks/useDebounce';
import Spinner from '../../common/Spinner';
import Search from '../../components/Search/Search';
import Filter from '../../components/Filter/Filter';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { CourseBatchCard } from '../../components/CourseBatchCard';
import { getStatusColor, getStatusText } from '../../utils/course_group';
import { filterOptions } from '../../constants/filterOptions';
import EditCourseBatchForm from './EditCourseBatchForm';
import { CourseGroup } from '../../types/course_group';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../types/error_response';
import DeleteCourseBatchForm from './DeleteCourseBatchForm';

const CourseBatchListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [courseId, setCourseId] = useState<string>('all');
  const [courseBatchStatus, setCourseBatchStatus] = useState<string>('all');
  const [selectedCourseBatch, setSelectedCourseBatch] =
    useState<CourseGroup | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

  /* Course Data Options */
  const { data: courseData } = useCourseData();
  const courseOptions = [
    { label: 'ทั้งหมด', value: 'all' },
    ...(courseData?.data
      ? courseData.data.map((course) => ({
          label: course.course_name,
          value: course.id,
        }))
      : []),
  ];
  /* Course Data Options */

  const {
    data: courseBatchData,
    isLoading,
    isFetching,
    error,
  } = useCourseBatchDataTable({
    page,
    searchTerm: debouncedSearchTerm,
    courseBatchStatus,
    courseId,
  });

  const handleSearch = (input: string) => {
    setSearchTerm(input);
    setPage(1);
  };

  const handleOpenBatch = () => {
    navigate('/courses/batchs/add');
  };

  const handleViewDetails = (id: number) => {
    navigate(`/courses/batchs/${id}`);
  };

  const handleEditBatch = (id: number) => {
    setIsOpenEditModal(true);
    const courseBatch = courseBatchData?.data.data.find(
      (batch) => batch.id === id,
    );
    setSelectedCourseBatch(courseBatch);
    console.log(courseBatch);
  };

  const handleDeleteBatch = (id: number) => {
    setIsOpenDeleteModal(true);
    const courseBatch = courseBatchData?.data.data.find(
      (batch) => batch.id === id,
    );
    setSelectedCourseBatch(courseBatch);
    console.log(courseBatch);
  };

  const handleFilterCourse = (id: string) => {
    setCourseId(id);
    setPage(1);
  };

  const handleFilterCourseBatchStatus = (status: string) => {
    setCourseBatchStatus(status);
    setPage(1);
  };

  const handleCloseBatch = (id: number) => {
    console.log('Closing batch:', id);
  };

  const handleEditBatchSuccess = () => {
    setIsOpenEditModal(false);
    toast.success('แก้ไขข้อมูลรุ่นหลักสูตรสำเร็จ');
  };

  const handleEditBatchError = (error: ErrorResponse) => {
    toast.error(
      Object.entries(error.response.data.errors)
        .map(([key, value]) => `${key}: ${value.join(', ')}`)
        .join(', ') || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
    );
  };

  const handleDeleteBatchSuccess = () => {
    setIsOpenDeleteModal(false);
    toast.success('ลบรุ่นหลักสูตรสำเร็จ');
  };

  const handleDeleteBatchError = (error: ErrorResponse) => {
    if (!error.response.data.errors) {
      toast.error(error.response.data.message);
    } else {
      toast.error(
        Object.entries(error.response.data.errors)
          .map(([key, value]) => `${key}: ${value.join(', ')}`)
          .join(', ') || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
      );
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="container mx-auto p-1 space-y-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow p-4 dark:bg-boxdark">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-semibold dark:text-white font-notoExtraBold">
                รุ่นหลักสูตรที่มีอยู่ในขณะนี้
              </h1>
              <p className="text-gray-600 dark:text-white font-notoLoopThaiRegular">
                จำนวนรุ่นหลักสูตรที่มีอยู่ในขณะนี้:{' '}
                {courseBatchData?.data.total}
              </p>
            </div>
            <Button
              color="blue"
              onClick={handleOpenBatch}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-notoExtraBold"
            >
              <FiPlus /> เปิดรุ่นใหม่
            </Button>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-2">
              <Filter
                value={courseId}
                onChange={handleFilterCourse}
                options={courseOptions || []}
                showIcon={true}
                placeholder="หลักสูตรทั้งหมด"
              />
              <Filter
                value={courseBatchStatus}
                onChange={handleFilterCourseBatchStatus}
                options={filterOptions.courseBatchStatus}
                placeholder="สถานะรุ่นหลักสูตร"
                showIcon={false}
                className="h-full"
                classNameIcon="h-full"
              />
            </div>
            <Search
              value={searchTerm}
              onChange={handleSearch}
              placeholder="ค้นหาตามชื่อหลักสูตร, รุ่น..."
            />
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-gray-50 dark:bg-boxdark-2 rounded-lg shadow-lg p-4">
          {/* Optional Section Title */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold dark:text-white font-notoExtraBold">
              รายการรุ่นหลักสูตร
            </h2>
          </div>

          {/* Course Batch Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseBatchData?.data.data.length === 0 ? (
              <div className="flex col-span-3 justify-center items-center h-[300px]">
                <p className="text-gray-600 dark:text-white font-notoLoopThaiRegular">
                  ไม่พบรุ่นหลักสูตร{' '}
                  {courseId !== 'all'
                    ? `ของ ${
                        courseOptions.find(
                          (option) => option.value === parseInt(courseId),
                        )?.label || ''
                      }`
                    : ''}
                </p>
              </div>
            ) : (
              courseBatchData?.data.data.map((batch) => (
                <CourseBatchCard
                  key={batch.id}
                  batch={batch}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  onViewDetails={handleViewDetails}
                  onCloseBatch={handleCloseBatch}
                  onEditBatch={handleEditBatch}
                  onDeleteBatch={handleDeleteBatch}
                  user={user}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          <Pagination
            isFetching={isLoading}
            currentPage={page}
            totalPages={courseBatchData?.data.last_page}
            from={courseBatchData?.data.from}
            to={courseBatchData?.data.to}
            total={courseBatchData?.data.total}
            onPageChange={setPage}
            hasNextPage={!!courseBatchData?.data.next_page_url}
            hasPrevPage={!!courseBatchData?.data.prev_page_url}
          />
        </div>
      </div>
      <Modal
        isOpen={isOpenEditModal}
        onClose={() => {
          setIsOpenEditModal(false);
        }}
        title="แก้ไขข้อมูลรุ่นหลักสูตรเบื้องต้น"
      >
        <div>
          {selectedCourseBatch && (
            <EditCourseBatchForm
              initialData={selectedCourseBatch}
              onClose={() => {
                setIsOpenEditModal(false);
              }}
              onSuccess={handleEditBatchSuccess}
              onError={(error: ErrorResponse) => {
                handleEditBatchError(error);
              }}
            />
          )}
        </div>
      </Modal>
      <Modal
        isOpen={isOpenDeleteModal}
        onClose={() => {
          setIsOpenDeleteModal(false);
        }}
        title="ลบรุ่นหลักสูตร"
      >
        {selectedCourseBatch && (
          <DeleteCourseBatchForm
            courseBatch={selectedCourseBatch}
            onSuccess={handleDeleteBatchSuccess}
            onError={(error: ErrorResponse) => {
              handleDeleteBatchError(error);
            }}
            onClose={() => {
              setIsOpenDeleteModal(false);
              setSelectedCourseBatch(null);
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default CourseBatchListPage;
