import React from 'react';
import type { Task } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface DashboardSummaryProps {
  tasks: Task[];
}

const StatCard: React.FC<{ title: string; value: string | number; className: string }> = ({ title, value, className }) => (
    <div className={`p-6 rounded-xl shadow-sm ${className}`}>
        <p className="text-sm text-white/90">{title}</p>
        <p className="text-4xl font-bold text-white mt-1">{value}</p>
    </div>
);

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={totalTasks} className="bg-purple-500" />
        <StatCard title="Completed" value={completedTasks} className="bg-green-500" />
        <StatCard title="Pending" value={pendingTasks} className="bg-orange-500" />
        <StatCard title="Completion Rate" value={`${completionPercentage}%`} className="bg-cyan-500" />
    </div>
  );
};

export default DashboardSummary;