import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Schools from './pages/Schools';
import Classes from './pages/Classes';
import Welcome from './pages/Welcome';
import { AppData, School, ClassGroup, ScheduleSlot } from './types';
import { loadData, saveData } from './services/storage';

const App: React.FC = () => {
  console.log("Loading Grade App, React version:", React.version);
  // Central State Management
  const [data, setData] = useState<AppData>(loadData());
  const [loading, setLoading] = useState(true);

  // Persistence Effect
  useEffect(() => {
    // Initial load is handled by useState init
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveData(data);
    }
  }, [data, loading]);

  // Actions
  const updateSchools = (schools: School[]) => setData(prev => ({ ...prev, schools }));
  const updateClasses = (classes: ClassGroup[]) => setData(prev => ({ ...prev, classes }));
  const updateSchedule = (schedule: ScheduleSlot[]) => setData(prev => ({ ...prev, schedule }));

  const [activePage, setActivePage] = useState<'welcome'|'dashboard'|'grade'|'escolas'|'turmas'>('welcome');

  if (loading) return <div className="h-screen flex items-center justify-center text-blue-600">Carregando...</div>;

  if (activePage === 'welcome') {
    return <Welcome onEnter={() => setActivePage('dashboard')} />;
  }

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {activePage === 'dashboard' && <Dashboard data={data} />}
      {activePage === 'grade' && <Schedule data={data} onUpdateSchedule={updateSchedule} />}
      {activePage === 'escolas' && <Schools data={data} onUpdateSchools={updateSchools} />}
      {activePage === 'turmas' && <Classes data={data} onUpdateClasses={updateClasses} />}
    </Layout>
  );
};

export default App;