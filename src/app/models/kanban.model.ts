export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done'; 
  assignee?: string; 
  color?: string;
}

export interface Board {
  id: string;
  title: string;
  ownerId: string;  
  tasks: Task[];  
  created: Date;
}