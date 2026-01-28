import { Users } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Gestor de Carteira</h1>
          <p className="text-xs text-muted-foreground">Kanban por Última Compra</p>
        </div>
      </div>
    </header>
  );
};
