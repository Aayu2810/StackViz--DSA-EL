// Mock LLM - Simulated AI responses for demonstration

import { LLMResponse, Task } from '@/types';

// Simulate API latency
const simulateLatency = (min: number, max: number): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Generate thinking text with realistic typing effect
export async function* streamThinking(task: Task): AsyncGenerator<string> {
  const thinkingPhrases = [
    `Analyzing: "${task.title}"...`,
    'Processing input parameters...',
    'Applying reasoning patterns...',
    'Evaluating intermediate results...',
    'Generating structured output...',
    'Finalizing response...',
  ];

  for (const phrase of thinkingPhrases) {
    await simulateLatency(100, 300);
    yield phrase;
  }
}

// Process a single task with simulated LLM
export async function processTask(task: Task): Promise<LLMResponse> {
  await simulateLatency(800, 1500);
  
  const responses: Record<string, string> = {
    'parse': 'Successfully parsed the input. Identified key components and their relationships.',
    'identify': 'Identified the core elements. Mapped dependencies and priority order.',
    'execute': 'Executed the processing step. Generated intermediate results.',
    'verify': 'Verification complete. All constraints satisfied, results validated.',
    'format': 'Formatted output for presentation. Applied styling and structure.',
    'define': 'Defined scope boundaries. Established key concepts and terminology.',
    'gather': 'Gathered relevant information. Built comprehensive context model.',
    'analyze': 'Analysis complete. Discovered patterns and extracted insights.',
    'synthesize': 'Synthesized findings. Created coherent narrative from components.',
    'understand': 'Understanding established. Context and intent clarified.',
    'break': 'Decomposition complete. Created manageable sub-components.',
    'process': 'Processing finished. All components handled systematically.',
    'integrate': 'Integration successful. Combined results into unified output.',
    'review': 'Review passed. Quality assured and response finalized.',
    'establish': 'Established creative direction. Vision and tone defined.',
    'develop': 'Development complete. Structure and outline ready.',
    'generate': 'Generation finished. Initial content produced.',
    'refine': 'Refinement applied. Style and language enhanced.',
    'polish': 'Polish complete. Final touches applied.',
    'default': 'Task processed successfully. Output generated as expected.',
  };

  const taskLower = task.title.toLowerCase();
  let content = responses.default;
  
  for (const [key, response] of Object.entries(responses)) {
    if (taskLower.includes(key)) {
      content = response;
      break;
    }
  }

  return {
    content,
    tokens: Math.floor(Math.random() * 50) + 20,
    latency: Math.floor(Math.random() * 500) + 300,
  };
}

// Generate final synthesized response
export async function generateFinalResponse(prompt: string, completedTasks: Task[]): Promise<string> {
  await simulateLatency(500, 1000);
  
  const taskSummaries = completedTasks
    .map((t, i) => `${i + 1}. ${t.title}: ${t.result || 'Completed'}`)
    .join('\n');

  return `## Stack-Augmented Response

Based on systematic LIFO processing of your prompt, here is the synthesized result:

### Processing Summary
${taskSummaries}

### Final Output
The stack-based decomposition successfully broke down your complex request into ${completedTasks.length} atomic tasks. Each task was processed in reverse order (Last-In-First-Out), ensuring that dependencies were properly resolved before dependent tasks executed.

**Key Insight:** The stack data structure enabled transparent reasoning by making each processing step visible and traceable. This approach provides:
- Clear task dependency management
- Explainable reasoning chains
- Reversible processing for debugging
- Memory-efficient sequential execution

*Powered by Stack-Augmented Decoding*`;
}

// Example prompts for demonstration
export const examplePrompts = [
  {
    text: "Solve the equation: 3x² + 5x - 2 = 0 and verify the solutions",
    category: "Math",
    icon: "calculator",
  },
  {
    text: "Explain how photosynthesis works and its importance for life on Earth",
    category: "Science",
    icon: "leaf",
  },
  {
    text: "Compare and contrast React vs Vue for building web applications",
    category: "Tech",
    icon: "code",
  },
  {
    text: "Create a step-by-step plan to learn machine learning in 3 months",
    category: "Planning",
    icon: "target",
  },
  {
    text: "Write a short story about a robot discovering emotions",
    category: "Creative",
    icon: "sparkles",
  },
  {
    text: "Analyze the economic impact of renewable energy adoption",
    category: "Analysis",
    icon: "chart",
  },
];
