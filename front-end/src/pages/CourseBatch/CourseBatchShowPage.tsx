import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';

const CourseBatchShowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleAddStudent = () => {
    navigate(`/courses/batchs/${id}/add-students`);
  };

  return (
    <>
      <div>
        <h1>CourseBatchShowPage</h1>
      </div>
      <div>
        <Button color="blue" onClick={handleAddStudent}>
          เพิ่มนักเรียนเข้ารุ่นหลักสูตร
        </Button>
      </div>
    </>
  );
};

export default CourseBatchShowPage;
