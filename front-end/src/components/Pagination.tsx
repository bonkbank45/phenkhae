import { Button } from '@material-tailwind/react';
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isFetching: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  from,
  to,
  total,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  isFetching,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const showAround = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - showAround && i <= currentPage + showAround)
      ) {
        pageNumbers.push(i);
      } else if (
        i === currentPage - showAround - 1 ||
        i === currentPage + showAround + 1
      ) {
        pageNumbers.push('...');
      }
    }
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="text-sm text-gray-500 font-notoLoopThaiRegular">
        กำลังแสดงข้อมูล {from === null ? '0' : from} ถึง{' '}
        {to === null ? '0' : to} จาก {total === null ? '0' : total} ทั้งหมด
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage || isFetching}
          className={`px-4 py-2 rounded ${
            !hasPrevPage
              ? 'bg-gray-100 dark:bg-boxdark text-gray-400'
              : 'bg-primary dark:bg-boxdark text-white hover:bg-primary/80'
          } font-notoLoopThaiRegular`}
        >
          ก่อนหน้า
        </Button>
        {getPageNumbers().map((pageNum, index) => (
          <Button
            key={index}
            onClick={() => pageNum !== '...' && onPageChange(pageNum)}
            disabled={pageNum === '...'}
            className={`px-4 py-2 rounded ${
              pageNum === currentPage
                ? 'bg-primary dark:bg-boxdark text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-500 dark:bg-boxdark dark:hover:bg-gray-250'
            } font-notoLoopThaiRegular`}
          >
            {pageNum}
          </Button>
        ))}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || isFetching}
          className={`px-4 py-2 rounded ${
            !hasNextPage
              ? 'bg-gray-100 dark:bg-boxdark text-gray-400'
              : 'bg-primary dark:bg-boxdark text-white hover:bg-primary/80'
          } font-notoLoopThaiRegular`}
        >
          ถัดไป
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
