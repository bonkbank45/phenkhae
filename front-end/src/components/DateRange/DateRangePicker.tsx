import React from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_green.css';
import { Thai } from 'flatpickr/dist/l10n/th';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onClear: () => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  label?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  startPlaceholder = 'วันที่ค้นหาเริ่มต้น',
  endPlaceholder = 'วันที่ค้นหาสิ้นสุด',
  label = 'วันที่ค้นหา',
}) => {
  return (
    <div className="flex items-center gap-2 font-notoLoopThaiRegular">
      <span>{label}</span>
      <Flatpickr
        value={startDate}
        onChange={([date]) => onStartDateChange(date)}
        placeholder={startPlaceholder}
        options={{
          locale: Thai,
          dateFormat: 'd/m/Y',
          allowInput: true,
          enableTime: false,
        }}
      />
      <span>ถึง</span>
      <Flatpickr
        value={endDate}
        onChange={([date]) => onEndDateChange(date)}
        placeholder={endPlaceholder}
        options={{
          locale: Thai,
          dateFormat: 'd/m/Y',
          allowInput: true,
          enableTime: false,
        }}
      />
      <button className="text-red-500" onClick={onClear}>
        ล้างค่า
      </button>
    </div>
  );
};

export default DateRangePicker;
