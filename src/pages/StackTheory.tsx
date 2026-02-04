import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Database, 
  Code, 
  BookOpen, 
  Lightbulb,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
import { fadeInUp, staggerContainer, stackPush, stackPop, cardHover } from '@/lib/animations';

interface StackItem {
  id: number;
  value: string;
  status: 'pushing' | 'popping' | 'idle';
}

const StackTheory: React.FC = () => {
  const [stack, setStack] = useState<StackItem[]>([
    { id: 1, value: 'main()', status: 'idle' },
    { id: 2, value: 'calculate()', status: 'idle' },
    { id: 3, value: 'process()', status: 'idle' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeOperation, setActiveOperation] = useState<'push' | 'pop' | null>(null);

  const pushToStack = () => {
    if (!inputValue.trim()) return;
    
    setActiveOperation('push');
    const newItem: StackItem = {
      id: Date.now(),
      value: inputValue,
      status: 'pushing'
    };
    
    setStack(prev => [...prev, newItem]);
    setInputValue('');
    
    setTimeout(() => {
      setStack(prev => 
        prev.map(item => 
          item.id === newItem.id ? { ...item, status: 'idle' } : item
        )
      );
      setActiveOperation(null);
    }, 500);
  };

  const popFromStack = () => {
    if (stack.length === 0) return;
    
    setActiveOperation('pop');
    const topItem = stack[stack.length - 1];
    
    setStack(prev => 
      prev.map(item => 
        item.id === topItem.id ? { ...item, status: 'popping' } : item
      )
    );
    
    setTimeout(() => {
      setStack(prev => prev.slice(0, -1));
      setActiveOperation(null);
    }, 500);
  };

  const stackOperations = [
    {
      name: 'Push',
      description: 'Add an element to the top of the stack',
      complexity: 'O(1)',
      icon: ArrowUp,
      color: 'text-green-500'
    },
    {
      name: 'Pop',
      description: 'Remove the top element from the stack',
      complexity: 'O(1)',
      icon: ArrowDown,
      color: 'text-red-500'
    },
    {
      name: 'Peek/Top',
      description: 'View the top element without removing it',
      complexity: 'O(1)',
      icon: Database,
      color: 'text-blue-500'
    },
    {
      name: 'IsEmpty',
      description: 'Check if the stack is empty',
      complexity: 'O(1)',
      icon: CheckCircle,
      color: 'text-purple-500'
    }
  ];

  const realWorldApplications = [
    {
      title: 'Function Call Stack',
      description: 'Manages function calls and returns in programming languages',
      icon: Code,
      example: 'When you call a function, it\'s pushed onto the call stack. When it returns, it\'s popped off.'
    },
    {
      title: 'Undo/Redo Systems',
      description: 'Tracks user actions for undo functionality',
      icon: Clock,
      example: 'Each action is pushed onto a stack. Undo pops the last action.'
    },
    {
      title: 'Browser History',
      description: 'Manages navigation history in web browsers',
      icon: ArrowRight,
      example: 'Each page visit is pushed. Back button pops to previous page.'
    },
    {
      title: 'Expression Evaluation',
      description: 'Evaluates mathematical expressions and parsing',
      icon: Lightbulb,
      example: 'Used in compilers to evaluate expressions with proper precedence.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Navigation Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Stack Theory
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Introduction Section */}
          <motion.section
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Understanding Stacks in Data Structures
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. 
                Think of it like a stack of plates - you can only add or remove from the top.
              </p>
            </div>
          </motion.section>

          {/* Interactive Stack Demo */}
          <motion.section
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-500" />
                  Interactive Stack Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Stack Visualization */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Stack Visualization</h3>
                    <div className="relative">
                      {/* Stack Container */}
                      <div className="w-full h-96 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                        <div className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400">
                          TOP
                        </div>
                        
                        {/* Stack Items */}
                        <div className="flex flex-col-reverse gap-2 h-full">
                          <AnimatePresence>
                            {stack.map((item, index) => (
                              <motion.div
                                key={item.id}
                                initial={{ 
                                  opacity: 0, 
                                  x: item.status === 'pushing' ? 100 : -100,
                                  scale: item.status === 'pushing' ? 0.8 : 1
                                }}
                                animate={{ 
                                  opacity: 1, 
                                  x: 0,
                                  scale: item.status === 'popping' ? 0.8 : 1,
                                  backgroundColor: item.status === 'pushing' ? '#10b981' : 
                                                item.status === 'popping' ? '#ef4444' : 
                                                index === stack.length - 1 ? '#3b82f6' : '#6b7280'
                                }}
                                exit={{ 
                                  opacity: 0, 
                                  x: -100,
                                  scale: 0.8
                                }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-center h-12 rounded-md text-white font-medium shadow-lg"
                              >
                                {item.value}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          
                          {stack.length === 0 && (
                            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                              Stack is empty
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Stack Operations</h3>
                    
                    {/* Push Operation */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Push Operation
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && pushToStack()}
                          placeholder="Enter value to push"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <Button
                          onClick={pushToStack}
                          disabled={!inputValue.trim() || activeOperation !== null}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <ArrowUp className="w-4 h-4" />
                          Push
                        </Button>
                      </div>
                    </div>

                    {/* Pop Operation */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pop Operation
                      </label>
                      <Button
                        onClick={popFromStack}
                        disabled={stack.length === 0 || activeOperation !== null}
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        <ArrowDown className="w-4 h-4" />
                        Pop Top Element
                      </Button>
                    </div>

                    {/* Stack Info */}
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Stack Size:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{stack.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Top Element:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {stack.length > 0 ? stack[stack.length - 1].value : 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {activeOperation ? `${activeOperation}ing...` : 'Ready'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Stack Operations */}
          <motion.section
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Stack Operations
            </h2>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stackOperations.map((operation, index) => (
                <motion.div
                  key={operation.name}
                  variants={fadeInUp}
                  whileHover={cardHover.hover}
                  whileTap={cardHover.tap}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 ${operation.color}`}>
                    <operation.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{operation.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{operation.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                      {operation.complexity}
                    </span>
                    <Zap className="w-4 h-4 text-yellow-500" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Real World Applications */}
          <motion.section
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Real-World Applications
            </h2>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid md:grid-cols-2 gap-6"
            >
              {realWorldApplications.map((app, index) => (
                <motion.div
                  key={app.title}
                  variants={fadeInUp}
                  whileHover={cardHover.hover}
                  whileTap={cardHover.tap}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <app.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{app.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{app.description}</p>
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-300 italic">{app.example}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Implementation Examples */}
          <motion.section
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Implementation Examples
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-500" />
                    Array Implementation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
{`class Stack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
  }
  
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }
  
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}`}
                  </pre>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-500" />
                    Linked List Implementation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
{`class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class Stack {
  constructor() {
    this.top = null;
  }
  
  push(data) {
    const newNode = new Node(data);
    newNode.next = this.top;
    this.top = newNode;
  }
  
  pop() {
    if (!this.top) return null;
    const temp = this.top;
    this.top = this.top.next;
    return temp.data;
  }
}`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default StackTheory;
