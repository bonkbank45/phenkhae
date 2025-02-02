import React from 'react';
import Modal from '../../../components/Modal';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'address' | 'surgery' | 'massage_exp';
  data: any; // ปรับ type ตามข้อมูลที่จะใช้จริง
}

const StudentDetailModal = ({
  isOpen,
  onClose,
  title,
  type,
  data,
}: StudentDetailModalProps) => {
  const renderContent = () => {
    switch (type) {
      case 'address':
        return (
          <div className="space-y-4 ">
            <div className="grid grid-cols-2 gap-2 overflow-hidden font-notoLoopThaiRegular">
              <p>บ้านเลขที่:</p>
              <p className="font-bold">{data?.address_num}</p>
              <p>หมู่ที่:</p>
              <p className="font-bold">{data?.address_moo}</p>
              <p>ตรอก/ซอย:</p>
              <p className="font-bold">{data?.address_soi || '-'}</p>
              <p>ถนน:</p>
              <p className="font-bold">{data?.address_road || '-'}</p>
              <p>ตำบล/แขวง:</p>
              <p className="font-bold">
                {data?.subdistrict.name_in_thai || '-'}
              </p>
              <p>อำเภอ/เขต:</p>
              <p className="font-bold">
                {data?.subdistrict.districts.name_in_thai || '-'}
              </p>
              <p>จังหวัด:</p>
              <p className="font-bold">
                {data?.subdistrict.districts.provinces.name_in_thai || '-'}
              </p>
              <p>รหัสไปรษณีย์ (จากข้อมูลของนักเรียนที่กรอก):</p>
              <p className="font-bold">{data?.address_zip_code || '-'}</p>
              <p>รหัสไปรษณีย์ (จากฐานข้อมูล):</p>
              <p className="font-bold">{data?.subdistrict.zip_code || '-'}</p>
            </div>
          </div>
        );
      case 'surgery':
        return (
          <div className="space-y-4 overflow-hidden ">
            <p className="font-notoLoopThaiRegular">
              {data?.surgery_history || 'ไม่มีประวัติการผ่าตัด'}
            </p>
          </div>
        );
      case 'massage_exp':
        return (
          <div className="space-y-4 overflow-hidden">
            <div className="flex flex-col gap-2">
              <div className="border-b border-gray-300 pb-2">
                <p className="text-md font-notoLoopThaiRegular">
                  {data.learn_massage
                    ? 'มีประสบการณ์การนวด'
                    : 'ไม่มีประสบการณ์การนวด'}
                </p>
                {data.learn_massage !== 0 && (
                  <p className="mt-2 text-sm font-notoLoopThaiRegular">
                    {'- '}
                    {data?.learn_massage_description || 'ไม่มีรายละเอียดการนวด'}
                  </p>
                )}
              </div>
              <p className="text-md font-notoLoopThaiRegular">
                {data.work_massage
                  ? 'เคยทำงานเกี่ยวกับการนวด'
                  : 'ไม่เคยทำงานเกี่ยวกับการนวด'}
              </p>
              {data.work_massage !== 0 && (
                <p className="mt-2 text-sm font-notoLoopThaiRegular">
                  {'- '}
                  {data?.work_massage_description || 'ไม่มีรายละเอียดการทำงาน'}
                </p>
              )}
            </div>
          </div>
        );
      default:
        return <p>ไม่พบข้อมูล</p>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {renderContent()}
    </Modal>
  );
};

export default StudentDetailModal;
