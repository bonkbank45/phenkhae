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
        <h2 className="text-2xl font-bold font-notoExtraBold dark:text-white">
          สถิติจำนวนใบประกาศนียบัตรที่ได้ออกให้ในแต่ละปี
        </h2>
        <div className="bg-gray-50 rounded-xl p-4 dark:bg-slate-800">
          {chartDataCertificate ? (
            <ReactApexChart
              options={chartDataCertificate.options}
              series={chartDataCertificate.series}
              type="bar"
              height={350}
            />
          ) : (
            <div className="font-notoLoopThaiRegular">
              ไม่มีข้อมูลเพียงพอให้แสดงผล (ข้อมูลการจบหลักสูตร)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificatePerYear;
