import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMemories, addMemory, updateMemory, deleteMemory, fetchUserSettings, updateUserSettings, uploadFile } from '@/lib/supabase-data';

interface Memory {
  id: string;
  type: 'image' | 'video';
  src: string;
  caption: string;
  date: string;
  isNew?: boolean;
  rotation?: number;
}

const TAPE_COLORS = ['#ff6b9d', '#4ecdc4', '#ffaa44', '#88ff88', '#4a7aff'];

export default function MemoryReel() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Management
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemory, setNewMemory] = useState({ caption: '', date: new Date().toISOString().split('T')[0], file: null as File | null });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Lightbox State
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);
  
  // Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMemory, setEditMemory] = useState<Memory | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editDate, setEditDate] = useState('');
  


  // Get random tape color
  const getRandomTapeColor = () => TAPE_COLORS[Math.floor(Math.random() * TAPE_COLORS.length)];

  // Get random tilt
  const getRandomTilt = () => Math.random() * 6 - 3;



  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store file for later processing
      setNewMemory(prev => ({ ...prev, file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle add memory with real file data
  const handleAddMemory = async () => {
    if (previewImage && newMemory.caption.trim() && newMemory.file) {
      try {
        setIsLoading(true);
        
        // Upload file to Supabase storage
        const mediaUrl = await uploadFile('memories', newMemory.file);
        
        // Add memory to database
        const dbMemory = await addMemory({
          type: newMemory.file.type.startsWith('video') ? 'video' : 'image',
          mediaUrl,
          caption: newMemory.caption,
          date: newMemory.date,
          rotation: getRandomTilt(),
        });
        
        // Add to local state
        const memory: Memory = {
          id: dbMemory.id,
          type: dbMemory.type,
          src: dbMemory.media_url,
          caption: dbMemory.caption || '',
          date: dbMemory.memory_date,
          isNew: dbMemory.is_new,
          rotation: dbMemory.rotation,
        };
        
        setMemories(prev => [memory, ...prev]);
        
        // Reset form
        setShowAddModal(false);
        setNewMemory({ caption: '', date: new Date().toISOString().split('T')[0], file: null });
        setPreviewImage(null);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error: any) {
        console.error('Error adding memory:', error);
        alert(`Failed to add memory: ${error.message || 'Unknown error'}\n\nMake sure you have created the 'memories' storage bucket in Supabase!`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle scroll progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const progress = (element.scrollLeft / (element.scrollWidth - element.clientWidth)) * 100;
    setScrollProgress(progress);
  };

  // Open lightbox
  const openLightbox = (memory: Memory) => {
    setSelectedMemory(memory);
    setShowLightbox(true);
  };

  // Close lightbox
  const closeLightbox = () => {
    setShowLightbox(false);
    // Clear selected memory after animation
    setTimeout(() => setSelectedMemory(null), 300);
  };

  // Open edit modal
  const openEditModal = (memory: Memory) => {
    setEditMemory(memory);
    setEditCaption(memory.caption);
    setEditDate(memory.date);
    setShowEditModal(true);
    closeLightbox();
  };

  // Handle edit memory
  const handleEditMemory = async () => {
    if (editMemory && editCaption.trim()) {
      try {
        await updateMemory(editMemory.id, {
          caption: editCaption,
          memory_date: editDate,
        });
        
        setMemories(prev =>
          prev.map(mem =>
            mem.id === editMemory.id
              ? { ...mem, caption: editCaption, date: editDate }
              : mem
          )
        );
        
        setShowEditModal(false);
        setEditMemory(null);
        setEditCaption('');
        setEditDate('');
      } catch (error: any) {
        console.error('Error editing memory:', error);
        alert(`Failed to edit memory: ${error.message || 'Unknown error'}`);
      }
    }
  };

  // Handle delete memory
  const handleDeleteMemory = async (memoryId: string) => {
    if (confirm('Apakah kamu yakin ingin menghapus memory ini?')) {
      try {
        await deleteMemory(memoryId);
        setMemories(prev => prev.filter(mem => mem.id !== memoryId));
        closeLightbox();
      } catch (error: any) {
        console.error('Error deleting memory:', error);
        alert(`Failed to delete memory: ${error.message || 'Unknown error'}`);
      }
    }
  };





  // Load memories and settings from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch memories
        const dbMemories = await fetchMemories();
        setMemories(dbMemories.map(m => ({
          id: m.id,
          type: m.type,
          src: m.media_url,
          caption: m.caption || '',
          date: m.memory_date,
          isNew: m.is_new,
          rotation: m.rotation,
        })));
        

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <div className="memory-reel-page">
      {/* Scanlines Effect */}
      <div className="memory-scanlines" />

      {/* Header - Consistent with Stat Lab */}
      <motion.header
        className="memory-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <button className="back-arcade-btn" onClick={() => navigate('/dashboard')}>
            ← BACK
          </button>
          <div className="header-text">
            <h1 className="memory-title">LEVEL 03: MEMORY REEL</h1>
            <p className="memory-subtitle">Scroll through the film...</p>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="memory-loading-bar-container">
          <div className="memory-loading-bar">
            <div 
              className="memory-loading-fill" 
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </motion.header>

      {/* Film Strip Container */}
      <div className="film-strip-container">
        {/* Top Sprocket Holes */}
        <div className="sprocket-holes top" />

        {/* Horizontal Scroll Area */}
        <div 
          className="film-scroll-wrapper" 
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <div className="film-scroll-content">
            {/* Add Memory Slot */}
            <motion.button
              className="add-memory-slot"
              onClick={() => setShowAddModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="slot-text">
                <span className="slot-icon">📸</span>
                <span>Insert</span>
                <span>New</span>
                <span>Memory</span>
              </div>
              <motion.span
                className="slot-cursor"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                _
              </motion.span>
            </motion.button>

            {/* Memory Cards */}
            {memories.map((memory, index) => {
              const tapeColor = getRandomTapeColor();
              const tilt = memory.rotation || getRandomTilt();

              return (
                <motion.div
                  key={memory.id}
                  className="scrapbook-entry"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                  style={{ rotate: tilt }}
                  onClick={() => openLightbox(memory)}
                >
                  {/* Washi Tape Top */}
                  <div className="washi-tape" style={{ backgroundColor: tapeColor }} />

                  {/* Image Container - Clickable */}
                  <div className="entry-media">
                    {memory.type === 'image' && (
                      <img src={memory.src} alt={memory.caption} />
                    )}
                    {memory.type === 'video' && (
                      <video>
                        <source src={memory.src} type="video/mp4" />
                      </video>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="entry-caption">
                    <p className="caption-text">{memory.caption}</p>
                    <p className="caption-date">{memory.date}</p>
                  </div>

                  {/* NEW Badge */}
                  {memory.isNew && (
                    <motion.div
                      className="new-badge"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      NEW!
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

            {/* End Marker */}
            <div className="film-end-marker">
              <div className="end-emoji">🎬</div>
              <p>THE END</p>
            </div>
          </div>
        </div>

        {/* Bottom Sprocket Holes */}
        <div className="sprocket-holes bottom" />
      </div>



      {/* Add Memory Modal */}
      {showAddModal && (
        <motion.div
          className="memory-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            className="memory-modal-box"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setShowAddModal(false)}
            >
              ✕
            </button>

            <h2 className="modal-title">📸 ADD MEMORY</h2>

            {/* Image Upload */}
            <label className="upload-area">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="upload-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <span>Click to upload</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>

            {/* Form Fields */}
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Caption</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="What's the story?"
                  value={newMemory.caption}
                  onChange={(e) =>
                    setNewMemory({ ...newMemory, caption: e.target.value })
                  }
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={newMemory.date}
                  onChange={(e) =>
                    setNewMemory({ ...newMemory, date: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              className="modal-submit-btn"
              onClick={handleAddMemory}
              disabled={!previewImage || !newMemory.caption.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💾 SAVE MEMORY
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* LIGHTBOX - Full Screen Memory View */}
      <AnimatePresence>
        {showLightbox && selectedMemory && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="lightbox-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                className="lightbox-close"
                onClick={closeLightbox}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              {/* Media Container */}
              <div className="lightbox-media-frame">
                {selectedMemory.type === 'image' && (
                  <motion.img
                    src={selectedMemory.src}
                    alt={selectedMemory.caption}
                    className="lightbox-image"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  />
                )}
                {selectedMemory.type === 'video' && (
                  <motion.video
                    src={selectedMemory.src}
                    className="lightbox-video"
                    controls
                    autoPlay
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  />
                )}
              </div>

              {/* Caption Section */}
              <motion.div
                className="lightbox-caption"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="lightbox-caption-text">{selectedMemory.caption}</h3>
                <p className="lightbox-caption-date">{selectedMemory.date}</p>
              </motion.div>

              {/* Action Buttons - Edit & Delete */}
              <motion.div
                className="lightbox-actions"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  className="lightbox-action-btn edit-btn"
                  onClick={() => openEditModal(selectedMemory)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✏️ EDIT
                </motion.button>
                <motion.button
                  className="lightbox-action-btn delete-btn"
                  onClick={() => handleDeleteMemory(selectedMemory.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🗑️ DELETE
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {showEditModal && editMemory && (
          <motion.div
            className="memory-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              className="memory-modal-box"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>

              <h2 className="modal-title">✏️ EDIT MEMORY</h2>

              {/* Preview Image */}
              <div className="edit-preview">
                {editMemory.type === 'image' && (
                  <img src={editMemory.src} alt={editCaption} />
                )}
                {editMemory.type === 'video' && (
                  <video>
                    <source src={editMemory.src} type="video/mp4" />
                  </video>
                )}
              </div>

              {/* Form Fields */}
              <div className="modal-form">
                <div className="form-group">
                  <label className="form-label">Caption</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="What's the story?"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="modal-actions">
                <motion.button
                  className="modal-submit-btn"
                  onClick={handleEditMemory}
                  disabled={!editCaption.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  💾 SAVE CHANGES
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>




    </div>
  );
}
