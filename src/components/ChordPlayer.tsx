import React, { useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import * as Tone from 'tone';

const CHORDS = {
  major: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  types: ['major', 'minor', '7', 'm7', 'maj7', 'dim']
};

export default function ChordPlayer() {
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedType, setSelectedType] = useState('major');
  const [isMuted, setIsMuted] = useState(false);
  const [synth] = useState(
    new Tone.PolySynth().toDestination()
  );

  const getChordNotes = (root: string, type: string) => {
    const notes = {
      'major': [0, 4, 7],
      'minor': [0, 3, 7],
      '7': [0, 4, 7, 10],
      'm7': [0, 3, 7, 10],
      'maj7': [0, 4, 7, 11],
      'dim': [0, 3, 6]
    };

    const noteToMidi: { [key: string]: number } = {
      'C': 48, // Starting from C3 for lower register
      'D': 50,
      'E': 52,
      'F': 53,
      'G': 55,
      'A': 57,
      'B': 59
    };

    const baseNote = noteToMidi[root];
    return notes[type as keyof typeof notes].map(interval => {
      const midiNote = baseNote + interval;
      return Tone.Frequency(midiNote, "midi").toNote();
    });
  };

  const playChord = async () => {
    if (isMuted) return;
    await Tone.start();
    const notes = getChordNotes(selectedRoot, selectedType);
    synth.triggerAttackRelease(notes, "16n");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      synth.volume.value = -Infinity;
    } else {
      synth.volume.value = 0;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Music className="w-6 h-6" />
          Chord Player
        </h2>
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-7 gap-2">
          {CHORDS.major.map((note) => (
            <button
              key={note}
              onClick={() => setSelectedRoot(note)}
              className={`p-4 rounded-lg font-semibold text-lg transition-colors ${
                selectedRoot === note
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {note}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CHORDS.types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`p-3 rounded-lg font-medium transition-colors ${
                selectedType === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          onClick={playChord}
          className="w-full py-4 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold"
        >
          Play {selectedRoot}{selectedType === 'major' ? '' : selectedType}
        </button>
      </div>
    </div>
  );
}