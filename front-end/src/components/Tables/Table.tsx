import React from 'react';
import Spinner from '../../common/Spinner';

export interface ColumnType<Type> {
  header: string;
  key: keyof Type | string;
  render?: (item: Type) => React.ReactNode;
}

interface TableProps<Type> {
  data: Type[];
  columns: ColumnType<Type>[];
  isLoading: boolean;
}

const Table = <Type extends object>({
  data,
  columns,
  isLoading,
}: TableProps<Type>): React.ReactNode => {
  return (
    <div className="w-full">
      <>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="py-4 px-4 font-medium font-notoExtraBold text-gray-500 dark:text-white"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="mt-4 mb-4 text-center font-notoRegular"
                  >
                    ไม่พบข้อมูล
                  </td>
                </tr>
              ) : (
                data.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-100 dark:hover:bg-meta-4 transition-colors duration-200"
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="border-b border-[#eee] py-3 px-4 dark:border-strokedark font-notoLoopThaiRegular"
                      >
                        {column.render
                          ? column.render(item)
                          : String(item[column.key as keyof Type])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
};

export default Table;
