import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStudentDataById } from '../../hooks/api/useStudentData';
import { format } from 'date-fns';
import Table from '../../components/Tables/Table';
import RoundRemoveRedEye from '../../common/RoundRemoveRedEye';
import IconEdit from '../../common/EditPen';
import IconCrossCircled from '../../common/CrossCircle';
import { OutlineFileDownload } from '../../common/Download';
import { getCourseStatus } from '../../utils/student';
import { usePdfRegisterStudent } from '../../hooks/api/usePdfData';

const StudentViewPage = () => {
  const { id } = useParams();
  const { data: studentData, isLoading } = useStudentDataById(Number(id));
  const [isClickDownload, setIsClickDownload] = useState(false);
  const { data: pdfData, isLoading: isPdfLoading } = usePdfRegisterStudent(
    id,
    isClickDownload,
  );

  useEffect(() => {
    if (isClickDownload) {
      setIsClickDownload(false);
    }
  }, [isClickDownload]);

  const imageUrl = studentData?.data.profile_image
    ? `${import.meta.env.VITE_API_URL}/storage/profiles/students/${
        studentData.data.profile_image
      }.jpg`
    : `${
        import.meta.env.VITE_API_URL
      }/storage/profiles/students/default-profile.png`;

  if (isLoading) return <div>Loading...</div>;

  const studentCourseDataTable =
    studentData?.data.enrollments?.map((enrollment) => ({
      course_name: enrollment.course_group?.course.course_name || '-',
      batch_name: `รุ่นที่ ${enrollment.course_group?.batch || '-'}`,
      course_status: getCourseStatus(
        enrollment.course_group?.course.start_date,
        enrollment.course_group?.course.end_date,
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
      render: (courseBatch) => courseBatch.case_status || '-',
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

  return (
    <>
      <div className="bg-white rounded-xl shadow p-4 dark:bg-boxdark">
        <div className="flex flex-col justify-between items-center gap-6 font-notoLoopThaiRegular">
          {/* กล่องข้อมูลส่วนตัวทั้งหมดจะมีความกว้าง 3 */}
          <div className="grid grid-cols-3 gap-4 w-full rounded-xl p-0 dark:bg-boxdark">
            {/* กล่องโปรไฟล์ในมือถือกว้าง 3/3 แต่ในคอมจะกว้าง 1/3 */}
            <div className="grid col-span-3 xl:col-span-1 justify-items-center gap-4 bg-white rounded-xl shadow p-4 dark:bg-boxdark">
              <div className="flex justify-center items-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Student"
                    className="w-50 h-50 rounded-full object-cover"
                  />
                ) : (
                  <p>No image</p>
                )}
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
                <IconEdit className="w-[1.6em] h-[1.6em] cursor-pointer" />
                <OutlineFileDownload
                  width="2em"
                  height="2em"
                  className="cursor-pointer"
                  onClick={() => setIsClickDownload(true)}
                />
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
                <p className="break-words font-bold">คลิกเพื่อดูรายละเอียด</p>
              </div>
              <h2 className="mt-4 col-span-4 text-xl font-bold">
                ประวัติการศึกษา
              </h2>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 2/4 คอลัมน์ */}
              <div className="grid grid-cols-2 col-span-4 xl:col-span-2 gap-2">
                <p>วุฒิการศึกษาสูงสุด</p>
                <p className="break-words font-bold">
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
                <p className="col-span-2 xl:col-span-3 break-words font-bold">
                  คลิกเพื่อดูรายละเอียด
                </p>
              </div>
              {/* ข้อมูลในมือถือกว้าง 4/4 คอลัมน์ ในคอมจะกว้าง 4/4 คอลัมน์ */}
              <div className="grid grid-cols-4 col-span-4 gap-2">
                <p className="col-span-2 xl:col-span-1">ประสบการณ์การนวด</p>
                <p className="col-span-2 xl:col-span-3 break-words font-bold">
                  คลิกเพื่อดูรายละเอียด
                </p>
              </div>
            </div>
          </div>
          <div className="w-full bg-white bg-opacity-80 rounded-xl shadow p-2 dark:bg-boxdark">
            <div className="flex flex-col lg:flex-row items-start gap-3 py-3 rounded-xl text-balance bg-gray-50 dark:bg-boxdark dark:border dark:border-gray-400">
              <button
                type="button"
                className=" border-gray-400 font-bold underline px-4 hover:text-black"
              >
                หลักสูตร
              </button>
              <button
                type="button"
                className="text-gray-400 px-4 hover:text-slate-500"
              >
                สถานะความพร้อมสอบใบประกอบวิชาชีพ
              </button>
              <button
                type="button"
                className="text-gray-400 px-4 hover:text-slate-500"
              >
                ใบเสร็จ
              </button>
            </div>
            <div className="mt-4">
              <Table
                data={studentCourseDataTable}
                columns={columnsCourseBatch}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentViewPage;
