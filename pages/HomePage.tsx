import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import DashboardSummary from '../components/DashboardSummary';
import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import { Plus, Bot } from '../components/icons';
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
        // Filter by status
        if (filterStatus === FilterStatus.Completed) return task.status === 'completed';
        if (filterStatus === FilterStatus.Pending) return task.status === 'pending';
        return true;
      })
      .filter(task =>
        // Filter by search term
        task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        task.notes?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === SortOrder.Latest ? dateB - dateA : dateA - dateB;
      });
  }, [tasks, debouncedSearchTerm, filterStatus, sortOrder]);

  return (
    <div className="min-h-screen bg-secondary/50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-3">
             <DashboardSummary tasks={tasks} />
          </div>
          <div className="md:col-span-3 bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-foreground">{t('tasks.title')}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm"
                >
                  <Bot className="h-4 w-4" />
                  {t('ai.button')}
                </button>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  {t('add.task')}
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="col-span-1 md:col-span-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="col-span-1 md:col-span-2 flex flex-wrap items-center justify-start md:justify-end gap-2 sm:gap-4">
                <div className="flex items-center gap-2 p-1 bg-secondary rounded-md">
                   {(Object.values(FilterStatus)).map(status => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-3 py-1 text-sm rounded ${filterStatus === status ? 'bg-background shadow-sm' : 'text-muted-foreground hover:bg-background/50'}`}
                        >
                            {t(`filter.${status}`)}
                        </button>
                   ))}
                </div>
                 <div className="flex items-center gap-2 text-sm">
                    <label htmlFor="sort-order" className="text-muted-foreground">{t('sort.by')}</label>
                    <select
                        id="sort-order"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                        className="bg-secondary border border-transparent rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value={SortOrder.Latest}>{t('sort.latest')}</option>
                        <option value={SortOrder.Oldest}>{t('sort.oldest')}</option>
                    </select>
                </div>
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