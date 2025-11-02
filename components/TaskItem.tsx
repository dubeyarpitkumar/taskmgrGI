import React, { useState, useRef, useEffect } from 'react';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { Check, Trash, Edit, MoreVertical } from './icons';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
  onViewDetails: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggleStatus, onViewDetails }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const notesRef = useRef<HTMLParagraphElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isCompleted = task.status === TaskStatus.Completed;

  useEffect(() => {
    if (notesRef.current) {
      // Check if notes content is taller than 3 lines (approx 72px)
      setShowReadMore(notesRef.current.scrollHeight > 72);
    }
  }, [task.notes]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('task.delete.confirm'))) {
      onDelete(task.id);
      addToast(t('toast.task.delete.success'), 'success');
    }
    setMenuOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit(task);
      setMenuOpen(false);
  }

  return (
    <div 
      className={`relative flex flex-col bg-background/30 dark:bg-black/20 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${isCompleted ? 'opacity-60' : ''}`}
      onClick={() => onViewDetails(task)}
    >
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between">
          <h3 className={`font-bold text-lg truncate pr-8 ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</h3>
          
          <div className="relative" ref={menuRef}>
            <button onClick={(e) => { e.stopPropagation(); setMenuOpen(prev => !prev);}} className="absolute -top-2 -right-2 p-1 text-muted-foreground hover:text-foreground rounded-full">
                <MoreVertical className="h-5 w-5" />
            </button>
             {menuOpen && (
                 <div className="origin-top-right absolute right-0 mt-8 w-40 rounded-md shadow-lg bg-popover ring-1 ring-black ring-opacity-5 z-10 animate-fade-in" onClick={e => e.stopPropagation()}>
                     <div className="py-1">
                         <button onClick={handleEdit} className="w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-secondary">
                             <Edit className="mr-2 h-4 w-4"/> {t('task.edit')}
                         </button>
                         <button onClick={handleDelete} className="w-full text-left flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10">
                             <Trash className="mr-2 h-4 w-4"/> {t('task.delete')}
                         </button>
                     </div>
                 </div>
             )}
          </div>
        </div>

        {task.notes && (
          <div className="mt-2 text-sm text-muted-foreground">
            <p ref={notesRef} className={isExpanded ? '' : 'line-clamp-3'}>
              {task.notes}
            </p>
            {showReadMore && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-primary text-xs font-semibold mt-1"
              >
                {isExpanded ? t('task.read.less') : t('task.read.more')}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-white/10 px-5 py-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {new Date(task.createdAt).toLocaleDateString()}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(task.id);
          }}
          className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors ${
            isCompleted
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-muted-foreground hover:border-primary'
          }`}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          {isCompleted && <Check className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default TaskItem;