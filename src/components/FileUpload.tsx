import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export const FileUpload = ({ onFileSelect, isLoading }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFile(file)) {
        setFileName(file.name);
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFile(file)) {
        setFileName(file.name);
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const isValidFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    return validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
  };

  const clearFile = () => {
    setFileName(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {fileName ? (
        <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border shadow-sm animate-fade-in">
          <FileSpreadsheet className="w-8 h-8 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground">Arquivo carregado</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFile}
            className="shrink-0"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <label
          className={`
            relative flex flex-col items-center justify-center w-full p-8 
            border-2 border-dashed rounded-xl cursor-pointer
            transition-all duration-200 ease-out
            ${dragActive 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={handleChange}
            disabled={isLoading}
          />
          <div className={`
            p-4 rounded-full mb-4 transition-colors
            ${dragActive ? 'bg-primary/20' : 'bg-secondary'}
          `}>
            <Upload className={`w-8 h-8 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            Arraste seu arquivo Excel aqui
          </p>
          <p className="text-xs text-muted-foreground">
            ou clique para selecionar (.xlsx, .xls, .csv)
          </p>
        </label>
      )}
    </div>
  );
};
