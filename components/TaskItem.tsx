import React from 'react';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { Check, Trash, Edit, GripVertical } from './icons';
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

  const isCompleted = task.status === TaskStatus.Completed;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('task.delete.confirm'))) {
      onDelete(task.id);
      addToast(t('toast.task.delete.success'), 'success');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit(task);
  }

  return (
    <div 
      className={`bg-background border border-border rounded-lg p-4 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-primary/50 ${isCompleted ? 'opacity-60' : ''}`}
    >
        <div className="flex items-start gap-4 flex-1 cursor-pointer min-w-0" onClick={() => onViewDetails(task)}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(task.id);
              }}
              className={`w-6 h-6 flex-shrink-0 mt-0.5 flex items-center justify-center rounded-full border-2 transition-colors ${
                isCompleted
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-orange-400 hover:bg-orange-50'
              }`}
              aria-label={isCompleted ? 'Mark as pending' : 'Mark as complete'}
            >
              {isCompleted && <Check className="w-4 h-4" />}
            </button>
            <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-base truncate ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</h3>
                {task.notes && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {task.notes}
                    </p>
                )}
            </div>
        </div>
        
        <div className="flex items-center gap-1 ml-4 flex-shrink-0">
            <button onClick={handleEdit} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors">
                <Edit className="h-4 w-4" />
            </button>
            <button onClick={handleDelete} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                <Trash className="h-4 w-4" />
            </button>
             <button className="p-2 text-muted-foreground/50 cursor-grab hover:text-foreground hover:bg-secondary rounded-md transition-colors" onClick={e => e.stopPropagation()}>
                <GripVertical className="h-4 w-4" />
            </button>
        </div>
    </div>
  );
};

export default TaskItem;