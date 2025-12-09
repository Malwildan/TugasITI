import React, { useState } from 'react';
import { useBgm, DEFAULT_BGM_URL } from '@/lib/BgmContext';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadFile } from '@/lib/supabase-data';

export default function GlobalBgmWidget() {
  const { isPlaying, togglePlay, bgmUrl, setBgmUrl, volume, setVolume, showBgmModal, setShowBgmModal } = useBgm();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadFile('bgm', file);
      await setBgmUrl(url);
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`Failed to upload BGM: ${error.message || 'Unknown error'}\n\nMake sure you have created the 'bgm' storage bucket in Supabase!`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset to default background music?')) {
        await setBgmUrl(DEFAULT_BGM_URL);
    }
  };

  return (
    <>
      {/* Floating Widget */}
      <motion.div 
        className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 bg-black/90 px-4 py-2 rounded-full border-2 border-[#4ecdc4] shadow-[0_0_15px_rgba(78,205,196,0.3)] backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Visualizer / Status */}
        <div className="flex items-center gap-1 h-5">
          <motion.div
            animate={isPlaying ? { height: [5, 15, 5] } : { height: 5 }}
            transition={isPlaying ? { repeat: Infinity, duration: 0.5 } : { duration: 0.2 }}
            className="w-1 bg-[#4ecdc4] rounded-full"
          />
          <motion.div
            animate={isPlaying ? { height: [8, 20, 8] } : { height: 8 }}
            transition={isPlaying ? { repeat: Infinity, duration: 0.6, delay: 0.1 } : { duration: 0.2 }}
            className="w-1 bg-[#ff6b9d] rounded-full"
          />
          <motion.div
            animate={isPlaying ? { height: [5, 15, 5] } : { height: 5 }}
            transition={isPlaying ? { repeat: Infinity, duration: 0.5, delay: 0.2 } : { duration: 0.2 }}
            className="w-1 bg-[#ffe66d] rounded-full"
          />
        </div>

        {/* Controls */}
        <button 
          onClick={togglePlay}
          disabled={!bgmUrl}
          className="text-white hover:text-[#4ecdc4] transition-colors disabled:opacity-50 text-lg"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button 
          onClick={() => setShowBgmModal(true)}
          className="text-white hover:text-[#4ecdc4] transition-colors text-lg"
          title="BGM Settings"
        >
          🎵
        </button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showBgmModal && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBgmModal(false)}
          >
            <motion.div
              className="w-[90%] max-w-md bg-[#2a2a2a] p-6 rounded-2xl border-2 border-[#4ecdc4] shadow-[0_0_30px_rgba(78,205,196,0.2)]"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#4ecdc4] flex items-center gap-2">
                    <span>🎵</span> Audio Settings
                </h2>
                <button 
                  onClick={() => setShowBgmModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Upload Section */}
                <div className="bg-[#333] p-4 rounded-xl border border-gray-700">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Change Track</label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="block w-full text-sm text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#4ecdc4] file:text-[#1a1a1a]
                                hover:file:bg-[#3dbdb4]
                                cursor-pointer"
                        />
                    </div>
                    {isUploading && (
                        <div className="mt-2 text-[#ffe66d] text-sm flex items-center gap-2">
                            <span className="animate-spin">⏳</span> Uploading...
                        </div>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                        Supported formats: MP3, WAV, OGG
                    </p>
                </div>

                {/* Volume Section */}
                <div className="bg-[#333] p-4 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-300">Volume</label>
                        <span className="text-xs font-mono text-[#4ecdc4]">{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4ecdc4]"
                    />
                </div>

                {/* Current Track Info */}
                <div className="flex items-center justify-between text-xs text-gray-400 bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
                    <div className="truncate max-w-[200px]">
                        <span className="text-[#4ecdc4] mr-2">Playing:</span>
                        {bgmUrl.split('/').pop()}
                    </div>
                    {bgmUrl !== DEFAULT_BGM_URL && (
                        <button 
                            onClick={handleReset}
                            className="text-[#ff6b9d] hover:text-[#ff4785] underline ml-2 whitespace-nowrap"
                        >
                            Reset to Default
                        </button>
                    )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
