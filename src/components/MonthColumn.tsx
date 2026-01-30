import { Client } from '@/types/client';
import { ClientCard } from './ClientCard';
import { getMonthName, getMonthColor } from '@/utils/excelParser';

interface MonthColumnProps {
  month: number;
  year: number;
  clients: Client[];
  onUpdateComment: (clientId: string, comment: string) => void;
}

export const MonthColumn = ({ month, year: _year, clients, onUpdateComment }: MonthColumnProps) => {
  const monthName = getMonthName(month);
  const colorClass = getMonthColor(month);

  // Calculate total for the month
  const monthTotal = clients.reduce((sum, client) => sum + (client.total || 0), 0);
  const formattedTotal = monthTotal > 0 
    ? `R$ ${monthTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : 'R$ 0,00';

  return (
    <div className="flex-shrink-0 w-72 flex flex-col animate-slide-in">
      {/* Header */}
      <div className={`${colorClass} rounded-full px-4 py-2 flex items-center justify-between mb-4`}>
        <div className="flex items-center gap-2">
          <span className="bg-black/20 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
            {formattedTotal}
          </span>
          <span className="text-white font-semibold">
            {monthName}
          </span>
        </div>
        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
          {clients.length}
        </span>
      </div>

      {/* Cards container */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 scrollbar-thin">
        {clients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Nenhum cliente
          </div>
        ) : (
          clients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index} 
              onUpdateComment={onUpdateComment}
            />
          ))
        )}
      </div>
    </div>
  );
};
