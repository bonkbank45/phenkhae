import { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useStatisticData } from '../../hooks/api/useStatisticData';

interface CourseData {
  [key: string]: number;
}

interface YearData {
  year: number;
  courses: CourseData;
}

const CertificatePerYear = () => {
  const { data, isLoading } = useStatisticData();

  const chartDataCertificate = useMemo(() => {
    if (!data?.data || data.data.length === 0) return null;

    const courses = Object.keys(data.data[0].courses);
    const series = courses.map((course) => ({
      name: course,
      data: data.data.map(
        (yearData: YearData) => Number(yearData.courses[course]) || 0,
      ),
    }));

    return {
      options: {
        chart: {
          type: 'bar' as const,
          height: 350,
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 4,
            borderRadiusApplication: 'end' as const,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: data.data.map(
            (item: YearData) => `ปี ${item.year + 543}`,
          ),
          tickPlacement: 'on',
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
      series,
    };
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="bg-white rounded-lg p-4 dark:bg-slate-800">
        <div className="rounded-xl p-4 dark:bg-slate-800">
          {chartDataCertificate ? (
            <div>
              <h2 className="text-2xl font-bold font-notoExtraBold dark:text-white">
                สถิติจำนวนใบประกาศนียบัตรที่ได้ออกให้ในแต่ละปี
              </h2>
              <ReactApexChart
                options={chartDataCertificate.options}
                series={chartDataCertificate.series}
                type="bar"
                height={350}
              />
            </div>
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
                  <p>
                    ไม่พบข้อมูลสถิติจำนวนใบประกาศนียบัตรที่ได้ออกให้ในแต่ละปี
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificatePerYear;
