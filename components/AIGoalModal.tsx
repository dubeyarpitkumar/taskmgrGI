import React, { useState } from 'react';
import Modal from './Modal';
import { generateTasksFromGoal } from '../services/geminiService';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import { Bot } from './icons';

interface AIGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksGenerated: (tasks: { title: string; notes?: string }[]) => void;
}

const AIGoalModal: React.FC<AIGoalModalProps> = ({ isOpen, onClose, onTasksGenerated }) => {
  const { t } = useTranslation();
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      addToast('Please enter a goal.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const tasks = await generateTasksFromGoal(goal);
      if (tasks.length > 0) {
        onTasksGenerated(tasks);
        addToast(t('toast.ai.success'), 'success');
        onClose();
        setGoal('');
      } else {
        addToast("Couldn't generate tasks. Try a different goal.", 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('toast.error.generic');
      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('ai.modal.title')}>
      <form onSubmit={handleGenerate}>
        <p className="text-sm text-muted-foreground mb-4">
          {t('ai.modal.description')}
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="goal" className="sr-only">
              {t('ai.modal.goal.placeholder')}
            </label>
            <input
              type="text"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1 block w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('ai.modal.goal.placeholder')}
              required
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                 <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 <span>{t('ai.generating')}</span>
              </>
            ) : (
                <>
                    <Bot className="h-4 w-4" />
                    <span>{t('ai.modal.generate')}</span>
                </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AIGoalModal;
