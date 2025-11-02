import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import DashboardSummary from '../components/DashboardSummary';
import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import { Plus, Bot, Search, ArrowUpDown, Filter } from '../components/icons';
import TaskFormModal from '../components/TaskFormModal';
import { useDebounce } from '../hooks/useDebounce';
import { FilterStatus, SortOrder, Task } from '../types';
import AIGoalModal from '../components/AIGoalModal';
import { useTranslation } from '../hooks/useTranslation';
import TaskDetailModal from '../components/TaskDetailModal';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { tasks, loading, addTask, updateTask, deleteTask, toggleTaskStatus, addMultipleTasks } = useTasks();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(FilterStatus.All);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Latest);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };
  
  const handleViewDetails = (task: Task) => {
    setViewingTask(task);
    setIsTaskDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };
  
  const handleCloseDetailModal = () => {
    setIsTaskDetailModalOpen(false);
    setViewingTask(null);
  };

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (filterStatus === FilterStatus.Completed) return task.status === 'completed';
        if (filterStatus === FilterStatus.Pending) return task.status === 'pending';
        return true;
      })
      .filter(task =>
        task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        task.notes?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === SortOrder.Latest ? dateB - dateA : dateA - dateB;
      });
  }, [tasks, debouncedSearchTerm, filterStatus, sortOrder]);

  const cycleFilter = () => {
    const statuses = Object.values(FilterStatus);
    const currentIndex = statuses.indexOf(filterStatus);
    setFilterStatus(statuses[(currentIndex + 1) % statuses.length]);
  };

  const cycleSort = () => {
    setSortOrder(prev => prev === SortOrder.Latest ? SortOrder.Oldest : SortOrder.Latest);
  };

  return (
    <div className="min-h-screen bg-secondary/50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <DashboardSummary tasks={tasks} />
         
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm border border-border space-y-6">
             {/* Controls Bar */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background border border-input rounded-lg pl-10 pr-24 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center divide-x divide-border">
                  <button onClick={cycleFilter} className="px-3 text-muted-foreground hover:text-foreground transition-colors" aria-label="Filter tasks">
                    <Filter className="h-5 w-5" />
                  </button>
                  <button onClick={cycleSort} className="pl-3 text-muted-foreground hover:text-foreground transition-colors" aria-label="Sort tasks">
                    <ArrowUpDown className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  {t('add.task')}
                </button>
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-semibold shadow-sm"
                >
                  <Bot className="h-4 w-4" />
                  AI Task
                </button>
              </div>
            </div>
            
            <TaskList
              tasks={filteredAndSortedTasks}
              loading={loading}
              onEdit={handleEdit}
              onDelete={deleteTask}
              onToggleStatus={toggleTaskStatus}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      </main>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseModal}
        onSave={editingTask ? updateTask : addTask}
        task={editingTask}
      />
      
      <AIGoalModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onTasksGenerated={addMultipleTasks}
      />

      <TaskDetailModal
        isOpen={isTaskDetailModalOpen}
        onClose={handleCloseDetailModal}
        task={viewingTask}
      />
    </div>
  );
};

export default HomePage;