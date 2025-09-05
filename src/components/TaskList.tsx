import React, { useState } from 'react';
import { Plus, Check, X, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { TimerButton } from './ui/timer-button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  pomodorosEstimated: number;
  pomodorosCompleted: number;
  createdAt: Date;
}

interface TaskListProps {
  onTaskSelect?: (task: Task) => void;
  currentSession?: 'focus' | 'short-break' | 'long-break';
}

export const TaskList: React.FC<TaskListProps> = ({ onTaskSelect, currentSession }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      pomodorosEstimated: newTaskPomodoros,
      pomodorosCompleted: 0,
      createdAt: new Date(),
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setNewTaskPomodoros(1);
    setIsAddingTask(false);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const incrementPomodoro = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId 
          ? { 
              ...task, 
              pomodorosCompleted: Math.min(task.pomodorosCompleted + 1, task.pomodorosEstimated),
              completed: task.pomodorosCompleted + 1 >= task.pomodorosEstimated
            } 
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const getTaskProgress = (task: Task) => {
    return (task.pomodorosCompleted / task.pomodorosEstimated) * 100;
  };

  return (
    <Card className="p-6 shadow-pomodoro-lg bg-card/80 backdrop-blur-sm border-0">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Tasks</h3>
          <TimerButton
            variant="outline"
            size="sm"
            onClick={() => setIsAddingTask(true)}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </TimerButton>
        </div>

        {/* Add Task Form */}
        {isAddingTask && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/50">
            <Input
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="border-0 bg-background"
            />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                min="1"
                max="20"
                value={newTaskPomodoros}
                onChange={(e) => setNewTaskPomodoros(parseInt(e.target.value) || 1)}
                className="w-20 border-0 bg-background"
              />
              <span className="text-sm text-muted-foreground">pomodoros</span>
            </div>
            <div className="flex gap-2">
              <TimerButton
                variant="primary"
                size="sm"
                onClick={addTask}
                disabled={!newTaskTitle.trim()}
              >
                Add
              </TimerButton>
              <TimerButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                  setNewTaskPomodoros(1);
                }}
              >
                Cancel
              </TimerButton>
            </div>
          </div>
        )}

        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Active Tasks</h4>
            {activeTasks.map(task => (
              <div
                key={task.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200 hover:shadow-md",
                  "bg-background/50 hover:bg-background/80 cursor-pointer"
                )}
                onClick={() => onTaskSelect?.(task)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-foreground truncate">
                        {task.title}
                      </h5>
                      <Badge variant="outline" className="text-xs">
                        {task.pomodorosCompleted}/{task.pomodorosEstimated}
                      </Badge>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-pomodoro-focus-primary h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${getTaskProgress(task)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {currentSession === 'focus' && (
                      <TimerButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          incrementPomodoro(task.id);
                        }}
                        className="h-8 w-8 p-0 hover:bg-pomodoro-focus-primary/10"
                      >
                        <Plus className="w-3 h-3" />
                      </TimerButton>
                    )}
                    <TimerButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTask(task.id);
                      }}
                      className="h-8 w-8 p-0 hover:bg-green-500/10"
                    >
                      <Check className="w-3 h-3" />
                    </TimerButton>
                    <TimerButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      className="h-8 w-8 p-0 hover:bg-destructive/10"
                    >
                      <X className="w-3 h-3" />
                    </TimerButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Completed</h4>
            {completedTasks.map(task => (
              <div
                key={task.id}
                className="p-3 rounded-lg bg-muted/30 border border-muted"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-muted-foreground line-through truncate">
                      {task.title}
                    </h5>
                    <Badge variant="outline" className="text-xs mt-1">
                      {task.pomodorosCompleted} pomodoros
                    </Badge>
                  </div>
                  <TimerButton
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10"
                  >
                    <X className="w-3 h-3" />
                  </TimerButton>
                </div>
              </div>
            ))}
          </div>
        )}

        {tasks.length === 0 && !isAddingTask && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No tasks yet.</p>
            <p className="text-xs">Add a task to get started!</p>
          </div>
        )}
      </div>
    </Card>
  );
};