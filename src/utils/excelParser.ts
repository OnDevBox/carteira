import * as XLSX from 'xlsx';
import { Client } from '@/types/client';

export const parseExcelFile = (file: File): Promise<Client[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];
        
        const clients: Client[] = [];
        
        // Skip header row (index 0)
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length < 2) continue;
          
          const name = String(row[0] || '').trim();
          const dateValue = row[1];
          
          if (!name) continue;
          
          let parsedDate: Date | null = null;
          
          // Handle different date formats
          if (typeof dateValue === 'number') {
            // Excel serial date - convert from Excel epoch (1899-12-30)
            const excelEpoch = new Date(1899, 11, 30);
            parsedDate = new Date(excelEpoch.getTime() + dateValue * 86400000);
          } else if (typeof dateValue === 'string') {
            // Try parsing as DD/MM/YYYY or other common formats
            const dateStr = dateValue.trim();
            const parts = dateStr.split(/[/\-.]/);
            
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const year = parseInt(parts[2], 10);
              
              if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                parsedDate = new Date(year < 100 ? 2000 + year : year, month, day);
              }
            }
          } else if (dateValue instanceof Date) {
            parsedDate = dateValue;
          }
          
          if (parsedDate && !isNaN(parsedDate.getTime())) {
            clients.push({
              id: `client-${i}-${Date.now()}`,
              name,
              lastPurchaseDate: parsedDate,
              month: parsedDate.getMonth(),
              year: parsedDate.getFullYear(),
            });
          }
        }
        
        resolve(clients);
      } catch (_error) {
        reject(new Error('Erro ao processar o arquivo Excel'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo'));
    };
    
    reader.readAsBinaryString(file);
  });
};

export const getMonthName = (month: number): string => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month] || '';
};

export const getMonthColor = (month: number): string => {
  const colors = [
    'bg-month-jan',
    'bg-month-feb',
    'bg-month-mar',
    'bg-month-apr',
    'bg-month-may',
    'bg-month-jun',
    'bg-month-jul',
    'bg-month-aug',
    'bg-month-sep',
    'bg-month-oct',
    'bg-month-nov',
    'bg-month-dec',
  ];
  return colors[month] || 'bg-primary';
};
