// Zustand store for stack visualization state

import { create } from 'zustand';
import { Task, ProcessingStep } from '@/types';
import { stackEngine, decomposePrompt, createTask, generateTaskResult } from './stack-engine';
import { processTask, generateFinalResponse } from './mock-llm';

interface StackStore {
  // State
  tasks: Task[];
  currentTask: Task | null;
  completedTasks: Task[];
  isProcessing: boolean;
  isDecomposing: boolean;
  stackHeight: number;
  prompt: string;
  processingProgress: number;
  currentThinking: string;
  finalResponse: string | null;
  history: ProcessingStep[];
  
  // Actions
  setPrompt: (prompt: string) => void;
  startProcessing: () => Promise<void>;
  reset: () => void;
  addToHistory: (step: ProcessingStep) => void;
}

export const useStackStore = create<StackStore>((set, get) => ({
  // Initial state
  tasks: [],
  currentTask: null,
  completedTasks: [],
  isProcessing: false,
  isDecomposing: false,
  stackHeight: 0,
  prompt: '',
  processingProgress: 0,
  currentThinking: '',
  finalResponse: null,
  history: [],

  setPrompt: (prompt: string) => {
    set({ prompt });
    stackEngine.setPrompt(prompt);
  },

  startProcessing: async () => {
    const { prompt } = get();
    if (!prompt.trim()) return;

    // Reset state
    stackEngine.reset();
    set({
      isProcessing: true,
      isDecomposing: true,
      tasks: [],
      completedTasks: [],
      currentTask: null,
      processingProgress: 0,
      currentThinking: 'Analyzing prompt structure...',
      finalResponse: null,
      history: [],
    });

    // Simulate decomposition delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Decompose prompt into subtasks
    const { subtasks } = decomposePrompt(prompt);
    set({ currentThinking: 'Breaking down into subtasks...' });
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create tasks and push to stack (reverse order for LIFO)
    const createdTasks: Task[] = [];
    for (let i = subtasks.length - 1; i >= 0; i--) {
      const task = createTask(subtasks[i], 0, subtasks.length - 1 - i);
      createdTasks.unshift(task);
      stackEngine.push(task);
      
      set({ 
        tasks: [...stackEngine.getState().tasks],
        stackHeight: stackEngine.size(),
        currentThinking: `Pushed: ${task.title}`,
      });
      
      get().addToHistory({
        type: 'push',
        task,
        timestamp: Date.now(),
      });
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    set({ isDecomposing: false });

    // Process stack (LIFO)
    const totalTasks = stackEngine.size();
    let processedCount = 0;

    while (!stackEngine.isEmpty()) {
      const currentTask = stackEngine.peek();
      if (!currentTask) break;

      // Update current task status
      stackEngine.updateCurrentTask({ status: 'processing' });
      set({
        tasks: [...stackEngine.getState().tasks],
        currentTask,
        currentThinking: `Processing: ${currentTask.title}`,
      });

      // Simulate LLM processing
      const response = await processTask(currentTask);
      
      // Generate result and pop
      const result = generateTaskResult(currentTask);
      stackEngine.updateCurrentTask({ result, status: 'completed' });
      
      const poppedStep = stackEngine.pop();
      if (poppedStep) {
        get().addToHistory(poppedStep);
      }

      processedCount++;
      set({
        tasks: [...stackEngine.getState().tasks],
        completedTasks: [...stackEngine.getState().completedTasks],
        stackHeight: stackEngine.size(),
        processingProgress: (processedCount / totalTasks) * 100,
        currentThinking: `Completed: ${currentTask.title}`,
      });

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Generate final response
    set({ currentThinking: 'Synthesizing final response...' });
    const completedTasks = stackEngine.getState().completedTasks;
    const finalResponse = await generateFinalResponse(prompt, completedTasks);

    set({
      isProcessing: false,
      currentTask: null,
      currentThinking: '',
      finalResponse,
      processingProgress: 100,
    });

    get().addToHistory({
      type: 'complete',
      timestamp: Date.now(),
    });
  },

  reset: () => {
    stackEngine.reset();
    set({
      tasks: [],
      currentTask: null,
      completedTasks: [],
      isProcessing: false,
      isDecomposing: false,
      stackHeight: 0,
      prompt: '',
      processingProgress: 0,
      currentThinking: '',
      finalResponse: null,
      history: [],
    });
  },

  addToHistory: (step: ProcessingStep) => {
    set(state => ({
      history: [...state.history, step],
    }));
  },
}));
