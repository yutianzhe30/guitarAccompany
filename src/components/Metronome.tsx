import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { Play, Pause, Plus, Minus } from 'lucide-react';

interface Props {
  initialBpm: number;
  onBpmChange: (bpm: number) => void;
}

export default function Metronome({ initialBpm, onBpmChange }: Props) {
  const [bpm, setBpm] = useState(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [synth] = useState(
    new Tone.MembraneSynth({
      pitchDecay: 0.02,
      octaves: 1,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.05,
        sustain: 0.0,
        release: 0.2
      }
    }).toDestination()
  );

  // Set volume for the metronome
  useEffect(() => {
    synth.volume.value = -5; // Increased volume
  }, [synth]);

  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
    return () => {
      Tone.getTransport().stop();
    };
  }, [bpm]);

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    onBpmChange(newBpm);
  };

  const increaseBpm = () => {
    const newBpm = Math.min(bpm + 5, 220);
    handleBpmChange(newBpm);
  };

  const decreaseBpm = () => {
    const newBpm = Math.max(bpm - 5, 40);
    handleBpmChange(newBpm);
  };

  const toggleMetronome = async () => {
    await Tone.start();
    if (!isPlaying) {
      const repeat = (time: number) => {
        synth.triggerAttackRelease('C4', '16n', time); // Higher note, shorter duration
      };
      Tone.getTransport().scheduleRepeat(repeat, '4n');
      Tone.getTransport().start();
    } else {
      Tone.getTransport().stop();
      Tone.getTransport().cancel();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Metronome</h2>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={decreaseBpm}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Minus className="w-6 h-6 text-gray-600" />
        </button>
        <span className="text-4xl font-bold text-gray-800">{bpm}</span>
        <button
          onClick={increaseBpm}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Plus className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <button
        onClick={toggleMetronome}
        className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        {isPlaying ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}