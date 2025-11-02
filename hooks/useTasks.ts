import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from '../types';
import { useAuth } from './useAuth';

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Mock fetching tasks from localStorage
    try {
      const storedTasks = localStorage.getItem('todo_tasks');
      if (storedTasks) {
        const allTasks: Task[] = JSON.parse(storedTasks);
        // Filter tasks for the current user
        const userTasks = allTasks.filter(task => task.userId === user?.id);
        setTasks(userTasks);
      }
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
    } finally {
        // Simulate fetch delay
        setTimeout(() => setLoading(false), 1000);
    }
  }, [user]);

  const saveTasksToLocalStorage = (tasksToSave: Task[]) => {
    try {
        const storedTasks = localStorage.getItem('todo_tasks');
        const allTasks = storedTasks ? JSON.parse(storedTasks) : [];
        // Remove old tasks for the current user
        const otherUsersTasks = allTasks.filter((task: Task) => task.userId !== user?.id);
        // Add new tasks for the current user
        const updatedAllTasks = [...otherUsersTasks, ...tasksToSave];
        localStorage.setItem('todo_tasks', JSON.stringify(updatedAllTasks));
    } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
    }
  };

  const addTask = useCallback((taskData: { title: string; notes?: string }) => {
    if (!user) return;
    const newTask: Task = {
      ...taskData,
      id: new Date().toISOString(),
      status: TaskStatus.Pending,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.id,
    };
    setTasks(prev => {
        const newTasks = [newTask, ...prev];
        saveTasksToLocalStorage(newTasks);
        return newTasks;
    });
  }, [user]);
  
  const addMultipleTasks = useCallback((tasksData: { title: string; notes?: string }[]) => {
    if (!user) return;
    const newTasks: Task[] = tasksData.map(taskData => ({
        ...taskData,
        id: new Date().toISOString() + Math.random(),
        status: TaskStatus.Pending,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
    }));
    
    setTasks(prev => {
        const updatedTasks = [...newTasks, ...prev];
        saveTasksToLocalStorage(updatedTasks);
        return updatedTasks;
    });
  }, [user]);

  const updateTask = useCallback((taskId: string, updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>) => {
    setTasks(prev => {
      const newTasks = prev.map(task =>
        task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      );
      saveTasksToLocalStorage(newTasks);
      return newTasks;
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => {
        const newTasks = prev.filter(task => task.id !== taskId);
        saveTasksToLocalStorage(newTasks);
        return newTasks;
    });
  }, []);

  const toggleTaskStatus = useCallback((taskId: string) => {
    setTasks(prev => {
      const newTasks = prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            status: task.status === TaskStatus.Completed ? TaskStatus.Pending : TaskStatus.Completed,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      });
      saveTasksToLocalStorage(newTasks);
      return newTasks;
    });
  }, []);

  return { tasks, loading, addTask, addMultipleTasks, updateTask, deleteTask, toggleTaskStatus };
};
