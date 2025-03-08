"use client";

import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent, 
  DragOverlay,
  PointerSensor, 
  useSensor, 
  useSensors,
  closestCorners,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Moon, Sun, MoreHorizontal, Trash2, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useMediaQuery } from '@/hooks/use-media-query';

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  createdAt: string;
}

interface Column {
  id: string;
  title: string;
  icon: React.ReactNode;
  tasks: Task[];
  color: string;
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900',
    tasks: [
      {
        id: 'task-1',
        title: 'Research investment options',
        description: 'Compare different mutual funds for beginners',
        priority: 'high',
        assignee: {
          name: 'Ankita',
          avatar: '',
        },
        dueDate: '2025-03-15',
        createdAt: '2025-03-01',
      },
      {
        id: 'task-2',
        title: 'Create financial literacy guide',
        description: 'Draft simple explanations for key financial terms',
        priority: 'medium',
        assignee: {
          name: 'Priya',
          avatar: '',
        },
        dueDate: '2025-03-12',
        createdAt: '2025-03-02',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40',
    tasks: [
      {
        id: 'task-3',
        title: 'Develop investment calculator',
        description: 'Create interactive tool for calculating returns',
        priority: 'high',
        assignee: {
          name: 'Meera',
          avatar: '',
        },
        dueDate: '2025-03-10',
        createdAt: '2025-03-03',
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    icon: <Calendar className="h-4 w-4" />,
    color: 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40',
    tasks: [
      {
        id: 'task-4',
        title: 'Design new user onboarding',
        description: 'Create simplified flow for first-time investors',
        priority: 'medium',
        assignee: {
          name: 'Tanvi',
          avatar: '',
        },
        dueDate: '2025-03-09',
        createdAt: '2025-03-04',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40',
    tasks: [
      {
        id: 'task-5',
        title: 'Update investment glossary',
        description: 'Add more beginner-friendly terms',
        priority: 'low',
        assignee: {
          name: 'Sneha',
          avatar: '',
        },
        dueDate: '2025-03-05',
        createdAt: '2025-02-28',
      },
    ],
  },
];

const useMediaQueries = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  
  return {
    isMobile,
    isTablet,
    isDesktop
  };
};

// Draggable Task Component
function DraggableTask({ task, renderTask }: { task: Task; renderTask: (task: Task) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { type: 'task', task }
  });
  
  return (
    <div 
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ touchAction: 'none' }}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      {renderTask(task)}
    </div>
  );
}

// Droppable Column Component
function DroppableColumn({ column, children, columnWidth }: { column: Column; children: React.ReactNode; columnWidth: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', column }
  });
  
  return (
    <motion.div
      ref={setNodeRef}
      key={column.id}
      className={`${columnWidth} flex flex-col rounded-lg ${column.color} ${isOver ? 'ring-2 ring-pink-500 ring-inset' : ''} backdrop-blur-sm`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskColumn, setNewTaskColumn] = useState('');
  const { theme, setTheme } = useTheme();
  const { isMobile, isTablet } = useMediaQueries();
  const [mounted, setMounted] = useState(false);

  // Set mounted to true on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    setActiveId(taskId);
    
    // Find the task
    for (const column of columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        setActiveTask(task);
        return;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !activeTask) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }
    
    const taskId = active.id as string;
    const destinationColumnId = over.id as string;
    
    // Find source column
    const sourceColumn = columns.find(col => col.tasks.some(task => task.id === taskId));
    
    if (!sourceColumn || sourceColumn.id === destinationColumnId) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }
    
    setColumns(prev => {
      // Remove from source column
      const newColumns = prev.map(col => {
        if (col.tasks.some(task => task.id === taskId)) {
          return {
            ...col,
            tasks: col.tasks.filter(task => task.id !== taskId),
          };
        }
        return col;
      });
      
      // Add to destination column
      return newColumns.map(col => {
        if (col.id === destinationColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, activeTask],
          };
        }
        return col;
      });
    });
    
    setActiveId(null);
    setActiveTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setColumns(prev => 
      prev.map(col => ({
        ...col,
        tasks: col.tasks.filter(task => task.id !== taskId)
      }))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as 'low' | 'medium' | 'high';
    const dueDate = formData.get('dueDate') as string;
    
    if (!title || !newTaskColumn) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      priority,
      assignee: {
        name: 'You',
        avatar: '',
      },
      dueDate,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setColumns(prev => 
      prev.map(col => {
        if (col.id === newTaskColumn) {
          return {
            ...col,
            tasks: [...col.tasks, newTask],
          };
        }
        return col;
      })
    );
    
    setIsAddTaskOpen(false);
    form.reset();
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-500 text-white dark:bg-rose-600';
      case 'medium':
        return 'bg-amber-500 text-white dark:bg-amber-600';
      case 'low':
        return 'bg-emerald-500 text-white dark:bg-emerald-600';
      default:
        return 'bg-slate-500 text-white dark:bg-slate-600';
    }
  };

  // If not mounted yet (SSR), render a simplified version
  if (!mounted) {
    return <div className="h-screen flex items-center justify-center">Loading Kanban...</div>;
  }

  const renderTask = (task: Task, isDragging: boolean = false) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`border border-slate-200 dark:border-slate-800 shadow-sm ${
          isDragging ? 'opacity-75' : 'hover:shadow-md'
        } transition-all bg-white dark:bg-slate-950`}
      >
        <CardHeader className="p-3 pb-0">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
            <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
              {task.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {task.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee.avatar} />
                    <AvatarFallback className="text-xs bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                      {task.assignee.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{task.assignee.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-xs text-slate-500 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          {!isDragging && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-red-500 dark:text-red-400 focus:text-red-500 dark:focus:text-red-400"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );

  const columnWidth = isMobile ? 'w-full' : isTablet ? 'w-64' : 'w-80';

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-950"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white">
            <span className="text-pink-500">Our</span> Kanban
          </h1>
          <Badge className="bg-pink-500 hover:bg-pink-600">
            {columns.reduce((acc, col) => acc + col.tasks.length, 0)} Tasks
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Add Task</span>
                <span className="md:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task to add to your board.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTask}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="Enter task title" required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Enter task description" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="column">Column</Label>
                    <Select onValueChange={setNewTaskColumn} required defaultValue="">
                      <SelectTrigger>
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map(col => (
                          <SelectItem key={col.id} value={col.id}>{col.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input type="date" id="dueDate" name="dueDate" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                    Add Task
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="border-slate-200 dark:border-slate-800"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </motion.header>
      
      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className={`flex flex-col md:flex-row gap-12 p-8 overflow-auto h-[calc(100vh-73px)]`}>
          <AnimatePresence>
            {columns.map((column) => (
              <DroppableColumn 
                key={column.id} 
                column={column} 
                columnWidth={columnWidth}
              >
                <div className="p-3 font-medium flex justify-between items-center border-b border-slate-200/20 dark:border-slate-800/20">
                  <div className="flex items-center gap-2">
                    {column.icon}
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {column.title} <span className="ml-1 text-slate-500 dark:text-slate-400">({column.tasks.length})</span>
                    </h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-full hover:bg-white/20 dark:hover:bg-black/20"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  <AnimatePresence>
                    {column.tasks.map(task => (
                      <DraggableTask 
                        key={task.id} 
                        task={task} 
                        renderTask={renderTask}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                
                <div className="p-3 border-t border-slate-200/20 dark:border-slate-800/20">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-black/20 hover:text-pink-500 dark:hover:text-pink-400"
                    onClick={() => {
                      setNewTaskColumn(column.id);
                      setIsAddTaskOpen(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add task
                  </Button>
                </div>
              </DroppableColumn>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeId && activeTask ? renderTask(activeTask, true) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;