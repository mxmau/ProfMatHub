import React from 'react';
import { Button } from '../components/ui/Button';
import { GraduationCap, CheckCircle2, LayoutGrid, MapPin } from 'lucide-react';

interface WelcomeProps {
  onEnter: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
        <div className="p-10 text-center">
          <div className="mx-auto w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <GraduationCap size={48} />
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">ProfOrganiza PE</h1>
          <p className="text-gray-500 mb-8 text-lg">
            Sua rotina escolar em <span className="text-blue-600 font-semibold">São Lourenço</span> e <span className="text-emerald-600 font-semibold">Igarassu</span>, organizada em um só lugar.
          </p>

          <div className="space-y-4 text-left bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 className="text-green-600" size={16} /></div>
              <span className="text-gray-700 font-medium">Controle de horários por turno</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-1 rounded-full"><LayoutGrid className="text-blue-600" size={16} /></div>
              <span className="text-gray-700 font-medium">Grade visual com cores</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-1 rounded-full"><MapPin className="text-orange-600" size={16} /></div>
              <span className="text-gray-700 font-medium">Gestão de múltiplas escolas</span>
            </div>
          </div>

          <Button 
            fullWidth 
            size="lg" 
            onClick={onEnter}
            className="h-14 text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all"
          >
            Acessar Sistema
          </Button>
        </div>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium">Desenvolvido para Professores de Matemática</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;