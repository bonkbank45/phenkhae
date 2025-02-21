import { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useCourseCompletedAndTakeCertificateStatistic } from '../../hooks/api/useStatisticData';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
interface BatchData {
  batch: number;
  male: number;
  female: number;
  certificate_date: string;
}

const CourseCompletedAndTakeCertPerYear = () => {
  const { data, isLoading } = useCourseCompletedAndTakeCertificateStatistic();
  const [selectedYear, setSelectedYear] = useState<number>();

  const years = useMemo(() => {
    if (!data?.data) return [];
    const availableYears = data.data.map((item) => item.year);
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0]);
    }
    return availableYears;
  }, [data, selectedYear]);

  const chartData = useMemo(() => {
    if (!data?.data || !selectedYear) return null;

    const yearData = data.data.find((item) => item.year === selectedYear);
    if (!yearData) return null;

    const categories: string[] = [];
    const maleData: number[] = [];
    const femaleData: number[] = [];
    const tooltipData: { date: string; male: number; female: number }[] = [];

    Object.entries(yearData.courses).forEach(
      ([courseName, batches]: [string, BatchData[]]) => {
        // Group by batch
        const batchGroups = batches.reduce(
          (acc, curr) => {
            const key = curr.batch;
            if (!acc[key]) {
              acc[key] = {
                male: 0,
                female: 0,
                dates: new Set<string>(),
              };
            }
            acc[key].male += curr.male;
            acc[key].female += curr.female;
            if (curr.certificate_date) {
              const date = new Date(curr.certificate_date);
              const buddhistYear = date.getFullYear() + 543;
              acc[key].dates.add(
                format(date, `d MMMM ${buddhistYear}`, {
                  locale: th,
                }),
              );
            }
            return acc;
          },
          {} as Record<
            number,
            { male: number; female: number; dates: Set<string> }
          >,
        );

        // Add data for each batch
        Object.entries(batchGroups).forEach(([batch, data]) => {
          categories.push(`${courseName}\n(รุ่น ${batch})`);
          maleData.push(data.male);
          femaleData.push(data.female);
          tooltipData.push({
            date: Array.from(data.dates).join('\n'),
            male: data.male,
            female: data.female,
          });
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
        colors: ['#2E93fA', '#FF69B4'],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 4,
            borderRadiusApplication: 'end' as const,
          },
        },
        dataLabels: {
          enabled: true,
        },
        tooltip: {
          y: {
            formatter: function (
              value: number,
              { seriesIndex, dataPointIndex }: any,
            ) {
              const tooltipInfo = tooltipData[dataPointIndex];
              const gender = seriesIndex === 0 ? 'ชาย' : 'หญิง';
              return `จำนวน${gender}: ${value} คน\nวันที่รับใบประกาศ:\n${tooltipInfo.date}`;
            },
          },
        },
        xaxis: {
          categories: categories,
          labels: {
            rotate: -45,
            style: {
              fontSize: '12px',
            },
          },
        },
        yaxis: {
          title: {
            text: 'จำนวนผู้จบหลักสูตรและรับใบประกาศ',
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

  // Loading state
  if (isLoading)
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-slate-800">
        <div className="text-center p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-[400px] bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );

  // No data state
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
            ไม่มีข้อมูลสถิติผู้จบหลักสูตรและรับใบประกาศในระบบ
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
            สถิติจำนวนนักเรียนที่จบหลักสูตรและรับใบประกาศ (รุ่นต่อปีแยกชาย-หญิง)
          </h2>

          <div className="mt-4 md:mt-0">
            <select
              className="w-48 p-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 
              hover:border-gray-400 font-notoLoopThaiRegular dark:text-white dark:bg-slate-700 dark:border-slate-600"
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

export default CourseCompletedAndTakeCertPerYear;
