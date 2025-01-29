export const getCourseStatus = (
  batchStart: string,
  batchEnd: string,
  studentDateStart: string,
  studentDateEnd: string | null,
) => {
  const now = new Date();
  const start = new Date(batchStart);
  const end = new Date(batchEnd);
  const studentStart = new Date(studentDateStart);
  const studentEnd = studentDateEnd ? new Date(studentDateEnd) : null;

  if (now < studentStart) {
    return (
      <span className="text-gray-500 font-notoLoopThaiRegular">
        ยังไม่เริ่มเรียน
      </span>
    );
  } else if (
    now >= studentStart &&
    (studentEnd === null || now <= studentEnd)
  ) {
    if (now <= end) {
      return (
        <span className="text-green-500 font-notoLoopThaiRegular">
          กำลังเรียน
        </span>
      );
    } else {
      return (
        <span className="text-red-500 font-notoLoopThaiRegular">
          กำลังเรียน (เลยกำหนดการวันเรียนจบของหลักสูตร)
        </span>
      );
    }
  } else {
    return (
      <span className="text-red-500 font-notoLoopThaiRegular">เรียนจบ</span>
    );
  }
};
