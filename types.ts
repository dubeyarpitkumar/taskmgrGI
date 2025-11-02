export enum TaskStatus {
  Pending = 'pending',
  Completed = 'completed',
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export enum FilterStatus {
    All = 'all',
    Completed = 'completed',
    Pending = 'pending'
}

export enum SortOrder {
    Latest = 'latest',
    Oldest = 'oldest'
}

export interface User {
  id: string;
  email: string;
}
