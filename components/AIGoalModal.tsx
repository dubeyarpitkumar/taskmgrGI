import React, { useState } from 'react';
import Modal from './Modal';
import { generateTasksFromGoal } from '../services/geminiService';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import { Sparkles, Plus, Check } from './icons';

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
  const [generatedTasks, setGeneratedTasks] = useState<{ title: string; notes: string }[] | null>(null);
  const [savedTasks, setSavedTasks] = useState<Set<string>>(new Set());

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      addToast('Please enter a goal.', 'error');
      return;
    }

    setIsLoading(true);
    setGeneratedTasks(null);
    try {
      const tasks = await generateTasksFromGoal(goal);
      if (tasks.length > 0) {
        setGeneratedTasks(tasks);
        setSavedTasks(new Set());
        addToast(t('toast.ai.success'), 'success');
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
  
  const handleSaveTask = (taskToSave: { title: string; notes?: string }) => {
      onTasksGenerated([taskToSave]);
      setSavedTasks(prev => new Set(prev).add(taskToSave.title));
      addToast(t('toast.task.add.success'), 'success');
  };

  const handleClose = () => {
    onClose();
    // Delay state reset for smoother closing animation
    setTimeout(() => {
        setGoal('');
        setGeneratedTasks(null);
        setIsLoading(false);
        setSavedTasks(new Set());
    }, 300);
  };


  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="">
       <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
                <div className="p-2 bg-primary/10 rounded-full">
                   <Sparkles className="h-5 w-5 text-primary" />
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-foreground">{t('ai.modal.title')}</h3>
                <p className="text-sm text-muted-foreground">
                    {t('ai.modal.description')}
                </p>
            </div>
       </div>

      <form onSubmit={handleGenerate} className="mt-4">
        <div className="flex items-center gap-2">
            <input
              type="text"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="flex-grow bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('ai.modal.goal.placeholder')}
              required
            />
            <button
                type="submit"
                disabled={isLoading}
                className="flex-shrink-0 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t('ai.modal.generate')}
            >
                {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                    <Sparkles className="h-5 w-5" />
                )}
            </button>
        </div>
      </form>

      {isLoading && (
          <div className="mt-6 text-center text-muted-foreground">
            <p>{t('ai.generating')}</p>
          </div>
      )}

      {generatedTasks && (
        <div className="mt-6 max-h-[50vh] overflow-y-auto space-y-3 pr-2 -mr-2">
            {generatedTasks.map((task, index) => {
                const isSaved = savedTasks.has(task.title);
                return (
                    <div key={index} className="bg-background p-4 rounded-lg border border-border shadow-sm">
                        <h4 className="font-semibold text-foreground">{task.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{task.notes}</p>
                        <div className="mt-4">
                            <button 
                                onClick={() => handleSaveTask(task)}
                                disabled={isSaved}
                                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isSaved 
                                    ? 'bg-green-500/10 text-green-600 cursor-default'
                                    : 'bg-orange-500 text-white hover:bg-orange-600'
                                }`}
                            >
                                {isSaved ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        <span>{t('ai.modal.task.saved')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        <span>{t('ai.modal.save.task')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
      )}

    </Modal>
  );
};

export default AIGoalModal;