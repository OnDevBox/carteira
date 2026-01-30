import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Header } from '@/components/Header';
import { parseExcelFile, generateTemplateFile, exportClientsToExcel } from '@/utils/excelParser';
import { Client } from '@/types/client';
import { toast } from 'sonner';
import { Loader2, Users, FileSpreadsheet, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const handleUpdateComment = (clientId: string, comment: string) => {
    setClients(prev => 
      prev.map(client => 
        client.id === clientId 
          ? { ...client, comment } 
          : client
      )
    );
    toast.success('Comentário salvo!');
  };

  const handleExport = () => {
    exportClientsToExcel(clients);
    toast.success('Arquivo exportado com sucesso!');
  };

  const handleDownloadTemplate = () => {
    generateTemplateFile();
    toast.success('Template baixado!');
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
                  Faça upload de um arquivo Excel com os dados dos clientes conforme o template.
                </p>
              </div>
              
              <div className="flex justify-center mb-4">
                <Button
                  variant="outline"
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar Template
                </Button>
              </div>
              
              <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
              
              {/* Example format */}
              <div className="mt-6 max-w-2xl mx-auto">
                <p className="text-xs text-muted-foreground text-center mb-3">Campos do template:</p>
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <span>• Cliente</span>
                    <span>• Dt. Nascimento</span>
                    <span>• Dt. Cadastro</span>
                    <span>• Contato</span>
                    <span>• Dt. Aniversário Contato</span>
                    <span>• Tel. Contato</span>
                    <span>• Email Contato</span>
                    <span>• CNPJ/CPF</span>
                    <span>• Atividade</span>
                    <span>• Dt. Última Compra</span>
                    <span>• Cadastro</span>
                    <span>• Telefone</span>
                    <span>• Celular</span>
                    <span>• Email</span>
                    <span>• Status Orc.</span>
                    <span>• Qtd. Pedidos</span>
                    <span>• TOTAL</span>
                    <span>• Ticket Médio</span>
                    <span>• Comentário</span>
                  </div>
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

          {/* Stats & Actions */}
          {hasUploaded && !isLoading && (
            <div className="mb-6 animate-fade-in">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{clients.length} clientes</span>
                </div>
                
                <div className="flex-1" />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar Excel
                </Button>
                
                <button
                  onClick={() => {
                    setHasUploaded(false);
                    setClients([]);
                  }}
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Nova planilha
                </button>
              </div>
            </div>
          )}

          {/* Kanban Board */}
          {hasUploaded && !isLoading && (
            <KanbanBoard clients={clients} onUpdateComment={handleUpdateComment} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
