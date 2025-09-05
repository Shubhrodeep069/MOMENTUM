import { useState, useEffect, useCallback, useRef } from 'react';

export type SessionType = 'focus' | 'short-break' | 'long-break';

interface PomodoroSettings {
  focusTime: number; // in minutes
  shortBreakTime: number; // in minutes
  longBreakTime: number; // in minutes
  longBreakInterval: number; // after how many focus sessions
}

interface PomodoroState {
  timeLeft: number; // in seconds
  isRunning: boolean;
  currentSession: SessionType;
  sessionCount: number;
  cycleCount: number;
  totalSessions: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
};

export const usePomodoro = (settings: PomodoroSettings = DEFAULT_SETTINGS) => {
  const [state, setState] = useState<PomodoroState>({
    timeLeft: settings.focusTime * 60,
    isRunning: false,
    currentSession: 'focus',
    sessionCount: 0,
    cycleCount: 0,
    totalSessions: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onSessionCompleteRef = useRef<((session: SessionType) => void) | null>(null);

  const getSessionDuration = useCallback((sessionType: SessionType) => {
    switch (sessionType) {
      case 'focus':
        return settings.focusTime * 60;
      case 'short-break':
        return settings.shortBreakTime * 60;
      case 'long-break':
        return settings.longBreakTime * 60;
      default:
        return settings.focusTime * 60;
    }
  }, [settings]);

  const getNextSession = useCallback((currentSession: SessionType, sessionCount: number): SessionType => {
    if (currentSession === 'focus') {
      // After a focus session, determine break type
      return (sessionCount % settings.longBreakInterval === 0) ? 'long-break' : 'short-break';
    } else {
      // After any break, return to focus
      return 'focus';
    }
  }, [settings.longBreakInterval]);

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      timeLeft: getSessionDuration(prev.currentSession),
      isRunning: false,
    }));
  }, [getSessionDuration]);

  const skipSession = useCallback(() => {
    setState(prev => {
      const newSessionCount = prev.currentSession === 'focus' ? prev.sessionCount + 1 : prev.sessionCount;
      const nextSession = getNextSession(prev.currentSession, newSessionCount);
      const newCycleCount = prev.currentSession === 'long-break' ? prev.cycleCount + 1 : prev.cycleCount;
      
      return {
        ...prev,
        currentSession: nextSession,
        sessionCount: newSessionCount,
        cycleCount: newCycleCount,
        timeLeft: getSessionDuration(nextSession),
        isRunning: false,
      };
    });
  }, [getNextSession, getSessionDuration]);

  const switchToSession = useCallback((sessionType: SessionType) => {
    setState(prev => ({
      ...prev,
      currentSession: sessionType,
      timeLeft: getSessionDuration(sessionType),
      isRunning: false,
    }));
  }, [getSessionDuration]);

  // Set session complete callback
  const onSessionComplete = useCallback((callback: (session: SessionType) => void) => {
    onSessionCompleteRef.current = callback;
  }, []);

  // Timer effect
  useEffect(() => {
    if (state.isRunning && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.timeLeft]);

  // Session completion effect
  useEffect(() => {
    if (state.timeLeft === 0 && !state.isRunning) {
      const currentSessionType = state.currentSession;
      
      // Call completion callback
      if (onSessionCompleteRef.current) {
        onSessionCompleteRef.current(currentSessionType);
      }

      // Auto-switch to next session
      setState(prev => {
        const newSessionCount = prev.currentSession === 'focus' ? prev.sessionCount + 1 : prev.sessionCount;
        const nextSession = getNextSession(prev.currentSession, newSessionCount);
        const newCycleCount = prev.currentSession === 'long-break' ? prev.cycleCount + 1 : prev.cycleCount;
        const newTotalSessions = prev.totalSessions + 1;
        
        return {
          ...prev,
          currentSession: nextSession,
          sessionCount: newSessionCount,
          cycleCount: newCycleCount,
          totalSessions: newTotalSessions,
          timeLeft: getSessionDuration(nextSession),
          isRunning: false,
        };
      });
    }
  }, [state.timeLeft, state.isRunning, state.currentSession, getNextSession, getSessionDuration]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getProgress = useCallback(() => {
    const totalTime = getSessionDuration(state.currentSession);
    return ((totalTime - state.timeLeft) / totalTime) * 100;
  }, [state.currentSession, state.timeLeft, getSessionDuration]);

  return {
    ...state,
    start,
    pause,
    reset,
    skipSession,
    switchToSession,
    onSessionComplete,
    formatTime,
    getProgress,
    settings,
  };
};