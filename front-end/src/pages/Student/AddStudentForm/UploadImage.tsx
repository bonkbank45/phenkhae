import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import IconBxsUserCircle from '../../../common/BxsUserCircle';
import AttachFile from '../../../components/Forms/AttachFile';
import CloseIcon from '../../../common/CloseIcon';
import Modal from '../../../components/Modal';
import Button from '@material-tailwind/react/components/Button';
import { Spinner } from '@material-tailwind/react';
const UploadImage = ({
  haveProfileImage = false,
  isEditMode = false,
  studentId,
}: {
  haveProfileImage: boolean;
  isEditMode: boolean;
  studentId: string;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setValue } = useFormContext();

  useEffect(() => {
    if (isEditMode && haveProfileImage) {
      const imageUrl = `${
        import.meta.env.VITE_API_URL
      }/storage/profiles/students/student_profile_image_${studentId}.jpg`;
      console.log(imageUrl);
      setImagePreview(imageUrl);
    }
  }, [isEditMode, studentId]);

  const handleImageChange = (file: File) => {
    console.log('File received:', file); // เพิ่ม log เพื่อตรวจสอบไฟล์ที่ได้รับ
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('File read complete'); // เพิ่ม log เพื่อตรวจสอบการอ่านไฟล์
      setImagePreview(reader.result as string);
      setValue('is_remove_image', false);
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    if (file) {
      reader.readAsDataURL(file);
      if (file instanceof File) {
        setValue('profile_image', file);
      } else {
        console.error('Invalid file type');
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setIsModalOpen(false);
    setValue('profile_image', null);
    setValue('is_remove_image', true);
  };

  return (
    <>
      <h1 className="mt-6 mb-6 text-4xl font-bold text-black font-notoExtraBold dark:text-white">
        อัปโหลดรูปภาพประจำตัว
      </h1>
      {!isEditMode && (
        <p className="mb-6 font-notoRegular text-sm text-gray-500 dark:text-white">
          <span className="text-red-500">* </span>หากยังไม่มีรูปภาพประจำตัว
          สามารถอัปโหลดในภายหลังได้
        </p>
      )}
      <div className="flex flex-col gap-2 justify-center items-center">
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Image Preview"
              className="w-100 h-100 object-cover rounded-lg"
            />
            <button
              type="button"
              className="absolute top-0 right-0 text-red-500 font-notoRegular"
              onClick={() => setIsModalOpen(true)}
            >
              <CloseIcon w={40} h={40} />
            </button>
          </div>
        ) : (
          <IconBxsUserCircle height="20em" width="20em" />
        )}
        <AttachFile
          label="เลือกรูปภาพผู้ใช้งาน (ต้องเป็นไฟล์รูปภาพ jpeg,png,jpg ขนาดไม่เกิน 10MB)"
          onChange={(file) => handleImageChange(file)}
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="ลบรูปภาพ"
      >
        <p className="text-slate-500 font-notoLoopThaiRegular overflow-y-hidden">
          คุณต้องการลบรูปภาพประจำตัวของนักเรียนหรือไม่?
        </p>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            className="bg-blue-500 dark:bg-white dark:text-black font-notoLoopThaiRegular text-white rounded disabled:bg-blue-300"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">ยกเลิก</span>
            </div>
          </Button>
          <Button
            type="button"
            className="bg-red-500 dark:bg-white dark:text-black font-notoLoopThaiRegular text-white rounded disabled:bg-blue-300"
            onClick={handleRemoveImage}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">ลบ</span>
            </div>
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default UploadImage;
