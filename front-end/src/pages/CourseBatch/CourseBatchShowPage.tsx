import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';

const CourseBatchShowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleAddStudent = () => {
    navigate(`/courses/batchs/${id}/add-students`);
  };

  const handleRemoveStudent = () => {
    navigate(`/courses/batchs/${id}/remove-students`);
  };

  const handleBill = () => {
    navigate(`/courses/batchs/${id}/bills`);
  };

  return (
    <>
      <div>
        <h1>CourseBatchShowPage</h1>
      </div>
      <div className="flex justify-end gap-2">
        <Button color="blue" onClick={handleAddStudent}>
          เพิ่มนักเรียนเข้ารุ่นหลักสูตร
        </Button>
        <Button color="red" onClick={handleRemoveStudent}>
          ลบนักเรียนออกจากรุ่นหลักสูตร
        </Button>
        <Button color="green" onClick={handleBill}>
          การจ่ายเงิน
        </Button>
      </div>
    </>
  );
};

export default CourseBatchShowPage;
