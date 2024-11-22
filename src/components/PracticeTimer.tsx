import React, { useState, useEffect } from 'react';
import { Timer, Check } from 'lucide-react';

export default function PracticeTimer() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionGoal] = useState(20 * 60); // 20 minutes in seconds

  useEffect(() => {
    let interval: number;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (time / sessionGoal) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Timer className="w-6 h-6" />
        Practice Timer
      </h2>
      <div className="relative h-4 bg-gray-200 rounded-full mb-4">
        <div
          className="absolute h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="text-4xl font-bold text-center mb-6 text-gray-800">
        {formatTime(time)}
        {time >= sessionGoal && (
          <span className="inline-flex items-center ml-2 text-green-500">
            <Check className="w-8 h-8" />
          </span>
        )}
      </div>
      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}