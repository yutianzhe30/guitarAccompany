import React, { useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import * as Tone from 'tone';

const CHORDS = {
  major: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  types: ['major', 'minor', '7', 'm7', 'maj7', 'dim']
};

interface ChordItem {
  root: string;
  type: string;
}

interface Props {
  bpm: number;
}

export default function ChordPlayer({ bpm }: Props) {
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedType, setSelectedType] = useState('major');
  const [isMuted, setIsMuted] = useState(false);
  const [chordList, setChordList] = useState<ChordItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
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

  const addChordToList = () => {
    setChordList([...chordList, { root: selectedRoot, type: selectedType }]);
  };

  const removeChord = (index: number) => {
    const newList = chordList.filter((_, i) => i !== index);
    setChordList(newList);
  };

  const playChordSequence = async () => {
    if (isMuted || isPlaying || chordList.length === 0) return;
    
    setIsPlaying(true);
    await Tone.start();

    let currentChordIndex = 0;
    
    // Schedule the chord sequence
    const loop = new Tone.Loop((time) => {
      const chord = chordList[currentChordIndex];
      const notes = getChordNotes(chord.root, chord.type);
      synth.triggerAttackRelease(notes, "4n", time);
      
      // Move to next chord
      currentChordIndex = (currentChordIndex + 1) % chordList.length;
      
      // If not looping and we've played all chords, stop
      if (!isLooping && currentChordIndex === 0) {
        setTimeout(() => {
          stopChordSequence();
        }, 0);
      }
    }, "1n").start(0);

    // Start the transport if it's not already running
    if (Tone.getTransport().state !== "started") {
      Tone.getTransport().start();
    }
  };

  const stopChordSequence = () => {
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    setIsPlaying(false);
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

        <div className="flex gap-2">
          <button
            onClick={playChord}
            className="flex-1 py-4 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold"
          >
            Play {selectedRoot}{selectedType === 'major' ? '' : selectedType}
          </button>
          <button
            onClick={addChordToList}
            className="py-4 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
          >
            Add to List
          </button>
        </div>

        {chordList.length > 0 && (
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chord Sequence</h3>
              <div className="flex gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isLooping}
                    onChange={(e) => setIsLooping(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-indigo-600"
                  />
                  <span className="text-sm">Loop</span>
                </label>
                <button
                  onClick={isPlaying ? stopChordSequence : playChordSequence}
                  disabled={chordList.length === 0}
                  className={`py-2 px-4 rounded-lg text-white transition-colors ${
                    chordList.length === 0 ? 'bg-gray-400' :
                    isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isPlaying ? 'Stop' : 'Play Sequence'}
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {chordList.map((chord, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 rounded-lg p-2"
                >
                  <span className="font-medium">
                    {chord.root}{chord.type === 'major' ? '' : chord.type}
                  </span>
                  <button
                    onClick={() => removeChord(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}