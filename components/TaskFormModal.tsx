import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Task } from '../types';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string | { title: string; notes?: string }, updates?: Partial<Omit<Task, 'id'>>) => void;
  task?: Task | null;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const { addToast } = useToast();
  
  const isEditing = !!task;

  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title || '');
      setNotes(task?.notes || '');
    }
  }, [isOpen, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Title is required.', 'error');
      return;
    }
    
    if (isEditing && task) {
      onSave(task.id, { title, notes });
      addToast(t('toast.task.update.success'), 'success');
    } else {
      onSave({ title, notes });
      addToast(t('toast.task.add.success'), 'success');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('task.form.edit.title') : t('task.form.add.title')}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              {t('task.form.title.label')}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-foreground">
              {t('task.form.notes.label')}
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-1 block w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            ></textarea>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {isEditing ? t('task.form.update') : t('task.form.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
