import React from 'react';
import CertificatePerYear from './CertificatePerYear';
import StudentCourseBatchPerYear from './StudentCourseBatchPerYear';
import CourseCompletedPerYear from './CourseCompletedPerYear';
import CourseCompletedAndTakeCertPerYear from './CourseCompletedAndTakeCertPerYear';
import CourseLicenseCompletePerYear from './CourseLicenseCompletePerYear';

const IndexStatistic = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div
          id="header"
          className="bg-white rounded-lg py-4 px-6 scroll-mt-30 dark:bg-slate-800"
        >
          <h1 className="text-3xl font-bold font-notoExtraBold dark:text-white">
            สถิติหลักสูตร
          </h1>
          <ul className="ml-4 list-decimal font-notoLoopThaiRegular dark:text-white">
            <li>
              <a
                href="#student-batch"
                className="text-slate-500 hover:text-slate-700 dark:text-white"
              >
                สถิติจำนวนนักเรียนแต่ละหลักสูตร (รุ่นต่อปีแยกชาย-หญิง)
              </a>
            </li>
            <li>
              <a
                href="#course-completed"
                className="text-slate-500 hover:text-slate-700 dark:text-white"
              >
                สถิติจำนวนนักเรียนที่เรียนจบแต่ละหลักสูตร (รุ่นต่อปีแยกชาย-หญิง)
              </a>
            </li>
            <li>
              <a
                href="#certificate"
                className="text-slate-500 hover:text-slate-700 dark:text-white  "
              >
                สถิติจำนวนใบประกาศนียบัตรที่ได้ออกให้ในแต่ละปี
              </a>
            </li>
            <li>
              <a
                href="#course-cert"
                className="text-slate-500 hover:text-slate-700 dark:text-white"
              >
                สถิติจำนวนนักเรียนที่จบหลักสูตรและรับใบประกาศ
                (รุ่นต่อปีแยกชาย-หญิง)
              </a>
            </li>
            <li>
              <a
                href="#course-license"
                className="text-slate-500 hover:text-slate-700 dark:text-white"
              >
                สถิติจำนวนนักเรียนที่สอบได้ใบประกอบวิชาชีพของหลักสูตรที่ 7
                จนถึงหลักสูตร ที่ 10 (รุ่นต่อปีแยกชาย-หญิง)
              </a>
            </li>
          </ul>
        </div>

        <div id="student-batch" className="scroll-mt-30">
          <StudentCourseBatchPerYear />
        </div>
        <div id="course-completed" className="scroll-mt-30">
          <CourseCompletedPerYear />
        </div>
        <div id="certificate" className="scroll-mt-30">
          <CertificatePerYear />
        </div>
        <div id="course-cert" className="scroll-mt-30">
          <CourseCompletedAndTakeCertPerYear />
        </div>
        <div id="course-license" className="scroll-mt-30">
          <CourseLicenseCompletePerYear />
        </div>
      </div>
      <a href="#header" className="fixed bottom-4 right-4">
        <div
          className="bg-white p-3 rounded-full shadow-lg text-slate-500 hover:text-slate-700 
        font-notoLoopThaiRegular dark:bg-slate-800 dark:text-white dark:border dark:border-slate-600 dark:hover:bg-slate-700"
        >
          กลับสู่ด้านบน
        </div>
      </a>
    </>
  );
};

export default IndexStatistic;
