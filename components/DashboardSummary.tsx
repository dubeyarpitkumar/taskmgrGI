import React from 'react';
import type { Task } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface DashboardSummaryProps {
  tasks: Task[];
}

const StatCard: React.FC<{ title: string; value: string | number; className: string }> = ({ title, value, className }) => (
    <div className={`p-4 rounded-xl shadow-sm ${className}`}>
        <p className="text-xs sm:text-sm text-white/90">{title}</p>
        <p className="text-3xl sm:text-4xl font-bold text-white mt-1">{value}</p>
    </div>
);

const CompletionRateCard: React.FC<{ title: string; value: number }> = ({ title, value }) => (
    <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col justify-between">
        <div>
            <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl sm:text-4xl font-bold text-foreground mt-1">{value}%</p>
        </div>
        <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full" style={{ width: `${value}%` }}></div>
        </div>
    </div>
);


const DashboardSummary: React.FC<DashboardSummaryProps> = ({ tasks }) => {
  const { t } = useTranslation();
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title={t('dashboard.total')} value={totalTasks} className="bg-purple-500" />
        <StatCard title={t('dashboard.completed')} value={completedTasks} className="bg-green-500" />
        <StatCard title={t('dashboard.pending')} value={pendingTasks} className="bg-orange-500" />
        <CompletionRateCard title={t('dashboard.completionRate')} value={completionPercentage} />
    </div>
  );
};

export default DashboardSummary;