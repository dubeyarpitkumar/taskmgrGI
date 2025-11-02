import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from '../components/Header';
import DashboardSummary from '../components/DashboardSummary';
import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import { Plus, Bot, Search, ArrowUpDown, Filter, Check } from '../components/icons';
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
  
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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


  const filterOptions = Object.values(FilterStatus).map(status => ({
    value: status,
    label: t(`filter.${status}`),
  }));

  const sortOptions = Object.values(SortOrder).map(order => ({
      value: order,
      label: t(`sort.${order}`),
  }));
  
  const FilterButton = ({ status, label }: { status: FilterStatus; label: string }) => (
    <button
      onClick={() => setFilterStatus(status)}
      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
        filterStatus === status
          ? 'bg-card text-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted/50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-secondary/50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <DashboardSummary tasks={tasks} />
         
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm border border-border space-y-6">
             {/* Mobile Controls Bar */}
            <div className="md:hidden space-y-4">
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
                  <div className="relative" ref={filterMenuRef}>
                    <button onClick={() => setIsFilterMenuOpen(p => !p)} className="px-3 text-muted-foreground hover:text-foreground transition-colors" aria-label="Filter tasks">
                      <Filter className="h-5 w-5" />
                    </button>
                    {isFilterMenuOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-40 bg-popover rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            {filterOptions.map(option => (
                              <button key={option.value} onClick={() => { setFilterStatus(option.value); setIsFilterMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-secondary flex items-center justify-between">
                                <span>{option.label}</span>
                                {filterStatus === option.value && <Check className="h-4 w-4 text-primary" />}
                              </button>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
                  <div className="relative" ref={sortMenuRef}>
                    <button onClick={() => setIsSortMenuOpen(p => !p)} className="pl-3 text-muted-foreground hover:text-foreground transition-colors" aria-label="Sort tasks">
                      <ArrowUpDown className="h-5 w-5" />
                    </button>
                    {isSortMenuOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-40 bg-popover rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            {sortOptions.map(option => (
                              <button key={option.value} onClick={() => { setSortOrder(option.value); setIsSortMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-secondary flex items-center justify-between">
                                <span>{option.label}</span>
                                {sortOrder === option.value && <Check className="h-4 w-4 text-primary" />}
                              </button>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setIsTaskModalOpen(true)} className="flex items-center justify-center gap-2 px-3 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold shadow-sm">
                  <Plus className="h-4 w-4" />
                  {t('add.task')}
                </button>
                <button onClick={() => setIsAIModalOpen(true)} className="flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-semibold shadow-sm">
                  <Bot className="h-4 w-4" />
                  AI Task
                </button>
              </div>
            </div>

            {/* Desktop Controls Bar */}
            <div className="hidden md:flex items-center gap-4">
                <div className="relative flex-grow max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Search className="h-5 w-5" /></span>
                    <input type="text" placeholder={t('search.placeholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-background border border-input rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                
                <div className="flex items-center p-1 bg-secondary/70 rounded-lg">
                    {filterOptions.map(opt => <FilterButton key={opt.value} status={opt.value} label={opt.label} />)}
                </div>

                <div className="relative" ref={sortMenuRef}>
                    <button onClick={() => setIsSortMenuOpen(p => !p)} className="flex items-center gap-2 px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground hover:bg-secondary transition-colors">
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        <span>{t(`sort.${sortOrder}`)}</span>
                    </button>
                    {isSortMenuOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                                {sortOptions.map(option => (
                                    <button key={option.value} onClick={() => { setSortOrder(option.value); setIsSortMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-secondary flex items-center justify-between">
                                        <span>{option.label}</span>
                                        {sortOrder === option.value && <Check className="h-4 w-4 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex-grow"></div>

                <button onClick={() => setIsTaskModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm">
                  <Plus className="h-4 w-4" />
                  <span>{t('add.task')}</span>
                </button>
                <button onClick={() => setIsAIModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-input text-foreground rounded-lg hover:bg-secondary transition-colors text-sm font-medium shadow-sm">
                  <Bot className="h-4 w-4" />
                  <span>{t('ai.generator.button')}</span>
                </button>
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