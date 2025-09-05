import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { CircularProgress } from './CircularProgress';
import { TimerButton } from './ui/timer-button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface PomodoroTimerProps {
  onSessionComplete?: (sessionType: 'focus' | 'short-break' | 'long-break') => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const {
    timeLeft,
    isRunning,
    currentSession,
    sessionCount,
    cycleCount,
    start,
    pause,
    reset,
    skipSession,
    switchToSession,
    formatTime,
    getProgress,
    onSessionComplete: setOnSessionComplete,
  } = usePomodoro();

  useEffect(() => {
    if (onSessionComplete) {
      setOnSessionComplete(onSessionComplete);
    }
  }, [onSessionComplete, setOnSessionComplete]);

  const getSessionLabel = (session: 'focus' | 'short-break' | 'long-break') => {
    switch (session) {
      case 'focus':
        return 'Focus Time';
      case 'short-break':
        return 'Short Break';
      case 'long-break':
        return 'Long Break';
      default:
        return 'Focus Time';
    }
  };

  const getSessionDescription = (session: 'focus' | 'short-break' | 'long-break') => {
    switch (session) {
      case 'focus':
        return 'Time to concentrate and be productive!';
      case 'short-break':
        return 'Take a quick breather and relax.';
      case 'long-break':
        return 'Enjoy a longer break. You\'ve earned it!';
      default:
        return 'Time to focus!';
    }
  };

  const getBackgroundClass = () => {
    switch (currentSession) {
      case 'focus':
        return 'bg-pomodoro-focus-background';
      case 'short-break':
        return 'bg-pomodoro-short-break-background';
      case 'long-break':
        return 'bg-pomodoro-long-break-background';
      default:
        return 'bg-background';
    }
  };

  const getBadgeVariant = (session: 'focus' | 'short-break' | 'long-break') => {
    if (session === currentSession) {
      return 'default';
    }
    return 'secondary';
  };

  return (
    <div className={cn(
      'min-h-screen transition-all duration-500 flex items-center justify-center p-4',
      getBackgroundClass()
    )}>
      <div className="w-full max-w-md mx-auto">
        {/* Session Type Selector */}
        <div className="flex justify-center gap-2 mb-8">
          <Badge 
            variant={getBadgeVariant('focus')}
            className="cursor-pointer px-4 py-2 transition-all duration-200 hover:scale-105"
            onClick={() => switchToSession('focus')}
          >
            Focus
          </Badge>
          <Badge 
            variant={getBadgeVariant('short-break')}
            className="cursor-pointer px-4 py-2 transition-all duration-200 hover:scale-105"
            onClick={() => switchToSession('short-break')}
          >
            Short Break
          </Badge>
          <Badge 
            variant={getBadgeVariant('long-break')}
            className="cursor-pointer px-4 py-2 transition-all duration-200 hover:scale-105"
            onClick={() => switchToSession('long-break')}
          >
            Long Break
          </Badge>
        </div>

        {/* Main Timer Card */}
        <Card className="p-8 shadow-pomodoro-lg bg-card/80 backdrop-blur-sm border-0">
          <div className="text-center space-y-6">
            {/* Session Info */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {getSessionLabel(currentSession)}
              </h1>
              <p className="text-muted-foreground">
                {getSessionDescription(currentSession)}
              </p>
            </div>

            {/* Circular Progress Timer */}
            <div className="flex justify-center">
              <CircularProgress
                percentage={getProgress()}
                size={280}
                strokeWidth={8}
                sessionType={currentSession}
              >
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold text-foreground mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isRunning ? 'Running' : 'Paused'}
                  </div>
                </div>
              </CircularProgress>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4">
              <TimerButton
                variant="outline"
                size="icon"
                onClick={reset}
                className="hover:bg-accent"
              >
                <RotateCcw className="w-5 h-5" />
              </TimerButton>
              
              <TimerButton
                variant={currentSession === 'focus' ? 'primary' : 
                        currentSession === 'short-break' ? 'secondary' : 'tertiary'}
                size="lg"
                onClick={isRunning ? pause : start}
                className="px-8"
              >
                {isRunning ? (
                  <Pause className="w-5 h-5 mr-2" />
                ) : (
                  <Play className="w-5 h-5 mr-2" />
                )}
                {isRunning ? 'Pause' : 'Start'}
              </TimerButton>
              
              <TimerButton
                variant="outline"
                size="icon"
                onClick={skipSession}
                className="hover:bg-accent"
              >
                <SkipForward className="w-5 h-5" />
              </TimerButton>
            </div>

            {/* Session Stats */}
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="font-semibold text-foreground">{sessionCount}</div>
                <div>Sessions</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">{cycleCount}</div>
                <div>Cycles</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};