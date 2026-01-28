import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Header } from '@/components/Header';
import { parseExcelFile } from '@/utils/excelParser';
import { Client } from '@/types/client';
import { toast } from 'sonner';
import { Loader2, Users, FileSpreadsheet } from 'lucide-react';

const Index = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    try {
      const parsedClients = await parseExcelFile(file);
      
      if (parsedClients.length === 0) {
        toast.error('Nenhum cliente encontrado no arquivo. Verifique se o formato está correto.');
        return;
      }

      setClients(parsedClients);
      setHasUploaded(true);
      toast.success(`${parsedClients.length} clientes importados com sucesso!`);
    } catch (error) {
      toast.error('Erro ao processar o arquivo. Verifique o formato.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Upload Section */}
          {!hasUploaded && (
            <div className="mb-8 animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Importe sua planilha de clientes
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Faça upload de um arquivo Excel com o nome do cliente na primeira coluna 
                  e a data da última compra na segunda coluna.
                </p>
              </div>
              <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
              
              {/* Example format */}
              <div className="mt-6 max-w-md mx-auto">
                <p className="text-xs text-muted-foreground text-center mb-3">Formato esperado:</p>
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="px-4 py-2 text-left font-semibold text-foreground">Nome</th>
                        <th className="px-4 py-2 text-left font-semibold text-foreground">Data Última Compra</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-muted-foreground">João Silva</td>
                        <td className="px-4 py-2 text-muted-foreground">15/01/2025</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 text-muted-foreground">Maria Santos</td>
                        <td className="px-4 py-2 text-muted-foreground">22/02/2025</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Processando arquivo...</p>
            </div>
          )}

          {/* Stats */}
          {hasUploaded && !isLoading && (
            <div className="mb-6 animate-fade-in">
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{clients.length} clientes</span>
                </div>
                <button
                  onClick={() => {
                    setHasUploaded(false);
                    setClients([]);
                  }}
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Importar nova planilha
                </button>
              </div>
            </div>
          )}

          {/* Kanban Board */}
          {hasUploaded && !isLoading && (
            <KanbanBoard clients={clients} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
