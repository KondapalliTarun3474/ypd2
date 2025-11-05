import { useEffect, useState } from 'react';
import { X, SwitchCamera, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useCamera } from '../hooks/useCamera';
import { useWebSocket } from '../hooks/useWebSocket';
import { DetectionStatus } from '../types';

interface CameraViewProps {
  onExit: () => void;
}

export function CameraView({ onExit }: CameraViewProps) {
  const { selectedRoutine, selectedAsana, isFullRoutine } = useApp();
  const { videoRef, isReady, error, toggleCamera, captureFrame } = useCamera();
  const { result, sendFrame } = useWebSocket('ws://localhost:8765');

  const [currentAsanaIndex, setCurrentAsanaIndex] = useState(0);
  const [completedAsanas, setCompletedAsanas] = useState<number[]>([]);
  const [correctPoseStartTime, setCorrectPoseStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isFullRoutine && result.status === DetectionStatus.CORRECT) {
      if (correctPoseStartTime === null) {
        setCorrectPoseStartTime(Date.now());
      } else {
        const elapsedTime = Date.now() - correctPoseStartTime;
        if (elapsedTime >= 3000) {
          handleNextAsana();
          setCorrectPoseStartTime(null);
        }
      }
    } else {
      setCorrectPoseStartTime(null);
    }
  }, [result.status, isFullRoutine, correctPoseStartTime, currentAsanaIndex]);

  const currentAsana = isFullRoutine
    ? selectedRoutine?.asanas[currentAsanaIndex]
    : selectedAsana;

  useEffect(() => {
    if (!isReady || !currentAsana) return;

    const interval = setInterval(() => {
      const frameData = captureFrame();
      if (frameData) {
        sendFrame(`data:image/jpeg;base64,${frameData}`, currentAsana.id);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isReady, currentAsana, sendFrame, captureFrame]);

  const handleNextAsana = () => {
    if (!selectedRoutine || !isFullRoutine) return;

    const newCompletedAsanas = [...completedAsanas, currentAsanaIndex];
    setCompletedAsanas(newCompletedAsanas);

    if (currentAsanaIndex < selectedRoutine.asanas.length - 1) {
      setCurrentAsanaIndex(currentAsanaIndex + 1);
      setCorrectPoseStartTime(null);
    } else {
      setTimeout(() => {
        alert('Congratulations! Routine completed!');
        onExit();
      }, 1000);
    }
  };

  const statusColors = {
    [DetectionStatus.INITIALIZING]: 'bg-slate-600',
    [DetectionStatus.NO_POSE]: 'bg-slate-600',
    [DetectionStatus.INCORRECT]: 'bg-rose-600',
    [DetectionStatus.CORRECT]: 'bg-emerald-600',
    [DetectionStatus.PARTIAL]: 'bg-amber-600'
  };

  const statusIcons = {
    [DetectionStatus.CORRECT]: <Check className="w-6 h-6" />,
    [DetectionStatus.PARTIAL]: <Check className="w-6 h-6 opacity-50" />
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onExit}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="flex-1 mx-4">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
              <h2 className="text-white font-bold text-center truncate">
                {currentAsana?.name}
              </h2>
              {currentAsana?.sanskritName && (
                <p className="text-white/80 text-xs text-center">
                  {currentAsana.sanskritName}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={toggleCamera}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
          >
            <SwitchCamera className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex-1" />

        {isFullRoutine && selectedRoutine && (
          <div className="px-4 pb-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm font-medium">Progress</span>
                <span className="text-white font-bold">
                  {completedAsanas.length} / {selectedRoutine.asanas.length}
                </span>
              </div>
              <div className="flex gap-1">
                {selectedRoutine.asanas.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      completedAsanas.includes(index)
                        ? 'bg-emerald-500'
                        : index === currentAsanaIndex
                        ? 'bg-white'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="p-4">
          <div
            className={`${statusColors[result.status]} backdrop-blur-md rounded-2xl p-6 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white text-lg font-bold mb-1">
                  {result.message}
                </p>
                {result.confidence !== undefined && result.confidence > 0 && (
                  <p className="text-white/80 text-sm">
                    Accuracy: {Math.round(result.confidence * 100)}%
                  </p>
                )}
              </div>

              {statusIcons[result.status] && (
                <div className="text-white ml-4">
                  {statusIcons[result.status]}
                </div>
              )}
            </div>

            {isFullRoutine &&
              result.status === DetectionStatus.CORRECT &&
              currentAsanaIndex < (selectedRoutine?.asanas.length || 0) - 1 && (
                <button
                  onClick={handleNextAsana}
                  className="mt-4 w-full py-3 bg-white text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
                >
                  Next Pose
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
          </div>
        </div>
      </div>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
          <div className="text-center px-6">
            <p className="text-white text-lg mb-4">{error}</p>
            <button
              onClick={onExit}
              className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-white/90 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
