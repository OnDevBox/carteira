import { useMemo } from 'react';
import { Client } from '@/types/client';
import { MonthColumn } from './MonthColumn';

interface KanbanBoardProps {
  clients: Client[];
  onUpdateComment: (clientId: string, comment: string) => void;
}

interface YearGroup {
  year: number;
  months: { month: number; year: number; clients: Client[] }[];
}

export const KanbanBoard = ({ clients, onUpdateComment }: KanbanBoardProps) => {
  const yearGroups = useMemo(() => {
    // Group clients by year and month
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

    // Group by year
    const byYear = Object.values(grouped).reduce((acc, item) => {
      if (!acc[item.year]) {
        acc[item.year] = {
          year: item.year,
          months: [],
        };
      }
      acc[item.year].months.push(item);
      return acc;
    }, {} as Record<number, YearGroup>);

    // Sort years and months within each year
    return Object.values(byYear)
      .sort((a, b) => a.year - b.year)
      .map(yearGroup => ({
        ...yearGroup,
        months: yearGroup.months.sort((a, b) => a.month - b.month),
      }));
  }, [clients]);

  if (clients.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {yearGroups.map((yearGroup) => (
        <div key={yearGroup.year} className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold text-foreground">{yearGroup.year}</h2>
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">
              {yearGroup.months.reduce((sum, m) => sum + m.clients.length, 0)} clientes
            </span>
          </div>
          <div className="w-full overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max px-1">
              {yearGroup.months.map((column) => (
                <MonthColumn
                  key={`${column.year}-${column.month}`}
                  month={column.month}
                  year={column.year}
                  clients={column.clients}
                  onUpdateComment={onUpdateComment}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
