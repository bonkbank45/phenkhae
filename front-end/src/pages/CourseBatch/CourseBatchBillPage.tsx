import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import PaginatedTable from '../../components/Tables/PaginatedTable';
import Pagination from '../../components/Pagination';

const CourseBatchBillPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/courses/batchs/${id}`);
  };

  return (
    <div>
      <h1>CourseBatchBillPage {id}</h1>
      <Button color="blue" onClick={handleBack}>
        กลับ
      </Button>
    </div>
  );
};

export default CourseBatchBillPage;
