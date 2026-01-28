import { useMemo } from 'react';
import { Client } from '@/types/client';
import { MonthColumn } from './MonthColumn';

interface KanbanBoardProps {
  clients: Client[];
}

export const KanbanBoard = ({ clients }: KanbanBoardProps) => {
  const columns = useMemo(() => {
    // Group clients by month
    const grouped = clients.reduce((acc, client) => {
      const key = `${client.year}-${client.month}`;
      if (!acc[key]) {
        acc[key] = {
          month: client.month,
          year: client.year,
          clients: [],
        };
      }
      acc[key].clients.push(client);
      return acc;
    }, {} as Record<string, { month: number; year: number; clients: Client[] }>);

    // Sort by date and return as array
    return Object.values(grouped).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [clients]);

  if (clients.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max px-1">
        {columns.map((column) => (
          <MonthColumn
            key={`${column.year}-${column.month}`}
            month={column.month}
            year={column.year}
            clients={column.clients}
          />
        ))}
      </div>
    </div>
  );
};
