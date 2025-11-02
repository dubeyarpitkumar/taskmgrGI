import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import DashboardSummary from '../components/DashboardSummary';
import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import { Plus, Bot, Search, ArrowUpDown } from '../components/icons';
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

  return (
    <div className="min-h-screen bg-secondary/50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <DashboardSummary tasks={tasks} />
         
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm border border-border space-y-6">
             {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative w-full sm:w-auto sm:min-w-[250px] lg:max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Search className="h-5 w-5" />
                  </span>
                  <input
                      type="text"
                      placeholder={t('search.placeholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-background border border-input rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
              </div>

              <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2">
                 <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
                   {(Object.values(FilterStatus)).map(status => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filterStatus === status ? 'bg-background shadow-sm text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t(`filter.${status}`)}
                        </button>
                   ))}
                </div>
                
                 <div className="relative">
                    <select
                        id="sort-order"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                        className="appearance-none bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-8"
                    >
                        <option value={SortOrder.Latest}>Latest First</option>
                        <option value={SortOrder.Oldest}>Oldest First</option>
                    </select>
                     <ArrowUpDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                
                <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold"
                >
                    <Plus className="h-4 w-4" />
                    {t('add.task')}
                </button>
                <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-secondary transition-colors text-sm font-semibold"
                >
                    <Bot className="h-4 w-4" />
                    AI Task Generator
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