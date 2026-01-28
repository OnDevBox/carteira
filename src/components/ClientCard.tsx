import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, User, Phone, Mail, Building, DollarSign, MessageSquare, Save } from 'lucide-react';
import { Client } from '@/types/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface ClientCardProps {
  client: Client;
  index: number;
  onUpdateComment: (clientId: string, comment: string) => void;
}

export const ClientCard = ({ client, index, onUpdateComment }: ClientCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState(client.comment || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveComment = () => {
    onUpdateComment(client.id, comment);
    setIsEditing(false);
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

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
        
        {/* Quick info */}
        {client.total && (
          <div className="mt-2 text-xs font-medium text-primary">
            {formatCurrency(client.total)}
          </div>
        )}
        
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
          <div className="mt-3 pt-3 border-t border-border space-y-3 animate-fade-in">
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-medium">Cliente:</span>
                <span className="text-foreground truncate">{client.name}</span>
              </div>
              
              {client.cnpjCpf && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">CNPJ/CPF:</span>
                  <span className="text-foreground">{client.cnpjCpf}</span>
                </div>
              )}
              
              {client.cellphone && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">Celular:</span>
                  <span className="text-foreground">{client.cellphone}</span>
                </div>
              )}
              
              {client.email && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">Email:</span>
                  <span className="text-foreground truncate">{client.email}</span>
                </div>
              )}
              
              {client.activity && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Building className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Atividade:</span>
                  <span className="text-foreground">{client.activity}</span>
                </div>
              )}
            </div>
            
            {/* Dates */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-medium">Última Compra:</span>
                <span className="text-foreground">{formatDate(client.lastPurchaseDate)}</span>
              </div>
              
              {client.registrationDate && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">Cadastro:</span>
                  <span className="text-foreground">{formatDate(client.registrationDate)}</span>
                </div>
              )}
              
              {client.birthDate && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">Nascimento:</span>
                  <span className="text-foreground">{formatDate(client.birthDate)}</span>
                </div>
              )}
            </div>
            
            {/* Financial Info */}
            <div className="space-y-2 pt-2 border-t border-border">
              {client.orderCount !== undefined && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">Qtd. Pedidos:</span>
                  <span className="text-foreground">{client.orderCount}</span>
                </div>
              )}
              
              {client.total !== undefined && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">Total:</span>
                  <span className="text-foreground font-semibold">{formatCurrency(client.total)}</span>
                </div>
              )}
              
              {client.averageTicket !== undefined && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">Ticket Médio:</span>
                  <span className="text-foreground">{formatCurrency(client.averageTicket)}</span>
                </div>
              )}
              
              {client.budgetStatus && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">Status Orc.:</span>
                  <span className="text-foreground">{client.budgetStatus}</span>
                </div>
              )}
            </div>
            
            {/* Comment Section */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="font-medium">Comentário:</span>
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Adicione um comentário..."
                    className="text-xs min-h-[60px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveComment}
                      className="h-7 text-xs"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setComment(client.comment || '');
                        setIsEditing(false);
                      }}
                      className="h-7 text-xs"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-foreground bg-secondary/50 rounded p-2 min-h-[40px] cursor-pointer hover:bg-secondary transition-colors"
                >
                  {comment || <span className="text-muted-foreground italic">Clique para adicionar comentário...</span>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
