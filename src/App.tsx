import React from 'react';
import { Guitar } from 'lucide-react';
import Metronome from './components/Metronome';
import ChordPlayer from './components/ChordPlayer';
import PracticeTimer from './components/PracticeTimer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <Guitar className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Guitar Practice Partner</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ChordPlayer />
          <Metronome />
          <PracticeTimer />
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Practice Tips</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="font-semibold">1.</span>
              Start with a warm-up routine to prevent injury and improve flexibility.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">2.</span>
              Practice with a metronome to improve your timing and rhythm.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">3.</span>
              Focus on one technique or concept at a time for better progress.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">4.</span>
              Record yourself playing to identify areas that need improvement.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">5.</span>
              Take regular breaks to prevent fatigue and maintain focus.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;