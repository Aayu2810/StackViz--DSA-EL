// Stack Engine - Core LIFO logic for Stack-Augmented Decoding

import { Task, StackState, ProcessingStep, DecompositionResult } from '@/types';

export class StackEngine {
  private stack: Task[] = [];
  private completedTasks: Task[] = [];
  private listeners: Set<(state: StackState) => void> = new Set();
  private isProcessing = false;
  private prompt = '';

  constructor() {
    this.reset();
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  subscribe(listener: (state: StackState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): StackState {
    return {
      tasks: [...this.stack],
      currentTask: this.stack.length > 0 ? this.stack[this.stack.length - 1] : null,
      completedTasks: [...this.completedTasks],
      isProcessing: this.isProcessing,
      stackHeight: this.stack.length,
      prompt: this.prompt,
    };
  }

  reset() {
    this.stack = [];
    this.completedTasks = [];
    this.isProcessing = false;
    this.prompt = '';
    this.notify();
  }

  setPrompt(prompt: string) {
    this.prompt = prompt;
    this.notify();
  }

  push(task: Task): ProcessingStep {
    this.stack.push(task);
    this.notify();
    return {
      type: 'push',
      task,
      timestamp: Date.now(),
    };
  }

  pop(): ProcessingStep | null {
    const task = this.stack.pop();
    if (task) {
      task.status = 'completed';
      this.completedTasks.push(task);
      this.notify();
      return {
        type: 'pop',
        task,
        timestamp: Date.now(),
      };
    }
    return null;
  }

  peek(): Task | null {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }

  setProcessing(isProcessing: boolean) {
    this.isProcessing = isProcessing;
    this.notify();
  }

  updateCurrentTask(updates: Partial<Task>) {
    if (this.stack.length > 0) {
      const currentTask = this.stack[this.stack.length - 1];
      Object.assign(currentTask, updates);
      this.notify();
    }
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  size(): number {
    return this.stack.length;
  }
}

// Decompose a prompt into subtasks
export function decomposePrompt(prompt: string): DecompositionResult {
  // Smart decomposition based on prompt complexity
  const lowercasePrompt = prompt.toLowerCase();
  
  // Math/calculation prompts
  if (lowercasePrompt.includes('solve') || lowercasePrompt.includes('calculate') || lowercasePrompt.includes('math')) {
    return {
      subtasks: [
        'Parse and understand the mathematical expression',
        'Identify the order of operations (PEMDAS)',
        'Execute calculations step by step',
        'Verify the result with reverse calculation',
        'Format and present the final answer',
      ],
      reasoning: 'Mathematical problems require systematic breakdown into parsing, calculation, and verification steps.',
    };
  }
  
  // Research/analysis prompts
  if (lowercasePrompt.includes('analyze') || lowercasePrompt.includes('research') || lowercasePrompt.includes('explain')) {
    return {
      subtasks: [
        'Define the scope and key concepts',
        'Gather relevant information and context',
        'Analyze relationships and patterns',
        'Synthesize findings into coherent explanation',
        'Provide examples and supporting evidence',
      ],
      reasoning: 'Analytical tasks benefit from structured information gathering and synthesis.',
    };
  }
  
  // Creative/writing prompts
  if (lowercasePrompt.includes('write') || lowercasePrompt.includes('create') || lowercasePrompt.includes('story')) {
    return {
      subtasks: [
        'Establish the creative vision and tone',
        'Develop the core structure or outline',
        'Generate initial content draft',
        'Refine language and style',
        'Polish and finalize the output',
      ],
      reasoning: 'Creative tasks require vision, structure, iteration, and refinement.',
    };
  }
  
  // Comparison prompts
  if (lowercasePrompt.includes('compare') || lowercasePrompt.includes('difference') || lowercasePrompt.includes('versus')) {
    return {
      subtasks: [
        'Identify the subjects being compared',
        'Define comparison criteria',
        'Analyze each subject against criteria',
        'Identify similarities and differences',
        'Draw conclusions and recommendations',
      ],
      reasoning: 'Comparison tasks require systematic evaluation against defined criteria.',
    };
  }
  
  // Planning/strategy prompts
  if (lowercasePrompt.includes('plan') || lowercasePrompt.includes('strategy') || lowercasePrompt.includes('how to')) {
    return {
      subtasks: [
        'Define the goal and success criteria',
        'Assess current state and resources',
        'Identify potential approaches',
        'Develop detailed action steps',
        'Anticipate challenges and mitigations',
      ],
      reasoning: 'Planning tasks require goal definition, analysis, and structured execution steps.',
    };
  }
  
  // Default generic decomposition
  return {
    subtasks: [
      'Understand the request and context',
      'Break down into manageable components',
      'Process each component systematically',
      'Integrate results into cohesive output',
      'Review and refine the final response',
    ],
    reasoning: 'General tasks benefit from a systematic understand-process-integrate approach.',
  };
}

// Create a task from a subtask string
export function createTask(title: string, depth: number, order: number): Task {
  return {
    id: `task-${Date.now()}-${order}`,
    title,
    description: `Processing: ${title}`,
    status: 'pending',
    depth,
    order,
  };
}

// Generate mock result for a task
export function generateTaskResult(task: Task): string {
  const results: Record<string, string> = {
    'Parse': '✓ Expression parsed successfully. Identified operators and operands.',
    'Identify': '✓ Analysis complete. Key factors identified and prioritized.',
    'Execute': '✓ Processing complete. Intermediate results computed.',
    'Verify': '✓ Verification passed. Results validated against constraints.',
    'Format': '✓ Output formatted. Ready for presentation.',
    'Define': '✓ Scope defined. Key concepts established.',
    'Gather': '✓ Information collected. Context established.',
    'Analyze': '✓ Patterns identified. Relationships mapped.',
    'Synthesize': '✓ Findings integrated. Coherent narrative formed.',
    'Provide': '✓ Examples generated. Evidence compiled.',
    'Establish': '✓ Vision set. Creative direction established.',
    'Develop': '✓ Structure created. Outline complete.',
    'Generate': '✓ Draft produced. Initial content ready.',
    'Refine': '✓ Style polished. Language enhanced.',
    'Polish': '✓ Final review complete. Output finalized.',
    'Understand': '✓ Request analyzed. Context understood.',
    'Break': '✓ Components identified. Tasks decomposed.',
    'Process': '✓ Processing complete. Components handled.',
    'Integrate': '✓ Results combined. Output assembled.',
    'Review': '✓ Quality check passed. Response ready.',
  };

  // Find matching result based on task title
  for (const [key, result] of Object.entries(results)) {
    if (task.title.toLowerCase().includes(key.toLowerCase())) {
      return result;
    }
  }

  return `✓ ${task.title} completed successfully.`;
}

// Singleton instance
export const stackEngine = new StackEngine();
