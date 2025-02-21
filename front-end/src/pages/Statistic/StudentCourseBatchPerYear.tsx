import { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useCourseGroupStatistics } from '../../hooks/api/useStatisticData';

interface BatchData {
  batch: number;
  male: number;
  female: number;
}

const StudentCourseBatchPerYear = () => {
  const { data, isLoading } = useCourseGroupStatistics();
  const [selectedYear, setSelectedYear] = useState<number>();

  // สร้าง dropdown options จากข้อมูลที่มี และเลือกปีแรกอัตโนมัติ
  const years = useMemo(() => {
    if (!data?.data) return [];
    const availableYears = data.data.map((item) => item.year);
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0]);
    }
    return availableYears;
  }, [data, selectedYear]);

  // สร้างข้อมูลสำหรับ chart
  const chartData = useMemo(() => {
    if (!data?.data || !selectedYear) return null;

    const yearData = data.data.find((item) => item.year === selectedYear);
    if (!yearData) return null;

    // เตรียมข้อมูลสำหรับ series
    const categories = [];
    const maleData = [];
    const femaleData = [];

    Object.entries(yearData.courses).forEach(
      ([courseName, batches]: [string, BatchData[]]) => {
        batches.forEach((batch) => {
          categories.push(`${courseName}\n(รุ่น ${batch.batch})`);
          maleData.push(batch.male);
          femaleData.push(batch.female);
        });
      },
    );

    return {
      options: {
        chart: {
          type: 'bar' as const,
          height: 350,
          stacked: true,
        },
        colors: ['#2E93fA', '#FF69B4'], // กำหนดสี: น้ำเงินสำหรับผู้ชาย, ชมพูสำหรับผู้หญิง
        plotOptions: {
          bar: {
            horizontal: false, // เปลี่ยนเป็น false เพื่อให้แสดงแนวตั้ง
            borderRadius: 4,
            borderRadiusApplication: 'end' as const,
          },
        },
        dataLabels: {
          enabled: true,
        },
        xaxis: {
          categories: categories,
          labels: {
            rotate: -45, // หมุนป้ายกำกับเพื่อให้อ่านง่ายขึ้น
            style: {
              fontSize: '12px',
            },
          },
        },
        yaxis: {
          title: {
            text: 'จำนวนนักเรียน',
          },
        },
        legend: {
          position: 'right' as const,
        },
        responsive: [
          {
            breakpoint: 1000,
            options: {
              legend: {
                position: 'bottom' as const,
              },
            },
          },
        ],
      },
      series: [
        {
          name: 'ชาย',
          data: maleData,
        },
        {
          name: 'หญิง',
          data: femaleData,
        },
      ],
    };
  }, [data, selectedYear]);

  if (isLoading)
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="text-center p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-[400px] bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-slate-800">
        <div className="text-center p-8">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg text-gray-600 font-notoLoopThaiRegular">
            ไม่มีข้อมูลสถิติจำนวนนักเรียนในระบบ
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-slate-800">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold font-notoExtraBold dark:text-white">
            สถิติจำนวนนักเรียนแต่ละหลักสูตร (รุ่นต่อปีแยกชาย-หญิง)
          </h2>

          <div className="mt-4 md:mt-0">
            <select
              className="w-48 p-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg 
                         shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                         transition-all duration-200 hover:border-gray-400 font-notoLoopThaiRegular dark:text-white dark:bg-slate-700 dark:border-slate-600"
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  ปีการศึกษา {year + 543}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 min-h-[400px] flex items-center justify-center dark:bg-slate-800">
          {chartData ? (
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={350}
              className="w-full"
            />
          ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm dark:bg-slate-800">
              <div className="font-notoLoopThaiRegular text-lg text-gray-600">
                <div className="space-y-2">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>ไม่พบข้อมูลในปีการศึกษาที่เลือก</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCourseBatchPerYear;
