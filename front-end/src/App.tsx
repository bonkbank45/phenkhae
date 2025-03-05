import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import AddStudent from './pages/Student/AddStudentPage';
import Prename from './pages/Manage/PrenameManagePage';
import AddPrename from './pages/Prename/AddPrename';
import AddCourse from './pages/Course/CourseManageForm/AddCourse';
import NotFound from './pages/NotFound';
import CourseManagePage from './pages/Course/CourseManagePage';
import AddCourseBatchIndexPage from './pages/OpenCourseBatch/AddCourseBatchIndexPage';
import CourseBatchAddStudent from './pages/OpenCourseBatch/CourseBatchAddStudentPage';
import CourseBatchListPage from './pages/CourseBatch/CourseBatchListPage';
import CourseBatchShowPage from './pages/CourseBatch/CourseBatchShowPage';
import CourseBatchRemoveStudentPage from './pages/OpenCourseBatch/CourseBatchRemoveStudentPage';
import StudentIndexPage from './pages/Student/StudentIndexPage';
import EditStudentPage from './pages/Student/EditStudentPage';
import StudentViewPage from './pages/Student/StudentViewPage';
import CourseBatchBillPage from './pages/CourseBatch/CourseBatchBillPage';
import CourseBatchGraduatePage from './pages/CourseBatch/CourseBatchGraduatePage';
import CoursePriceManagePage from './pages/Course/CoursePriceManagePage';
import CourseBatchAttendencePage from './pages/CourseBatch/CourseBatchAttendence/CourseBatchAttendencePage';
import CourseBatchAttendenceCheckPage from './pages/CourseBatch/CourseBatchAttendence/CourseBatchAttendenceCheckPage';
import CourseBatchAttendenceBulkPage from './pages/CourseBatch/CourseBatchAttendence/CourseBatchAttendenceBulkPage';
import AddStudentLicenseQualIndex from './pages/License/LicenseQual/AddStudentLicenseQualPage';
import StudentLicenseQualManagePage from './pages/License/LicenseQual/StudentLicenseQualManagePage';
import StudentLicenseCompleteManagePage from './pages/License/LicenseComplete/StudentLicenseCompleteManagePage';
import AddStudentLicenseCompletePage from './pages/License/LicenseComplete/AddStudentLicenseCompletePage';
import StudentLicensePdfPage from './pages/License/LicenseQual/StudentQualPdfPage';
import IndexStatistic from './pages/Statistic/IndexStatistic';
import CourseGraduateManagePage from './pages/Course/CourseGraduateManagePage';
import ManageAccount from './pages/Admin/ManageAccount';
import CreateAccount from './pages/Admin/CreateAccount';
import SetPassword from './pages/Authentication/SetPassword';
import CourseGraduatePdfPage from './pages/Course/CourseGraduatePdfPage';
import CourseBatchExamPage from './pages/CourseBatch/CourseBatchExam/CourseBatchExamPage';
import CourseBatchExamViewPage from './pages/CourseBatch/CourseBatchExam/CourseBatchExamViewPage';
import CourseBatchBillPaidPage from './pages/CourseBatch/CourseBatchBillPaidPage';
function App() {
  const { pathname } = useLocation();
  const { isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    document.getElementById('scroll-target')?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return authLoading ? (
    <Loader />
  ) : (
    <>
      <ToastContainer
        position="bottom-right"
        toastClassName="font-notoLoopThaiRegular"
      />
      <Routes>
        <Route
          path="/set-password"
          element={
            <>
              <PageTitle title="ตั้งรหัสผ่านผู้ใช้งาน - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
              <SetPassword />
            </>
          }
        />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        {/* { Protect all dashboard routes} */}
        <Route
          element={
            isAuthenticated ? (
              <DefaultLayout>
                <Outlet />
              </DefaultLayout>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        >
          <Route
            index
            element={
              <>
                <StudentIndexPage />
              </>
            }
          />
          <Route
            path="/calendar"
            element={
              <>
                <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Calendar />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Profile />
              </>
            }
          />
          <Route
            path="/forms/form-elements"
            element={
              <>
                <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <FormElements />
              </>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <FormLayout />
              </>
            }
          />
          <Route
            path="/tables"
            element={
              <>
                <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Tables />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Settings />
              </>
            }
          />
          <Route
            path="/chart"
            element={
              <>
                <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Chart />
              </>
            }
          />
          <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Buttons />
              </>
            }
          />
          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignIn />
              </>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignUp />
              </>
            }
          />
          <Route
            path="/students/list"
            element={
              <>
                <PageTitle title="รายชื่อนักเรียน | การจัดการนักเรียน - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <StudentIndexPage />
              </>
            }
          />
          <Route
            path="/students/:id/edit"
            element={
              <>
                <PageTitle title="แก้ไขนักเรียน | การจัดการนักเรียน - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <EditStudentPage />
              </>
            }
          />
          <Route
            path="/students/:id"
            element={
              <>
                <PageTitle title="รายละเอียดนักเรียน | การจัดการนักเรียน - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <StudentViewPage />
              </>
            }
          />
          <Route
            path="/students/add"
            element={
              <>
                <PageTitle title="เพิ่มนักเรียน | การจัดการนักเรียน - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <AddStudent />
              </>
            }
          />
          <Route
            path="/courses/list"
            element={
              <>
                <PageTitle title="หลักสูตรทั้งหมด | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseManagePage />
              </>
            }
          />
          <Route
            path="/courses/prices/list"
            element={
              <>
                <PageTitle title="กำหนดราคาขายหลักสูตร | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CoursePriceManagePage />
              </>
            }
          />
          <Route
            path="/settings/datas/prenames"
            element={
              <>
                <PageTitle title="คำนำหน้านาม | การจัดการข้อมูลพื้นฐาน - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <Prename />
              </>
            }
          />
          <Route
            path="/settings/datas/prenames/add"
            element={
              <>
                <PageTitle title="เพิ่มคำนำหน้านาม | การจัดการข้อมูลพื้นฐาน - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <AddPrename />
              </>
            }
          />
          <Route
            path="/courses/graduate/list"
            element={
              <>
                <PageTitle title="ผู้สำเร็จหลักสูตร | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseGraduateManagePage />
              </>
            }
          />
          <Route
            path="/courses/batchs/list"
            element={
              <>
                <PageTitle title="หลักสูตรตามรุ่น | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseBatchListPage />
              </>
            }
          />
          <Route
            path="/courses/batchs/:id"
            element={
              <>
                <PageTitle title="รายละเอียดรุ่นหลักสูตร | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseBatchShowPage />
              </>
            }
          />
          <Route
            path="/courses/batchs/add"
            element={
              <>
                <PageTitle title="เปิดรุ่นหลักสูตรใหม่ | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <AddCourseBatchIndexPage />
              </>
            }
          />
          <Route
            path="/courses/batchs/:id/add-students"
            element={
              <>
                <PageTitle title="เพิ่มนักเรียนเข้ารุ่น | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseBatchAddStudent />
              </>
            }
          />
          <Route
            path="/courses/batchs/:id/exams"
            element={
              <>
                <PageTitle title="จัดการการสอบ | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseBatchExamPage />
              </>
            }
          />
          <Route
            path="/courses/batchs/:id/exams/:examId"
            element={
              <>
                <PageTitle title="รายละเอียดการสอบ | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseBatchExamViewPage />
              </>
            }
          />
          <Route
            path="/courses/batchs/:id/graduate"
            element={
              <>
                <PageTitle title="สถานะการจบหลักสูตร | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseBatchGraduatePage />
              </>
            }
          />
          <Route
            path="/courses/batchs/:id/attendence"
            element={
              <>
                <PageTitle title="วันที่เรียนของรุ่น | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseBatchAttendencePage />
              </>
            }
          />
          <Route
            path="/courses/batchs/:id/attendence/:attendenceId"
            element={
              <>
                <PageTitle title="เช็คชื่อเข้าเรียนรายวัน | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseBatchAttendenceCheckPage />
              </>
            }
          />
          <Route
            path="/courses/batchs/:id/attendence/bulk"
            element={
              <>
                <PageTitle title="เช็คชื่อเข้าเรียนแบบภาพรวม | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseBatchAttendenceBulkPage />
              </>
            }
          />
          <Route
            path="/courses/batchs/:id/remove-students"
            element={
              <>
                <PageTitle title="ลบนักเรียนออกจากรุ่น | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseBatchRemoveStudentPage />
              </>
            }
          />
          <Route
            path="/courses/batchs/:id/bills"
            element={
              <>
                <PageTitle title="การจ่ายเงิน | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseBatchBillPage />
              </>
            }
          />
          <Route
            path="/courses/batchs/:id/bills/paid"
            element={
              <>
                <PageTitle title="การจ่ายเงิน | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseBatchBillPaidPage />
              </>
            }
          />
          <Route
            path="/courses/add"
            element={
              <>
                <PageTitle title="เพิ่มหลักสูตรใหม่ | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <AddCourse />
              </>
            }
          />
          <Route
            path="/manage/license_student/list"
            element={
              <>
                <PageTitle title="ผู้มีสิทธิสอบ | ใบประกอบวิชาชีพ - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <StudentLicenseQualManagePage />
              </>
            }
          />
          <Route
            path="/manage/license_student/list/pdf"
            element={
              <>
                <PageTitle title="พิมพ์รายชื่อผู้มีสิทธิสอบใบประกอบวิชาชีพ | ใบประกอบวิชาชีพ - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <StudentLicensePdfPage />
              </>
            }
          />
          <Route
            path="/manage/license_student/add"
            element={
              <>
                <PageTitle title="เพิ่มข้อมูลผู้มีสิทธิสอบ | ใบประกอบวิชาชีพ - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <AddStudentLicenseQualIndex />
              </>
            }
          />
          <Route
            path="/manage/license_student/completed/list"
            element={
              <>
                <PageTitle title="ผู้ได้รับใบประกอบวิชาชีพ | ใบประกอบวิชาชีพ - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <StudentLicenseCompleteManagePage />
              </>
            }
          />
          <Route
            path="/manage/license_student/completed/add"
            element={
              <>
                <PageTitle title="เพิ่มข้อมูลผู้ได้รับใบประกอบวิชาชีพ | ใบประกอบวิชาชีพ - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <AddStudentLicenseCompletePage />
              </>
            }
          />
          <Route
            path="/statistic"
            element={
              <>
                <PageTitle title="สถิติ | แดชบอร์ด - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <IndexStatistic />
              </>
            }
          />
          <Route
            path="/admin/manage-accounts"
            element={
              <>
                <PageTitle title="จัดการผู้ใช้งาน | แดชบอร์ด - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <ManageAccount />
              </>
            }
          />
          <Route
            path="/admin/create-account"
            element={
              <>
                <PageTitle title="สร้างผู้ใช้งาน | แดชบอร์ด - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CreateAccount />
              </>
            }
          />
          <Route
            path="/courses/graduate/list/pdf"
            element={
              <>
                <PageTitle title="พิมพ์รายชื่อผู้สำเร็จหลักสูตร | การจัดการหลักสูตร - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <CourseGraduatePdfPage />
              </>
            }
          />
          <Route
            path="*"
            element={
              <>
                <PageTitle title="404 | ไม่พบหน้าเว็บ - โรงเรียนเพ็ญแขแพทย์แผนไทย" />
                <NotFound />
              </>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
