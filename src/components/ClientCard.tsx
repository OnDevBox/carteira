import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, User } from 'lucide-react';
import { Client } from '@/types/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientCardProps {
  client: Client;
  index: number;
}

export const ClientCard = ({ client, index }: ClientCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-card rounded-lg border border-border shadow-sm overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
            {client.name}
          </h3>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
        >
          {isExpanded ? (
            <>
              Mostrar menos
              <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Mostrar mais
              <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-border space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span className="font-medium">Cliente:</span>
              <span className="text-foreground">{client.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-medium">Última Compra:</span>
              <span className="text-foreground">
                {format(client.lastPurchaseDate, "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
