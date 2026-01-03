// Stack-Augmented Decoding Types

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  result?: string;
  depth: number;
  order: number;
}

export interface StackState {
  tasks: Task[];
  currentTask: Task | null;
  completedTasks: Task[];
  isProcessing: boolean;
  stackHeight: number;
  prompt: string;
}

export interface ProcessingStep {
  type: 'decompose' | 'push' | 'process' | 'pop' | 'complete';
  task?: Task;
  timestamp: number;
}

export interface DecompositionResult {
  subtasks: string[];
  reasoning: string;
}

export interface LLMResponse {
  content: string;
  tokens: number;
  latency: number;
}

export interface StackBlock {
  id: string;
  task: Task;
  position: [number, number, number];
  color: string;
  isActive: boolean;
}

export interface AnimationVariant {
  initial: object;
  animate: object;
  exit: object;
  transition?: object;
}
