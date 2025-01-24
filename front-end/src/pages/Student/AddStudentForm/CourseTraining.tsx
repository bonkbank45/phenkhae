import React, { useState } from 'react';
import CheckboxOne from '../../../components/Checkboxes/CheckboxOne';
import { useFormContext } from 'react-hook-form';
import { useCourseGroupEnrollmentData } from '../../../hooks/api/useCourseData';
import { useAvailableCourseBatchData } from '../../../hooks/api/useCourseBatchData';
import Spinner from '../../../common/Spinner';
import IconFaceSadTear from '../../../common/FaceSadTear';
import { getStatusColor } from '../../../utils/course_group';
import { getStatusText } from '../../../utils/course_group';
import { SelectableCourseBatchCard } from '../../../components/SelectableCourseBatchCard';
import { SelectableCourseBatchCardSkeleton } from './SelectableCourseBatchCardSkeleton';
import { CourseGroup } from '../../../types/course_group';

const CourseTraining = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const {
    data: availableCourseBatchData,
    isLoading: isLoadingAvailableCourseBatchData,
  } = useAvailableCourseBatchData();

  const [checkedState, setCheckedState] = useState<number[]>([]);

  const handleCheckboxChange = (courseOpeningId: number) => {
    if (checkedState.includes(courseOpeningId)) {
      const newCheckedState = checkedState.filter((id) => {
        return id !== courseOpeningId;
      });
      setCheckedState(newCheckedState);
      setValue('course_batch_id_register', newCheckedState);
    } else {
      const newCheckedState = [...checkedState, courseOpeningId];
      setCheckedState(newCheckedState);
      setValue('course_batch_id_register', newCheckedState);
    }
  };

  return (
    <div className="mt-4">
      <h1 className="mt-6 mb-6 text-4xl font-bold text-gray-700 dark:text-white font-notoExtraBold">
        ลงทะเบียนอบรมหลักสูตร
      </h1>
      <p className="mb-6 font-notoRegular text-sm text-gray-500 dark:text-white">
        <span className="text-red-500">* </span>
        หากยังไม่ต้องการลงทะเบียนอบรมหลักสูตร สามารถละเว้นไว้ได้
      </p>
      {isLoadingAvailableCourseBatchData ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded col-span-full mb-4"></div>
          {[...Array(6)].map((_, index) => (
            <SelectableCourseBatchCardSkeleton key={index} />
          ))}
        </div>
      ) : availableCourseBatchData?.data ? (
        Object.entries(availableCourseBatchData.data).map(
          ([categoryName, courses]: [string, CourseGroup[]]) => (
            <div key={categoryName}>
              <h2 className="mt-6 mb-4 text-xl font-bold font-notoExtraBold">
                {categoryName}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((batch) => (
                  <SelectableCourseBatchCard
                    key={batch.id}
                    batch={batch}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                    isSelected={checkedState.includes(batch.id)}
                    onSelect={(id) => handleCheckboxChange(id)}
                    disabled={batch.students_enrolled >= batch.max_students}
                  />
                ))}
              </div>
            </div>
          ),
        )
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
