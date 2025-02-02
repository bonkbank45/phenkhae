import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentDataById } from '../../hooks/api/useStudentData';
import { format } from 'date-fns';
import Table from '../../components/Tables/Table';
import RoundRemoveRedEye from '../../common/RoundRemoveRedEye';
import IconEdit from '../../common/EditPen';
import IconCrossCircled from '../../common/CrossCircle';
import { OutlineFileDownload } from '../../common/Download';
import { getCourseStatus } from '../../utils/student';
import { usePdfRegisterStudent } from '../../hooks/api/usePdfData';
import Spinner from '../../common/Spinner';
import StudentDetailModal from './StudentViewPageForm/StudentDetailModal';
import { getPaymentStatus } from '../../utils/bill_info';
import { FileAdditionOne } from '../../common/FileAdditionOne';
import Button from '@material-tailwind/react/components/Button';
import {
  getStudentLicenseQual,
  isCourseCanGetLicense,
} from '../../utils/student_license_qual';

const StudentViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedMenu, setSelectedMenu] = useState<
    'course' | 'certificate_after_end' | 'payment' | 'bill'
  >('course');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: studentData, isLoading: isStudentLoading } = useStudentDataById(
    Number(id),
  );
  const [modalType, setModalType] = useState<
    'address' | 'surgery' | 'massage_exp'
  >('address');
  const [isClickDownload, setIsClickDownload] = useState(false);
  const {} = usePdfRegisterStudent(id, isClickDownload);

  useEffect(() => {
    if (isClickDownload) {
      setIsClickDownload(false);
    }
  }, [isClickDownload]);

  const imageUrl = studentData?.data.profile_image
    ? `${import.meta.env.VITE_API_URL}/storage/profiles/students/${
        studentData.data.profile_image
      }.jpg?t=${new Date().getTime()}`
    : `${
        import.meta.env.VITE_API_URL
      }/storage/profiles/students/default-profile.png`;

  if (isStudentLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  const studentCourseDataTable =
    studentData?.data.enrollments?.map((enrollment) => ({
      course_name: enrollment.course_group?.course.course_name || '-',
      batch_name: `รุ่นที่ ${enrollment.course_group?.batch || '-'}`,
      course_status: getCourseStatus(
        enrollment.course_group?.date_start,
        enrollment.course_group?.date_end,
        enrollment.date_start,
        enrollment.date_end,
      ),
      enrollment_date: enrollment.enrollment_date
        ? format(new Date(enrollment.enrollment_date), 'dd/MM/yyyy')
        : '-',
      student_start_date: enrollment.date_start
        ? format(new Date(enrollment.date_start), 'dd/MM/yyyy')
        : '-',
      student_end_date: enrollment.date_end
        ? format(new Date(enrollment.date_end), 'dd/MM/yyyy')
        : '-',
      case_status:
        enrollment.activity_case_status === 0 ? 'ยังไม่ส่งเคส' : 'ส่งเคสแล้ว',
    })) || [];

  const columnsCourseBatch = [
    {
      header: 'ชื่อหลักสูตร',
      key: 'course_name',
      render: (courseBatch) => courseBatch.course_name || '-',
    },
    {
      header: 'รุ่นที่ลงทะเบียน',
      key: 'course_batch',
      render: (courseBatch) => courseBatch.batch_name || '-',
    },
    {
      header: 'สถานะการเรียน',
      key: 'course_status',
      render: (courseBatch) => courseBatch.course_status || '-',
    },
    {
      header: 'วันที่ลงทะเบียน',
      key: 'enrollment_date',
      render: (courseBatch) => courseBatch.enrollment_date || '-',
    },
    {
      header: 'วันที่เริ่มเรียน',
      key: 'student_start_date',
      render: (courseBatch) => courseBatch.student_start_date || '-',
    },
    {
      header: 'วันที่จบการศึกษา',
      key: 'student_end_date',
      render: (courseBatch) => courseBatch.student_end_date || '-',
    },
    {
      header: 'สถานะการส่งเคส',
      key: 'case_status',
      render: (courseBatch) =>
        courseBatch.case_status === 'ยังไม่ส่งเคส' ? (
          <p className="text-red-500">ยังไม่ส่งเคส</p>
        ) : (
          <p className="text-green-500">ส่งเคสแล้ว</p>
        ),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (courseBatch) => (
        <div className="flex items-center gap-2">
          <button>
            <RoundRemoveRedEye className="cursor-pointer w-5 h-5" />
          </button>
          <button>
            <IconEdit className="cursor-pointer w-5 h-5" />
          </button>
          <button>
            <IconCrossCircled className="cursor-pointer w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const licenseCourseDataTable = studentData?.data.enrollments?.map(
    (enrollment) => ({
      course_id: enrollment.course_group.course.id,
      course_name: enrollment.course_group.course.course_name,
      course_batch: enrollment.course_group.batch,
      license_qual: isCourseCanGetLicense(enrollment)
        ? 'ยังไม่พร้อมสอบใบประกอบวิชาชีพ'
        : 'หลักสูตรไม่สามารถสอบใบประกอบวิชาชีพได้',
    }),
  );

  const columnsCertificateAfterEnd = [
    {
      header: 'ไอดีหลักสูตร',
      key: 'course_id',
      render: (certificateAfterEnd) => certificateAfterEnd.course_id || '-',
    },
    {
      header: 'หลักสูตร',
      key: 'course_name',
      render: (certificateAfterEnd) => certificateAfterEnd.course_name || '-',
    },
    {
      header: 'รุ่นที่ลงทะเบียน',
      key: 'course_batch',
      render: (certificateAfterEnd) => certificateAfterEnd.course_batch || '-',
    },
    {
      header: 'สถานะความพร้อมสอบใบประกอบวิชาชีพ',
      key: 'license_qual',
      render: (certificateAfterEnd) =>
        certificateAfterEnd.license_qual === 'ยังไม่พร้อมสอบใบประกอบวิชาชีพ' ? (
          <p className="text-red-500">ยังไม่พร้อมสอบใบประกอบวิชาชีพ</p>
        ) : (
          <p className="text-yellow-500">
            หลักสูตรไม่สามารถสอบใบประกอบวิชาชีพได้
          </p>
        ),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (certificateAfterEnd) => (
        <div>
          {certificateAfterEnd.license_qual ===
          'ยังไม่พร้อมสอบใบประกอบวิชาชีพ' ? (
            <div className="flex items-center gap-2">
              <button>
                <RoundRemoveRedEye className="cursor-pointer w-5 h-5" />
              </button>
              <button>
                <IconEdit className="cursor-pointer w-5 h-5" />
              </button>
            </div>
          ) : (
            '-'
          )}
        </div>
      ),
    },
  ];

  const paymentDataTable = studentData?.data.enrollments?.map((enrollment) => ({
    course_id: enrollment.course_group?.course.id || '-',
    course_name: enrollment.course_group?.course.course_name || '-',
    course_batch: `รุ่นที่ ${enrollment.course_group?.batch || '-'}`,
    payment_status: getPaymentStatus(enrollment, studentData?.data.bill_infos)
      ? 'ชำระเงินแล้ว'
      : 'ยังไม่ชำระเงิน',
  }));

  const columnsPayment = [
    {
      header: 'ไอดีหลักสูตร',
      key: 'course_id',
      render: (enrollment) => enrollment.course_id || '-',
    },
    {
      header: 'หลักสูตร',
      key: 'course_name',
      render: (enrollment) => enrollment.course_name || '-',
    },
    {
      header: 'รุ่นที่ลงทะเบียน',
      key: 'course_batch',
      render: (enrollment) => enrollment.course_batch || '-',
    },
    {
      header: 'สถานะการชำระเงิน',
      key: 'payment_status',
      render: (bill) =>
        bill.payment_status === 'ชำระเงินแล้ว' ? (
          <p className="text-green-500">ชำระเงินแล้ว</p>
        ) : (
          <p className="text-red-500">ยังไม่ชำระเงิน</p>
        ),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (enrollment) => (
        <div className="flex items-center gap-2">
          {enrollment.payment_status === 'ชำระเงินแล้ว' ? (
            <button>
              <RoundRemoveRedEye className="cursor-pointer w-5 h-5" />
            </button>
          ) : null}
          <button>
            <FileAdditionOne
              className="cursor-pointer w-5 h-5"
              color="#808080"
            />
          </button>
          {getPaymentStatus(enrollment, studentData?.data.bill_infos) ? (
            <button>
              <IconCrossCircled className="cursor-pointer w-5 h-5" />
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-xl shadow p-4 dark:bg-boxdark">
        <div className="flex flex-col justify-between items-center gap-6 font-notoLoopThaiRegular">
          {/* กล่องข้อมูลส่วนตัวทั้งหมดจะมีความกว้าง 3 */}
          <div className="grid grid-cols-3 gap-4 w-full rounded-xl p-0 dark:bg-boxdark">
            {/* กล่องโปรไฟล์ในมือถือกว้าง 3/3 แต่ในคอมจะกว้าง 1/3 */}
            <div className="grid col-span-3 xl:col-span-1 justify-items-center gap-4 bg-white rounded-xl shadow p-4 dark:bg-boxdark">
              <div className="flex justify-center items-center">
                <img
                  src={imageUrl}
                  alt="Student"
                  className="w-60 h-60 rounded-full shadow-lg object-cover"
                />
              </div>
              <p className="text-center text-2xl font-bold">
                {studentData?.data.prename.prename_tha}{' '}
                {studentData?.data.firstname_tha}{' '}
                {studentData?.data.lastname_tha}
              </p>
            </div>
            {/* กล่องประวัติส่วนตัวในมือถือจะมีความกว้าง 3/3 แต่ในคอมจะกว้าง 2/3 และสร้างความกว้างอีก 4 สำหรับข้อมูลส่วนตัวด้านใน */}
            <div className="grid grid-cols-4 col-span-3 xl:col-span-2 gap-4 xl:gap-1 bg-white rounded-xl shadow p-4 dark:bg-boxdark">
              {/* หัวข้อจะกว้าง 4 ตลอด เพราะเป็นหัวข้อใหญ่ */}
              <h2 className="col-span-3 text-xl font-bold">ประวัติส่วนตัว</h2>
              <div className="col-span-1 flex justify-end items-center">
                <button onClick={() => navigate(`/students/${id}/edit`)}>
                  <IconEdit className="w-[1.6em] h-[1.6em] cursor-pointer" />
                </button>
                <button onClick={() => setIsClickDownload(true)}>
                  <OutlineFileDownload
                    width="2em"
                    height="2em"
                    className="cursor-pointer"
                  />
                </button>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-2 col-span-4 xl:col-span-2 gap-2">
                <p>เลขประจำตัวประชาชน</p>
                <p className="break-words font-bold">
                  {studentData?.data.citizenid_card}
                </p>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-2 col-span-4 xl:col-span-2 gap-2">
                <p>วัน/เดือน/ปีเกิด</p>
                <p className="break-words font-bold">
                  {format(new Date(studentData?.data.birthdate), 'dd/MM/yyyy')}
                </p>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-2 col-span-4 xl:col-span-2 gap-2">
                <p>อายุ</p>
                <p className="break-words font-bold">
                  {parseInt(format(new Date(), 'yyyy')) -
                    parseInt(
                      format(new Date(studentData?.data.birthdate), 'yyyy'),
                    )}
                </p>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-2 col-span-4 xl:col-span-2 gap-2">
                <p>สถานะภาพ</p>
                <p className="break-words font-bold">
                  {studentData?.data.marital_status.marital_name}
                </p>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-2 col-span-4 xl:col-span-2 gap-2">
                <p>อาชีพปัจจุบัน</p>
                <p className="break-words font-bold">
                  {studentData?.data.occupation.occupation_name}
                </p>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-2 col-span-4 xl:col-span-2 gap-2">
                <p>เบอร์โทรศัพท์</p>
                <p className="break-words font-bold">
                  {studentData?.data.phonenumber}
                </p>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-2 col-span-4 xl:col-span-2 gap-2">
                <p>สถานที่เกิด</p>
                <p className="break-words font-bold">
                  {studentData?.data.birth_province.name_in_thai}
                </p>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-4 col-span-4 gap-2">
                <p className="col-span-2 xl:col-span-1">โรคประจำตัว</p>
                <p className="col-span-2 xl:col-span-3 break-words font-bold">
                  {studentData?.data.medical_condition
                    ? studentData?.data.medical_condition.name
                    : '-'}
                </p>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-4 col-span-4 gap-2">
                <p className="col-span-2 xl:col-span-1">อีเมล์</p>
                <p className="col-span-2 xl:col-span-3 break-words font-bold">
                  {studentData?.data.email}
                </p>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-2 col-span-4 xl:col-span-2 gap-2">
                <p>ที่อยู่ปัจจุบัน</p>
                <button
                  onClick={() => {
                    setModalType('address');
                    setIsModalOpen(true);
                  }}
                  className="text-start font-bold hover:underline"
                >
                  คลิกเพื่อดูรายละเอียด
                </button>
              </div>
              <h2 className="mt-4 col-span-4 text-xl font-bold">
                ประวัติการศึกษา
              </h2>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-4 col-span-4 gap-2">
                <p className="col-span-2 xl:col-span-1">วุฒิการศึกษาสูงสุด</p>
                <p className="col-span-2 xl:col-span-3 break-words font-bold">
                  {studentData?.data.edu_qual.edu_qual_name}
                </p>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-4 col-span-4 gap-2">
                <p className="col-span-2 xl:col-span-1">จากสถานศึกษา</p>
                <p className="col-span-2 xl:col-span-3 break-words font-bold">
                  {studentData?.data.edu_ins}
                </p>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 4/4 คอลัมน์ */}
              <div className="grid grid-cols-4 col-span-4 gap-2">
                <p className="col-span-2 xl:col-span-1">ประวัติการผ่าตัด</p>
                <button
                  onClick={() => {
                    setModalType('surgery');
                    setIsModalOpen(true);
                  }}
                  className="col-span-2 xl:col-span-1 text-start font-bold hover:underline"
                >
                  คลิกเพื่อดูรายละเอียด
                </button>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 4/4 คอลัมน์ */}
              <div className="grid grid-cols-4 col-span-4 gap-2">
                <p className="col-span-2 xl:col-span-1">ประสบการณ์การนวด</p>
                <button
                  onClick={() => {
                    setModalType('massage_exp');
                    setIsModalOpen(true);
                  }}
                  className="col-span-2 xl:col-span-1 text-start font-bold hover:underline"
                >
                  คลิกเพื่อดูรายละเอียด
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-white bg-opacity-80 rounded-xl shadow p-2 dark:bg-boxdark">
            <div className="flex flex-col lg:flex-row items-start gap-3 py-3 rounded-xl text-balance bg-gray-50 dark:bg-boxdark dark:border dark:border-gray-400">
              <button
                type="button"
                className={`border-gray-400 px-4 hover:text-slate-500 ${
                  selectedMenu === 'course'
                    ? 'font-bold underline text-slate-500'
                    : 'text-gray-400'
                }`}
                onClick={() => setSelectedMenu('course')}
              >
                หลักสูตร
              </button>
              <button
                type="button"
                className={`px-4 hover:text-slate-500 ${
                  selectedMenu === 'certificate_after_end'
                    ? 'font-bold underline text-slate-500'
                    : 'text-gray-400'
                }`}
                onClick={() => setSelectedMenu('certificate_after_end')}
              >
                สถานะความพร้อมสอบใบประกอบวิชาชีพ
              </button>
              <button
                type="button"
                className={`px-4 hover:text-slate-500 ${
                  selectedMenu === 'payment'
                    ? 'font-bold underline text-slate-500'
                    : 'text-gray-400'
                }`}
                onClick={() => setSelectedMenu('payment')}
              >
                การชำระเงิน
              </button>
              <button
                type="button"
                className={`px-4 hover:text-slate-500 ${
                  selectedMenu === 'bill'
                    ? 'font-bold underline text-slate-500'
                    : 'text-gray-400'
                }`}
                onClick={() => setSelectedMenu('bill')}
              >
                ใบเสร็จ
              </button>
            </div>
            <div className="mt-4">
              {selectedMenu === 'payment' && (
                <Button
                  className="bg-green-500 text-white mb-4 px-4 py-2 rounded-md"
                  onClick={() => setIsModalOpen(true)}
                >
                  เพิ่มกลุ่มการจ่ายเงิน (กรณีหากจ่ายเงินพร้อมกันหลายหลักสูตร)
                </Button>
              )}
              <Table
                data={
                  selectedMenu === 'course'
                    ? studentCourseDataTable
                    : selectedMenu === 'certificate_after_end'
                    ? licenseCourseDataTable
                    : selectedMenu === 'payment'
                    ? paymentDataTable
                    : []
                }
                columns={
                  selectedMenu === 'course'
                    ? columnsCourseBatch
                    : selectedMenu === 'certificate_after_end'
                    ? columnsCertificateAfterEnd
                    : selectedMenu === 'payment'
                    ? columnsPayment
                    : []
                }
                isLoading={isStudentLoading}
              />
            </div>
          </div>
        </div>
        <StudentDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={studentData?.data}
          title="รายละเอียดข้อมูล"
          type={modalType}
        />
      </div>
    </>
  );
};

export default StudentViewPage;
