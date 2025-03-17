import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '@material-tailwind/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import thLocale from '@fullcalendar/core/locales/th';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import IconArrowLeft from '../../../common/ArrowLeft';
import Spinner from '../../../common/Spinner';
import { useCourseAttendenceByCourseGroupId } from '../../../hooks/api/useCourseAttendence';
import { useAddCourseAttendence } from '../../../hooks/api/useCourseAttendence';
import { useDeleteCourseAttendence } from '../../../hooks/api/useCourseAttendence';
import { useCourseBatchDataById } from '../../../hooks/api/useCourseBatchData';
import { getStatusText } from '../../../utils/course_group';
import Modal from '../../../components/Modal';

const StyleWrapper = styled.div`
  .fc td {
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

const CourseBatchAttendencePage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: courseAttendences,
    isLoading: isLoadingCourseAttendences,
    refetch: refetchCourseAttendences,
  } = useCourseAttendenceByCourseGroupId(Number(id));
  const { data: courseBatchData, isLoading: isLoadingCourseBatchData } =
    useCourseBatchDataById(id);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const {
    mutate: addCourseAttendence,
    isPending: isLoadingAddCourseAttendence,
  } = useAddCourseAttendence();
  const {
    mutate: deleteCourseAttendence,
    isPending: isLoadingDeleteCourseAttendence,
  } = useDeleteCourseAttendence();

  if (isLoadingCourseAttendences || isLoadingCourseBatchData)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  const events = courseAttendences?.data.map((attendence) => ({
    id: attendence.id,
    title: 'วันที่เรียน',
    start: attendence.attendence_date,
    allDay: true,
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  }));

  console.log(courseAttendences);

  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.date);
    const existingEvent = events?.find(
      (event) =>
        new Date(event.start).toDateString() === clickedDate.toDateString(),
    );

    if (existingEvent) {
      setSelectedEvent({ ...existingEvent, start: clickedDate });
    } else {
      setSelectedDate(clickedDate);
      setSelectedEvent(null);
    }
    setIsOpenModal(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setIsOpenModal(true);
  };

  const handleDelete = () => {
    if (window.confirm('คุณต้องการลบวันนี้หรือไม่?')) {
      deleteCourseAttendence(selectedEvent.id, {
        onSuccess: () => {
          toast.success('ลบวันที่เรียนสำเร็จ');
          refetchCourseAttendences();
          setIsOpenModal(false);
        },
        onError: (error) => {
          console.log(error);
          toast.error('ลบวันที่เรียนไม่สำเร็จ');
        },
      });
    }
  };

  const handleAdd = () => {
    console.log(selectedDate);
    addCourseAttendence(
      {
        course_group_id: Number(id),
        attendence_date: format(selectedDate, 'yyyy-MM-dd'),
      },
      {
        onSuccess: () => {
          setIsOpenModal(false);
          refetchCourseAttendences();
          toast.success(
            'เพิ่มวันที่เรียน ' +
              format(selectedDate, 'dd-MM-yyyy') +
              ' สำเร็จ',
          );
        },
        onError: (error) => {
          console.log(error);
          toast.error('เพิ่มวันที่เรียนไม่สำเร็จ');
        },
      },
    );
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          variant="text"
          className="mb-4 flex items-center gap-2 underline"
          onClick={() => navigate(-1)}
        >
          <IconArrowLeft className="w-4 h-4" /> <span>ย้อนกลับ</span>
        </Button>
      </div>
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700 font-notoLoopThaiRegular">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          {/* ข้อมูลหลักสูตร */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div>
                <h1 className="text-2xl font-notoExtraBold mb-2">
                  {courseBatchData?.data.course.course_name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
                  <span className="text-sm">
                    รุ่นที่ {courseBatchData?.data.batch}
                  </span>
                  <span className="text-sm">•</span>
                  <span className="text-sm">
                    {courseBatchData?.data.course.course_category.category_name}
                  </span>
                </div>
                <Button
                  className="bg-blue-500 text-white mt-2"
                  size="sm"
                  onClick={() =>
                    navigate(`/courses/batchs/${id}/attendence/bulk`)
                  }
                >
                  เช็คชื่อนักเรียนแบบหลายวัน
                </Button>
              </div>
              <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium whitespace-nowrap">
                {getStatusText(
                  courseBatchData?.data.date_start,
                  courseBatchData?.data.date_end,
                )}
              </span>
            </div>
          </div>
          {/* สถิติการเช็คชื่อ */}
          <div className="flex-1 lg:border-l lg:pl-6 pt-4 lg:pt-0 font-notoLoopThaiRegular">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  จำนวนนักเรียน
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {courseBatchData?.data.students_enrolled}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    / {courseBatchData?.data.max_students} คน
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  วันที่เรียนทั้งหมด
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {courseAttendences?.data.length || 0}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">วัน</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {format(
                  new Date(courseBatchData?.data.date_start),
                  'dd MMM yyyy',
                )}{' '}
                -{' '}
                {format(
                  new Date(courseBatchData?.data.date_end),
                  'dd MMM yyyy',
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto font-notoLoopThaiRegular">
        <div className="w-full bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-2">ตารางเรียน</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-red-500"> * </span>
            คลิกที่วันที่เรียนเพื่อจัดการวันที่เรียน
          </div>
          <StyleWrapper>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={thLocale}
              weekends={true}
              events={events}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth',
              }}
            />
          </StyleWrapper>
        </div>
        <Modal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          title="จัดการวันที่เรียน"
        >
          {selectedEvent ? (
            <>
              <h3>จัดการวันที่เรียน</h3>
              <p>{selectedEvent.start.toLocaleDateString('th-TH')}</p>
              <div className="flex justify-end gap-2 mt-4">
                {user?.role === 'admin' && (
                  <Button
                    color="red"
                    onClick={handleDelete}
                    loading={isLoadingDeleteCourseAttendence}
                  >
                    ลบวันที่เรียน
                  </Button>
                )}
                <Button
                  color="blue"
                  onClick={() =>
                    navigate(
                      `/courses/batchs/${id}/attendence/${selectedEvent.id}`,
                    )
                  }
                >
                  เช็คชื่อนักเรียน
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3>เพิ่มวันที่เรียน</h3>
              <p>{selectedDate?.toLocaleDateString('th-TH')}</p>
              <Button
                color="green"
                className="mt-4"
                onClick={handleAdd}
                loading={isLoadingAddCourseAttendence}
              >
                เพิ่มวันที่เรียน
              </Button>
            </>
          )}
        </Modal>
      </div>
    </>
  );
};

export default CourseBatchAttendencePage;
