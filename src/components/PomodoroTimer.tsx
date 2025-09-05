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
        <div className="flex justify-center gap-2 mb-8 animate-fade-in">
          <Badge 
            variant={getBadgeVariant('focus')}
            className={cn(
              "cursor-pointer px-4 py-2 transition-all duration-300 hover:scale-110 hover:-translate-y-1 relative overflow-hidden",
              currentSession === 'focus' && "animate-bounce-gentle shadow-focus-glow",
              "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500"
            )}
            onClick={() => switchToSession('focus')}
          >
            Focus
          </Badge>
          <Badge 
            variant={getBadgeVariant('short-break')}
            className={cn(
              "cursor-pointer px-4 py-2 transition-all duration-300 hover:scale-110 hover:-translate-y-1 relative overflow-hidden",
              currentSession === 'short-break' && "animate-bounce-gentle shadow-short-break-glow",
              "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500"
            )}
            onClick={() => switchToSession('short-break')}
          >
            Short Break
          </Badge>
          <Badge 
            variant={getBadgeVariant('long-break')}
            className={cn(
              "cursor-pointer px-4 py-2 transition-all duration-300 hover:scale-110 hover:-translate-y-1 relative overflow-hidden",
              currentSession === 'long-break' && "animate-bounce-gentle shadow-long-break-glow",
              "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500"
            )}
            onClick={() => switchToSession('long-break')}
          >
            Long Break
          </Badge>
        </div>

        {/* Main Timer Card */}
        <Card className="p-8 shadow-pomodoro-lg bg-card/80 backdrop-blur-sm border-0 transition-all duration-500 hover:shadow-pomodoro-glow hover:scale-[1.02] animate-scale-in">
          <div className="text-center space-y-6">
            {/* Session Info */}
            <div className="space-y-2 animate-fade-in">
              <h1 className="text-2xl font-bold text-foreground transition-all duration-300 hover:scale-105">
                {getSessionLabel(currentSession)}
              </h1>
              <p className="text-muted-foreground transition-all duration-300">
                {getSessionDescription(currentSession)}
              </p>
            </div>

            {/* Circular Progress Timer */}
            <div className="flex justify-center animate-scale-in">
              <div className={cn(
                "transition-all duration-500",
                isRunning && "animate-float"
              )}>
                <CircularProgress
                  percentage={getProgress()}
                  size={280}
                  strokeWidth={8}
                  sessionType={currentSession}
                >
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold text-foreground mb-2 transition-all duration-300 hover:scale-110">
                      {formatTime(timeLeft)}
                    </div>
                    <div className={cn(
                      "text-sm transition-all duration-300",
                      isRunning ? "text-primary animate-pulse" : "text-muted-foreground"
                    )}>
                      {isRunning ? 'Running' : 'Paused'}
                    </div>
                  </div>
                </CircularProgress>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4 animate-fade-in">
              <TimerButton
                variant="outline"
                size="icon"
                onClick={reset}
                className="hover:bg-accent group"
              >
                <RotateCcw className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
              </TimerButton>
              
              <TimerButton
                variant={currentSession === 'focus' ? 'primary' : 
                        currentSession === 'short-break' ? 'secondary' : 'tertiary'}
                size="lg"
                onClick={isRunning ? pause : start}
                className={cn(
                  "px-8 transition-all duration-300",
                  isRunning && "animate-pulse"
                )}
              >
                {isRunning ? (
                  <Pause className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
                ) : (
                  <Play className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
                )}
                {isRunning ? 'Pause' : 'Start'}
              </TimerButton>
              
              <TimerButton
                variant="outline"
                size="icon"
                onClick={skipSession}
                className="hover:bg-accent group"
              >
                <SkipForward className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </TimerButton>
            </div>

            {/* Session Stats */}
            <div className="flex justify-center gap-6 text-sm text-muted-foreground animate-fade-in">
              <div className="text-center group cursor-default">
                <div className="font-semibold text-foreground text-lg transition-all duration-300 group-hover:scale-110 group-hover:text-primary">
                  {sessionCount}
                </div>
                <div className="transition-colors duration-300 group-hover:text-foreground">Sessions</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="font-semibold text-foreground text-lg transition-all duration-300 group-hover:scale-110 group-hover:text-primary">
                  {cycleCount}
                </div>
                <div className="transition-colors duration-300 group-hover:text-foreground">Cycles</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};