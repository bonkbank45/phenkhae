import { Enrollment } from '../types/enrollment';

function isCourseCanGetLicense(enrollment: Enrollment) {
  const courseCanGetLicense = [7, 8, 9, 10];
  return courseCanGetLicense.includes(enrollment.course_group.course.id);
}

function getStudentLicenseQual(enrollment) {
  return enrollment.student.license_qual;
}

export { getStudentLicenseQual, isCourseCanGetLicense };
