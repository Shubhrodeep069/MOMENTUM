import React, { useState } from 'react';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { TaskList } from '@/components/TaskList';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [currentSession, setCurrentSession] = useState<'focus' | 'short-break' | 'long-break'>('focus');

  const handleSessionComplete = (sessionType: 'focus' | 'short-break' | 'long-break') => {
    // Show completion notification
    const messages = {
      focus: "Great job! You completed a focus session. Time for a break!",
      'short-break': "Break time's over! Ready to focus again?",
      'long-break': "Long break complete! You're doing amazing!"
    };

    toast({
      title: "Session Complete!",
      description: messages[sessionType],
    });

    // Update current session for task list context
    setTimeout(() => {
      if (sessionType === 'focus') {
        // Will be set to break session by timer logic
      } else {
        setCurrentSession('focus');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Timer - Takes up 2/3 on desktop */}
          <div className="lg:col-span-2">
            <PomodoroTimer onSessionComplete={handleSessionComplete} />
          </div>
          
          {/* Task List - Takes up 1/3 on desktop, full width on mobile */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TaskList currentSession={currentSession} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
