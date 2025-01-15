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

function App() {
  const { pathname } = useLocation();
  const { isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return authLoading ? (
    <Loader />
  ) : (
    <>
      <ToastContainer position="bottom-right" />
      <Routes>
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
                <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <ECommerce />
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
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/courses/list" element={<CourseManagePage />} />
          <Route path="/settings/datas/prenames" element={<Prename />} />
          <Route path="/settings/datas/prenames/add" element={<AddPrename />} />
          <Route
            path="/courses/batchs/list"
            element={<CourseBatchListPage />}
          />
          <Route path="/courses/batchs/:id" element={<CourseBatchShowPage />} />
          <Route
            path="/courses/batchs/add"
            element={<AddCourseBatchIndexPage />}
          />
          <Route
            path="/courses/batchs/:id/add-students"
            element={<CourseBatchAddStudent />}
          />
          <Route path="/courses/add" element={<AddCourse />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
