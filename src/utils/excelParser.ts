import * as XLSX from 'xlsx';
import { Client } from '@/types/client';

const parseDate = (dateValue: unknown): Date | null => {
  if (!dateValue) return null;
  
  if (typeof dateValue === 'number') {
    // Excel serial date - convert from Excel epoch (1899-12-30)
    const excelEpoch = new Date(1899, 11, 30);
    return new Date(excelEpoch.getTime() + dateValue * 86400000);
  } else if (typeof dateValue === 'string') {
    const dateStr = dateValue.trim();
    if (!dateStr) return null;
    
    const parts = dateStr.split(/[/\-.]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year < 100 ? 2000 + year : year, month, day);
      }
    }
  } else if (dateValue instanceof Date) {
    return dateValue;
  }
  
  return null;
};

const parseNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  
  if (typeof value === 'number') return value;
  
  if (typeof value === 'string') {
    // Remove currency symbols, thousands separators, and handle Brazilian format
    const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? undefined : num;
  }
  
  return undefined;
};

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
          if (!name) continue;
          
          const lastPurchaseDate = parseDate(row[10]); // Dt. Última Compra
          if (!lastPurchaseDate || isNaN(lastPurchaseDate.getTime())) continue;
          
          clients.push({
            id: `client-${i}-${Date.now()}`,
            name,
            birthDate: parseDate(row[1]) || undefined,
            registrationDate: parseDate(row[2]) || undefined,
            contact: row[3] ? String(row[3]).trim() : undefined,
            contactBirthday: parseDate(row[4]) || undefined,
            contactPhone: row[5] ? String(row[5]).trim() : undefined,
            contactEmail: row[6] ? String(row[6]).trim() : undefined,
            cnpjCpf: row[7] ? String(row[7]).trim() : undefined,
            activity: row[8] ? String(row[8]).trim() : undefined,
            lastPurchaseDate,
            phone: row[11] ? String(row[11]).trim() : undefined,
            cellphone: row[12] ? String(row[12]).trim() : undefined,
            email: row[13] ? String(row[13]).trim() : undefined,
            budgetStatus: row[14] ? String(row[14]).trim() : undefined,
            orderCount: parseNumber(row[15]),
            total: parseNumber(row[16]),
            averageTicket: parseNumber(row[17]),
            comment: row[18] ? String(row[18]).trim() : undefined,
            month: lastPurchaseDate.getMonth(),
            year: lastPurchaseDate.getFullYear(),
          });
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

export const generateTemplateFile = (): void => {
  const headers = [
    'Cliente',
    'Dt. Nascimento',
    'Dt. Cadastro',
    'Contato',
    'Dt. Aniversário Contato',
    'Tel. Contato',
    'Email Contato',
    'CNPJ/CPF',
    'Atividade',
    'Cadastro',
    'Dt. Última Compra',
    'Telefone',
    'Celular',
    'Email',
    'Status Orc.',
    'Qtd. Pedidos',
    'TOTAL',
    'Ticket Médio',
    'Comentário',
  ];
  
  const exampleRow = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ];
  
  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
  
  // Set column widths
  ws['!cols'] = headers.map(() => ({ wch: 20 }));
  
  XLSX.writeFile(wb, 'template_clientes.xlsx');
};

export const exportClientsToExcel = (clients: Client[]): void => {
  const headers = [
    'Cliente',
    'Dt. Nascimento',
    'Dt. Cadastro',
    'Contato',
    'Dt. Aniversário Contato',
    'Tel. Contato',
    'Email Contato',
    'CNPJ/CPF',
    'Atividade',
    'Cadastro',
    'Dt. Última Compra',
    'Telefone',
    'Celular',
    'Email',
    'Status Orc.',
    'Qtd. Pedidos',
    'TOTAL',
    'Ticket Médio',
    'Comentário',
  ];
  
  const formatDate = (date?: Date): string => {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };
  
  const rows = clients.map(client => [
    client.name,
    formatDate(client.birthDate),
    formatDate(client.registrationDate),
    client.contact || '',
    formatDate(client.contactBirthday),
    client.contactPhone || '',
    client.contactEmail || '',
    client.cnpjCpf || '',
    client.activity || '',
    formatDate(client.registrationDate),
    formatDate(client.lastPurchaseDate),
    client.phone || '',
    client.cellphone || '',
    client.email || '',
    client.budgetStatus || '',
    client.orderCount || '',
    client.total ? `R$${client.total.toLocaleString('pt-BR')}` : '',
    client.averageTicket ? `R$${client.averageTicket.toLocaleString('pt-BR')}` : '',
    client.comment || '',
  ]);
  
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
  
  ws['!cols'] = headers.map(() => ({ wch: 20 }));
  
  XLSX.writeFile(wb, 'clientes_exportados.xlsx');
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
