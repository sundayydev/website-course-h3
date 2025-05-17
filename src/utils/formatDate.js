import { parse, format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (dateStr, outputFormat = 'dd/MM/yyyy HH:mm') => {
  if (!dateStr || typeof dateStr !== 'string') {
    return 'Không có ngày';
  }

  const formats = [
    'dd-MM-yyyy HH:mm:ss',
    'yyyy-MM-dd HH:mm:ss',
    'yyyy-MM-dd\'T\'HH:mm:ss',
    'dd/MM/yyyy HH:mm:ss',
    'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'',
  ];

  let parsedDate = null;

  for (const formatStr of formats) {
    try {
      parsedDate = parse(dateStr, formatStr, new Date());
      if (!isNaN(parsedDate.getTime())) {
        break;
      }
    } catch (e) {
    }
  }

  if (!parsedDate || isNaN(parsedDate.getTime())) {
    parsedDate = new Date(dateStr);
  }

  if (isNaN(parsedDate.getTime())) {
    console.warn(`Invalid date format: ${dateStr}`);
    return 'Ngày không hợp lệ';
  }

  return format(parsedDate, outputFormat, { locale: vi });
};