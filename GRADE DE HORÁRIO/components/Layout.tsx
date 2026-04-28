import React from 'react';
import { Home, Calendar, MapPin, GraduationCap, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: 'dashboard' | 'grade' | 'escolas' | 'turmas') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Hoje', path: 'dashboard', icon: <Home size={20} /> },
    { label: 'Grade', path: 'grade', icon: <Calendar size={20} /> },
    { label: 'Escolas', path: 'escolas', icon: <MapPin size={20} /> },
    { label: 'Turmas', path: 'turmas', icon: <GraduationCap size={20} /> },
  ] as const;

  const isActive = (path: string) => activePage === path;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800">
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-700 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="font-bold text-lg">ProfOrganiza PE</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-800 text-white absolute top-14 left-0 w-full z-40 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                setActivePage(item.path);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-4 border-b border-blue-700 hover:bg-blue-600 ${isActive(item.path) ? 'bg-blue-900' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-900 text-white min-h-screen sticky top-0">
        <div className="p-6">
          <h1 className="font-bold text-2xl tracking-tight">ProfOrganiza PE</h1>
          <p className="text-blue-200 text-xs mt-1">Matemática</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setActivePage(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'bg-blue-700 text-white shadow-md' 
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 text-xs text-blue-300 text-center">
          v1.0.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto pb-20 md:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Sticky) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 z-30 pb-safe">
         {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setActivePage(item.path)}
              className={`flex flex-col items-center p-2 rounded-lg ${
                isActive(item.path) ? 'text-blue-700' : 'text-gray-400'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default Layout;