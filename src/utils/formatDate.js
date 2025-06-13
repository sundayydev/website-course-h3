import { parse, format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (dateStr, outputFormat = 'dd/MM/yyyy HH:mm') => {
  if (!dateStr || typeof dateStr !== 'string') {
    return 'Không có ngày';
  }

  // Tách chuỗi nếu chứa nhiều ngày
  const dateParts = dateStr.match(/\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/g) || [dateStr];

  const formats = [
    'dd-MM-yyyy HH:mm:ss',
    'yyyy-MM-dd HH:mm:ss',
    'yyyy-MM-dd\'T\'HH:mm:ss',
    'dd/MM/yyyy HH:mm:ss',
    'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'',
  ];

  // Chỉ xử lý ngày đầu tiên trong chuỗi
  const firstDateStr = dateParts[0];

  let parsedDate = null;

  for (const formatStr of formats) {
    try {
      parsedDate = parse(firstDateStr, formatStr, new Date());
      if (!isNaN(parsedDate.getTime())) {
        break;
      }
    } catch (e) { }
  }

  if (!parsedDate || isNaN(parsedDate.getTime())) {
    parsedDate = new Date(firstDateStr);
  }

  if (isNaN(parsedDate.getTime())) {
    console.warn(`Invalid date format: ${firstDateStr}`);
    return 'Ngày không hợp lệ';
  }

  return format(parsedDate, outputFormat, { locale: vi });
};