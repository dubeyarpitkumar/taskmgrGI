import React from 'react';
import Modal from './Modal';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task }) => {
  const { t } = useTranslation();

  if (!task) return null;

  const statusBadge = task.status === TaskStatus.Completed 
    ? <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-full">{t('filter.completed')}</span>
    : <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">{t('filter.pending')}</span>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('task.detail.title')}>
      <div className="space-y-4">
        <div>
            <h3 className="text-2xl font-bold text-foreground break-words">{task.title}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <strong className="text-foreground">{t('task.detail.status')}:</strong> {statusBadge}
          </div>
          <div className="flex items-center gap-2">
            <strong className="text-foreground">{t('task.detail.created')}:</strong> 
            <span>{new Date(task.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        
        {task.notes && task.notes.trim() && (
          <div className="border-t border-border pt-4">
            <h4 className="font-semibold text-foreground mb-2">{t('task.detail.notes')}</h4>
            <p className="text-muted-foreground whitespace-pre-wrap break-words">{task.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TaskDetailModal;