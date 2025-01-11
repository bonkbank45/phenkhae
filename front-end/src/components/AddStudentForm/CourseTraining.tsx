import React, { useState } from 'react';
import CheckboxOne from '../Checkboxes/CheckboxOne';
import { useFormContext } from 'react-hook-form';
import { useCourseGroupEnrollmentData } from '../../hooks/api/useCourseData';
import Spinner from '../../common/Spinner';
import IconFaceSadTear from '../../common/FaceSadTear';

interface Course {
  course_name: string;
  course_batch: number;
  max_students: number;
  students_enrolled: number;
}

const CourseTraining = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { courseGroupEnrollmentData = { data: {} }, isLoading } =
    useCourseGroupEnrollmentData();

  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>(
    {},
  );
  const handleCheckboxChange = (courseOpeningId: string) => {
    const newCheckedState = {
      ...checkedState,
      [courseOpeningId]: !checkedState[courseOpeningId],
    };
    setCheckedState(newCheckedState);
    setValue(
      'course_training',
      Object.keys(newCheckedState).reduce((acc, key) => {
        if (newCheckedState[key]) {
          acc[key] = true;
        }
        return acc;
      }, {}),
    );
  };

  console.log(checkedState);

  return (
    <div className="mt-4">
      <h1 className="mt-6 mb-6 text-4xl font-bold text-black dark:text-white font-notoExtraBold">
        ลงทะเบียนอบรมหลักสูตร
      </h1>
      <p className="mb-6 font-notoRegular text-sm text-gray-500 dark:text-white">
        <span className="text-red-500">* </span>
        หากยังไม่ต้องการลงทะเบียนอบรมหลักสูตร สามารถละเว้นไว้ได้
      </p>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : courseGroupEnrollmentData === null ? (
        <h2 className="text-2xl text-black font-notoRegular">
          {Object.entries(courseGroupEnrollmentData?.data || {}).map(
            ([categoryName, courses]) => (
              <div key={categoryName}>
                <div className="mt-6 mb-6">
                  {categoryName} {'( รุ่นที่เปิดลงทะเบียนในขณะนี้ )'}
                </div>
                <div>
                  {(courses as Course[]).map((course) => (
                    <div
                      key={course.course_name + '-' + course.course_batch}
                      className="text-xl font-notoLoopThaiRegular text-gray-500"
                    >
                      <CheckboxOne
                        name={course.course_name + '-' + course.course_batch}
                        id={course.course_name + '-' + course.course_batch}
                        label={
                          course.course_name +
                          ' รุ่นที่ ' +
                          course.course_batch +
                          ' จำนวนผู้ลงทะเบียนในขณะนี้ [' +
                          course.students_enrolled +
                          '/' +
                          course.max_students +
                          ']'
                        }
                        checked={
                          checkedState[
                            course.course_name + '-' + course.course_batch
                          ] || false
                        }
                        className="ml-4"
                        onChange={() =>
                          handleCheckboxChange(
                            course.course_name + '-' + course.course_batch,
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </h2>
      ) : (
        <div className="flex justify-center items-center space-x-4 mt-10 mb-10 bg-white/50 rounded-lg p-4">
          <h2 className="text-2xl text-gray-500 dark:text-white font-notoRegular">
            ไม่พบข้อมูลหลักสูตรที่เปิดให้ลงทะเบียนในขณะนี้
          </h2>
          <IconFaceSadTear height="4rem" width="4rem" />
        </div>
      )}
    </div>
  );
};

export default CourseTraining;
