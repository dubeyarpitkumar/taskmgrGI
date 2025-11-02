import React from 'react';
import type { Task } from '../types';
import { CheckCircle, List, PieChart } from './icons';
import { useTranslation } from '../hooks/useTranslation';

interface DashboardSummaryProps {
  tasks: Task[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ tasks }) => {
  const { t } = useTranslation();
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.length - completedTasks;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const Card: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-card p-4 rounded-lg flex items-center gap-4 border border-border/50">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
            {icon}
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">{t('dashboard.title')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card title={t('dashboard.completed')} value={completedTasks} icon={<CheckCircle className="h-6 w-6"/>} />
        <Card title={t('dashboard.pending')} value={pendingTasks} icon={<List className="h-6 w-6"/>} />
        <Card title="Total Tasks" value={totalTasks} icon={<PieChart className="h-6 w-6"/>} />
      </div>
      <div>
        <h3 className="text-md font-semibold mb-2">{t('dashboard.progress')}</h3>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-right text-sm mt-1 text-muted-foreground">{completionPercentage}% {t('dashboard.completed')}</p>
      </div>
    </div>
  );
};

export default DashboardSummary;
