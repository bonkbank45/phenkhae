import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentDataById } from '../../hooks/api/useStudentData';
import { format } from 'date-fns';
import IconEdit from '../../common/EditPen';
import IconCrossCircled from '../../common/CrossCircle';
import RoundRemoveRedEye from '../../common/RoundRemoveRedEye';
import { OutlineFileDownload } from '../../common/Download';
import Spinner from '../../common/Spinner';
import { FileAdditionOne } from '../../common/FileAdditionOne';
import Table from '../../components/Tables/Table';
import { usePdfRegisterStudent } from '../../hooks/api/usePdfData';
import StudentDetailModal from './StudentViewPageForm/StudentDetailModal';
import CourseBatchBillAdd from '../CourseBatch/CourseBatchBillPageForm/CourseBatchBillAdd';
import CourseBatchBillEdit from '../CourseBatch/CourseBatchBillPageForm/CourseBatchBillEdit';
import CourseBatchBillDelete from '../CourseBatch/CourseBatchBillPageForm/CourseBatchBillDelete';
import CourseBatchBillView from '../CourseBatch/CourseBatchBillPageForm/CourseBatchBillView';
import EditEnrollmentForm from '../Enrollment/EditEnrollmentForm';
import DeleteEnrollmentForm from '../Enrollment/DeleteEnrollmentForm';
import { getCourseStatus } from '../../utils/student';
import { getPaymentStatus } from '../../utils/bill_info';
import { isCourseCanGetLicense } from '../../utils/student_license_qual';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import { SelectedStudentBillInfo } from '../../types/bill_info';
import { StudentCourseDataTable } from '../../types/enrollment';
import EditLicenseQual, {
  UpdateLicenseQualStudentProps,
} from '../License/LicenseQual/LicenseQualManageForm/EditLicenseQual';
import EditLicenseComplete, {
  UpdateLicenseCompleteStudentProps,
} from '../License/LicenseComplete/LicenseCompleteManageForm/EditLicenseComplete';
import { ErrorResponse } from '../../types/error_response';
import DeleteLicenseQual from '../License/LicenseQual/LicenseQualManageForm/DeleteLicenseQual';
import DeleteLicenseComplete from '../License/LicenseComplete/LicenseCompleteManageForm/DeleteLicenseComplete';

const StudentViewPage = () => {
  const navigate = useNavigate();
  const { id: studentId } = useParams();
  const [selectedCourseGroupId, setSelectedCourseGroupId] = useState<
    number | null
  >(null);

  const [selectedBillInfo, setSelectedBillInfo] =
    useState<SelectedStudentBillInfo | null>(null);

  const [selectedEnrollment, setSelectedEnrollment] =
    useState<StudentCourseDataTable | null>(null);

  const [selectedMenu, setSelectedMenu] = useState<
    'course' | 'certificate_after_end' | 'payment' | 'bill'
  >('course');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEnrollmentEdit, setIsModalEnrollmentEdit] = useState(false);
  const [isModalEnrollmentDelete, setIsModalEnrollmentDelete] = useState(false);
  const [isModalBillView, setIsModalBillView] = useState(false);
  const [isModalAddBill, setIsModalAddBill] = useState(false);
  const [isModalEditBill, setIsModalEditBill] = useState(false);
  const [isModalDeleteBill, setIsModalDeleteBill] = useState(false);
  const [isModalEditLicenseQual, setIsModalEditLicenseQual] = useState(false);
  const [isModalEditLicenseComplete, setIsModalEditLicenseComplete] =
    useState(false);
  const [isModalDeleteLicenseQual, setIsModalDeleteLicenseQual] =
    useState(false);
  const [isModalDeleteLicenseComplete, setIsModalDeleteLicenseComplete] =
    useState(false);
  const [selectedLicenseQualStudent, setSelectedLicenseQualStudent] =
    useState<UpdateLicenseQualStudentProps | null>(null);
  const [selectedLicenseCompleteStudent, setSelectedLicenseCompleteStudent] =
    useState<UpdateLicenseCompleteStudentProps | null>(null);
  const {
    data: studentData,
    isLoading: isStudentLoading,
    refetch: refetchStudentData,
  } = useStudentDataById(Number(studentId));
  const [modalType, setModalType] = useState<
    'address' | 'surgery' | 'massage_exp'
  >('address');

  const [isClickDownload, setIsClickDownload] = useState(false);
  const {} = usePdfRegisterStudent(studentId, isClickDownload);

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
      course_group_id: enrollment.course_group_id,
      student_id: enrollment.student_id,
      student_name: `${studentData.data.firstname_tha} ${studentData.data.lastname_tha}`,
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
      theoretical_score: enrollment.theoretical_score,
      practical_score: enrollment.practical_score,
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
          <button
            onClick={() => {
              navigate(`/courses/batchs/${courseBatch.course_group_id}`);
            }}
          >
            <RoundRemoveRedEye className="cursor-pointer w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setSelectedEnrollment(courseBatch);
              setIsModalEnrollmentEdit(true);
            }}
          >
            <IconEdit className="cursor-pointer w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setSelectedEnrollment(courseBatch);
              setIsModalEnrollmentDelete(true);
            }}
          >
            <IconCrossCircled className="cursor-pointer w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const licenseCourseDataTable = () => {
    // รวมข้อมูลจากทั้ง quals และ completes
    const allCourses = new Map();

    // เพิ่มข้อมูลจาก student_license_quals
    for (const qual of studentData?.data.student_license_quals ?? []) {
      allCourses.set(qual.course_group.course.id, {
        course_id: qual.course_group.course.id,
        course_name: qual.course_group.course.course_name,
        license_qual: `มีสิทธิ์สอบใบประกอบวิชาชีพ ตั้งแต่วันที่ ${format(
          new Date(qual.date_qualified),
          'dd/MM/yyyy',
        )}`,
        has_license: false,
        date_qualified: qual.date_qualified,
        license_qual_student_data: {
          id: qual.id,
          student_id: qual.student_id,
          course_group_id: qual.course_group.id,
          date_qualified: qual.date_qualified,
          firstname_tha: studentData?.data.firstname_tha,
          lastname_tha: studentData?.data.lastname_tha,
          course_name: qual.course_group.course.course_name,
        },
      });
    }

    // เพิ่มหรืออัพเดทข้อมูลจาก student_license_completes
    for (const complete of studentData?.data.student_license_completes ?? []) {
      allCourses.set(complete.course_group.course.id, {
        course_id: complete.course_group.course.id,
        course_name: complete.course_group.course.course_name,
        license_qual: `ได้รับใบประกอบวิชาชีพแล้ว เมื่อวันที่ ${format(
          new Date(complete.date_complete),
          'dd/MM/yyyy',
        )}`,
        has_license: true,
        date_complete: complete.date_complete,
        license_complete_student_data: {
          id: complete.id,
          student_id: complete.student_id,
          course_group_id: complete.course_group.id,
          date_complete: complete.date_complete,
          firstname_tha: studentData?.data.firstname_tha,
          lastname_tha: studentData?.data.lastname_tha,
          course_name: complete.course_group.course.course_name,
        },
      });
    }

    // แปลง Map เป็น Array และเรียงตามชื่อหลักสูตร
    return Array.from(allCourses.values()).sort((a, b) =>
      a.course_name.localeCompare(b.course_name),
    );
  };

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
      header: 'สถานะใบประกอบวิชาชีพ',
      key: 'license_qual',
      render: (certificateAfterEnd) =>
        certificateAfterEnd.has_license ? (
          <p className="text-green-500">{certificateAfterEnd.license_qual}</p>
        ) : (
          <p className="text-yellow-500">{certificateAfterEnd.license_qual}</p>
        ),
    },
    {
      header: 'จัดการ',
      key: 'action',
      render: (certificateAfterEnd) => (
        <div>
          {!certificateAfterEnd.has_license ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedLicenseQualStudent(
                    certificateAfterEnd.license_qual_student_data,
                  );
                  setIsModalEditLicenseQual(true);
                }}
              >
                <IconEdit className="cursor-pointer w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setSelectedLicenseQualStudent(
                    certificateAfterEnd.license_qual_student_data,
                  );
                  setIsModalDeleteLicenseQual(true);
                }}
              >
                <IconCrossCircled className="cursor-pointer w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedLicenseCompleteStudent(
                    certificateAfterEnd.license_complete_student_data,
                  );
                  setIsModalEditLicenseComplete(true);
                }}
              >
                <IconEdit className="cursor-pointer w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setSelectedLicenseCompleteStudent(
                    certificateAfterEnd.license_complete_student_data,
                  );
                  setIsModalDeleteLicenseComplete(true);
                }}
              >
                <IconCrossCircled className="cursor-pointer w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const paymentDataTable = studentData?.data.enrollments?.map((enrollment) => ({
    course_id: enrollment.course_group?.course.id || '-',
    course_name: enrollment.course_group?.course.course_name || '-',
    course_group_id: enrollment.course_group_id || '-',
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
            <>
              <button
                onClick={() => {
                  getSelectedStudentBillInfo(enrollment.course_group_id);
                  setIsModalBillView(true);
                }}
              >
                <RoundRemoveRedEye className="cursor-pointer w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  getSelectedStudentBillInfo(enrollment.course_group_id);
                  setIsModalEditBill(true);
                }}
              >
                <IconEdit className="cursor-pointer w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  getSelectedStudentBillInfo(enrollment.course_group_id);
                  setIsModalDeleteBill(true);
                }}
              >
                <IconCrossCircled className="cursor-pointer w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setSelectedCourseGroupId(enrollment.course_group_id);
                setIsModalAddBill(true);
              }}
            >
              <FileAdditionOne
                className="cursor-pointer w-5 h-5"
                color="#808080"
              />
            </button>
          )}
        </div>
      ),
    },
  ];

  const getSelectedStudentBillInfo = (courseGroupId: number) => {
    const bill = studentData?.data.bill_infos.find(
      (bill) => bill.course_group_id === courseGroupId,
    );
    const courseBatch = studentData?.data.enrollments.find(
      (enrollment) => enrollment.course_group_id === bill.course_group_id,
    );
    setSelectedBillInfo({
      firstname_tha: studentData?.data.firstname_tha,
      lastname_tha: studentData?.data.lastname_tha,
      enrollment_date: courseBatch?.enrollment_date,
      enrollment_date_start: courseBatch?.enrollment_date_start,
      enrollment_date_end: courseBatch?.enrollment_date_end,
      enrollment_created_at: courseBatch?.enrollment_created_at,
      enrollment_updated_at: courseBatch?.enrollment_updated_at,
      activity_case_status: courseBatch?.activity_case_status,
      id: bill.id,
      bill_infos_vol: bill.vol,
      bill_infos_no: bill.no,
      bill_infos_date: bill.date_submit,
      bill_infos_receiver: bill.bill_receiver,
      bill_infos_note: bill.note,
      course_group_id: bill.course_group_id,
      student_id: bill.student_id,
      created_at: bill.created_at,
      updated_at: bill.updated_at,
    });
  };

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
                <button onClick={() => navigate(`/students/${studentId}/edit`)}>
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
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 4/4 คอลัมน์ */}
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
                เอกสารใบเสร็จ
              </button>
            </div>
            <div className="mt-4">
              <Table
                data={
                  selectedMenu === 'course'
                    ? studentCourseDataTable
                    : selectedMenu === 'certificate_after_end'
                    ? licenseCourseDataTable()
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
        <Modal
          isOpen={isModalEnrollmentEdit}
          onClose={() => setIsModalEnrollmentEdit(false)}
          title="แก้ไขการสมัครหลักสูตร"
        >
          <EditEnrollmentForm
            enrollment={selectedEnrollment}
            onSuccess={() => {
              setIsModalEnrollmentEdit(false);
              refetchStudentData();
              toast.success('แก้ไขข้อมูลการลงทะเบียนรุ่นหลักสูตรเรียบร้อย');
            }}
            onError={(error) => {
              setIsModalEnrollmentEdit(false);
              toast.error(error.message);
            }}
          />
        </Modal>
        <Modal
          isOpen={isModalEnrollmentDelete}
          onClose={() => setIsModalEnrollmentDelete(false)}
          title="ลบการสมัครหลักสูตร"
        >
          <DeleteEnrollmentForm
            enrollmentInfo={selectedEnrollment}
            onSuccess={() => {
              setIsModalEnrollmentDelete(false);
              refetchStudentData();
              toast.success('ลบการสมัครหลักสูตรเรียบร้อย');
            }}
            onError={() => {
              setIsModalEnrollmentDelete(false);
              toast.error('ลบการสมัครหลักสูตรไม่สำเร็จ');
            }}
            onClose={() => setIsModalEnrollmentDelete(false)}
          />
        </Modal>
        {selectedLicenseQualStudent && (
          <>
            <Modal
              isOpen={isModalEditLicenseQual}
              onClose={() => setIsModalEditLicenseQual(false)}
              title="แก้ไขวันที่มีสิทธิสอบใบประกอบวิชาชีพ"
            >
              <EditLicenseQual
                selectedLicenseQualStudent={selectedLicenseQualStudent}
                onSuccess={() => {
                  toast.success(
                    'แก้ไขวันที่มีสิทธิสอบใบประกอบวิชาชีพเรียบร้อย',
                  );
                  setIsModalEditLicenseQual(false);
                  refetchStudentData();
                }}
                onError={(error: ErrorResponse) => {
                  toast.error(error.message);
                  setIsModalEditLicenseQual(false);
                }}
              />
            </Modal>
            <Modal
              isOpen={isModalDeleteLicenseQual}
              onClose={() => setIsModalDeleteLicenseQual(false)}
              title="ลบวันที่มีสิทธิสอบใบประกอบวิชาชีพ"
            >
              <DeleteLicenseQual
                selectedLicenseQualStudent={selectedLicenseQualStudent}
                onSuccess={() => {
                  setIsModalDeleteLicenseQual(false);
                  refetchStudentData();
                  toast.success('ลบวันที่มีสิทธิสอบใบประกอบวิชาชีพเรียบร้อย');
                }}
                onError={(error: ErrorResponse) => {
                  toast.error(error.message);
                  setIsModalDeleteLicenseQual(false);
                }}
                onClose={() => setIsModalDeleteLicenseQual(false)}
              />
            </Modal>
          </>
        )}
        {selectedLicenseCompleteStudent && (
          <>
            <Modal
              isOpen={isModalEditLicenseComplete}
              onClose={() => setIsModalEditLicenseComplete(false)}
              title="แก้ไขวันที่ได้รับใบประกอบวิชาชีพ"
            >
              <EditLicenseComplete
                selectedLicenseCompleteStudent={selectedLicenseCompleteStudent}
                onSuccess={() => {
                  toast.success('แก้ไขวันที่ได้รับใบประกอบวิชาชีพเรียบร้อย');
                  setIsModalEditLicenseComplete(false);
                  refetchStudentData();
                }}
                onError={(error: ErrorResponse) => {
                  toast.error(error.message);
                  setIsModalEditLicenseComplete(false);
                }}
              />
            </Modal>
            <Modal
              isOpen={isModalDeleteLicenseComplete}
              onClose={() => setIsModalDeleteLicenseComplete(false)}
              title="ลบวันที่ได้รับใบประกอบวิชาชีพ"
            >
              <DeleteLicenseComplete
                selectedLicenseCompleteStudent={selectedLicenseCompleteStudent}
                onSuccess={() => {
                  setIsModalDeleteLicenseComplete(false);
                  refetchStudentData();
                  toast.success('ลบวันที่ได้รับใบประกอบวิชาชีพเรียบร้อย');
                }}
                onError={(error: ErrorResponse) => {
                  toast.error(error.message);
                  setIsModalDeleteLicenseComplete(false);
                }}
                onClose={() => setIsModalDeleteLicenseComplete(false)}
              />
            </Modal>
          </>
        )}
        <Modal
          isOpen={isModalAddBill}
          onClose={() => setIsModalAddBill(false)}
          title="เพิ่มใบเสร็จ"
        >
          <CourseBatchBillAdd
            onSuccess={() => {
              setIsModalAddBill(false);
              refetchStudentData();
              toast.success('เพิ่มใบเสร็จเรียบร้อย');
            }}
            onError={() => {
              setIsModalAddBill(false);
              toast.error('เพิ่มใบเสร็จไม่สำเร็จ');
            }}
            courseGroupId={selectedCourseGroupId}
            studentId={Number(studentId)}
          />
        </Modal>
        <Modal
          isOpen={isModalBillView}
          onClose={() => setIsModalBillView(false)}
          title="รายละเอียดใบเสร็จ"
        >
          <CourseBatchBillView
            vol={selectedBillInfo?.bill_infos_vol}
            no={selectedBillInfo?.bill_infos_no}
            studentId={Number(studentId)}
          />
        </Modal>
        <Modal
          isOpen={isModalEditBill}
          onClose={() => setIsModalEditBill(false)}
          title="แก้ไขใบเสร็จ"
        >
          <CourseBatchBillEdit
            studentBillInfo={selectedBillInfo}
            onSuccess={() => {
              setIsModalEditBill(false);
              refetchStudentData();
              toast.success('แก้ไขใบเสร็จเรียบร้อย');
            }}
            onError={() => {
              setIsModalEditBill(false);
              toast.error('แก้ไขใบเสร็จไม่สำเร็จ');
            }}
          />
        </Modal>
        <Modal
          isOpen={isModalDeleteBill}
          onClose={() => setIsModalDeleteBill(false)}
          title="ลบใบเสร็จ"
        >
          <CourseBatchBillDelete
            studentBillInfo={selectedBillInfo}
            onSuccess={() => {
              setIsModalDeleteBill(false);
              refetchStudentData();
              toast.success('ลบใบเสร็จเรียบร้อย');
            }}
            onError={() => {
              setIsModalDeleteBill(false);
              toast.error('ลบใบเสร็จไม่สำเร็จ');
            }}
            onClose={() => setIsModalDeleteBill(false)}
          />
        </Modal>
      </div>
    </>
  );
};

export default StudentViewPage;
