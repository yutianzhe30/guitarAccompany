import React from 'react';
import { Music } from 'lucide-react';

const chords = [
  { name: 'A Major', positions: 'x02220', difficulty: 'Beginner' },
  { name: 'D Major', positions: 'xx0232', difficulty: 'Beginner' },
  { name: 'G Major', positions: '320003', difficulty: 'Beginner' },
  { name: 'E Major', positions: '022100', difficulty: 'Beginner' },
  { name: 'C Major', positions: 'x32010', difficulty: 'Beginner' },
  { name: 'F Major', positions: '133211', difficulty: 'Intermediate' },
];

export default function ChordLibrary() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Music className="w-6 h-6" />
        Chord Library
      </h2>
      <div className="grid gap-4">
        {chords.map((chord) => (
          <div
            key={chord.name}
            className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{chord.name}</h3>
              <span className="text-sm px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                {chord.difficulty}
              </span>
            </div>
            <div className="font-mono text-sm text-gray-600">
              Positions: {chord.positions}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}