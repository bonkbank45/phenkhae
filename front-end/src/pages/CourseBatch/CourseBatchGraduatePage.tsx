import React from 'react';
import { useParams } from 'react-router-dom';
const CourseBatchGraduatePage = () => {
  const { id } = useParams();
  return <div>CourseBatchGraduatePage {id}</div>;
};

export default CourseBatchGraduatePage;
