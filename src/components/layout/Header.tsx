import { Bell, Search, User as UserIcon, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  title: string;
  subtitle?: string;
  user?: User | null;
  onLogout?: () => void;
}

export function Header({ title, subtitle, user, onLogout }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="ml-12 lg:ml-0">
        <h1 className="text-base lg:text-lg font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground hidden sm:block">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar..." 
            className="pl-9 w-48 lg:w-64 bg-muted border-border command-input"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full border border-border">
              <UserIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {user?.email && (
              <DropdownMenuItem className="text-xs text-muted-foreground">
                {user.email}
              </DropdownMenuItem>
            )}
            {onLogout && (
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
