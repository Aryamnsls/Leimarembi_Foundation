"use client";

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ImageIcon, Play, X, ZoomIn, Upload, Loader2, ImagePlus, CheckCircle2, MapPin, Calendar, Type, FileText } from 'lucide-react';
import { isExecutiveOfficer } from '@/lib/executiveOfficers';

interface MediaItem {
  id: string;
  title: string;
  category: 'Photos' | 'Videos' | 'Events';
  date: string;
  description: string;
  type: 'image' | 'video';
  previewUrl?: string; // Optional for newly uploaded ones
}

export default function GalleryPage() {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Photos' | 'Videos' | 'Events'>('All');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  
  // Auth state
  const [userRole, setUserRole] = useState<string | null>(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [isRefining, setIsRefining] = useState(false);
  const [isRefined, setIsRefined] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadCategory, setUploadCategory] = useState<'Photos' | 'Videos' | 'Events'>('Photos');
  const [uploadMediaType, setUploadMediaType] = useState<'image' | 'video'>('image');

  const [uploadData, setUploadData] = useState({
    title: '',
    location: '',
    time: '',
    description: '',
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '7',
      title: '13th Leimarembi Foundation Presentation Inauguration',
      category: 'Events',
      date: 'September 13 2026',
      description: 'Inauguration and presentation of the 13th Leimarembi Foundation.',
      type: 'image',
      previewUrl: '/bg1.jpg'
    },
    {
      id: '1',
      title: 'Free Rural Health Camp 2026',
      category: 'Events',
      date: 'February 2026',
      description: 'Free medical check-ups, geriatric care, and essential medicines distribution for senior citizens and low-income families.',
      type: 'image'
    },
    {
      id: '2',
      title: 'Traditional Manipuri Cultural Performance',
      category: 'Videos',
      date: 'January 2026',
      description: 'Documentary performance highlighting classical Ras Lila and traditional Meitei folk songs.',
      type: 'video'
    },
    {
      id: '3',
      title: 'Meetei Mayek Script Literacy Workshop',
      category: 'Photos',
      date: 'December 2025',
      description: 'Educational session teaching the traditional Meetei Mayek script to local youth and community members.',
      type: 'image'
    },
    {
      id: '4',
      title: 'Executive Body Annual General Assembly',
      category: 'Events',
      date: 'November 2025',
      description: 'Annual gathering of office bearers, executive officers, and members discussing transparent digital governance.',
      type: 'image'
    },
    {
      id: '5',
      title: 'Clean Environment & Plantation Drive',
      category: 'Photos',
      date: 'October 2025',
      description: 'Community-led tree plantation and ecological conservation movement in local villages.',
      type: 'image'
    },
    {
      id: '6',
      title: 'Youth Sports & Kabaddi Championship',
      category: 'Videos',
      date: 'September 2025',
      description: 'Highlights from the regional Kabaddi tournament organised under the guidance of K. Ajit Singh.',
      type: 'video'
    }
  ]);

  // Auth check for Executive Officers & Members
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('lf_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (isExecutiveOfficer(user) || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
          setUserRole('ADMIN');
        } else {
          setUserRole(user.role);
        }
      }
    } catch (e) {}
  }, []);

  // Strict Body scroll locking when lightbox or upload modal is active
  useEffect(() => {
    if (selectedMedia || isUploadModalOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (selectedMedia) setSelectedMedia(null);
          if (isUploadModalOpen) closeUploadModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }, [selectedMedia, isUploadModalOpen]);

  const filteredItems = mediaItems.filter((item) =>
    selectedFilter === 'All' ? true : item.category === selectedFilter
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      setPreviewUrl(url);
      setUploadMediaType(isVideo ? 'video' : 'image');
      setUploadCategory(isVideo ? 'Videos' : 'Photos');
      
      setIsRefining(true);
      setTimeout(() => {
        setIsRefining(false);
        setIsRefined(true);
      }, 2500); // simulate auto refinement 2.5s
    }
  };

  const isFormComplete = uploadData.title.trim() !== '' && 
                         uploadData.location.trim() !== '' && 
                         uploadData.time.trim() !== '' && 
                         uploadData.description.trim() !== '';

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;

    // Format date roughly as Month Year
    const dateObj = new Date(uploadData.time);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) || 'Recent';

    const newItem: MediaItem = {
      id: Date.now().toString(),
      title: uploadData.title,
      category: uploadCategory,
      date: formattedDate,
      description: uploadData.description,
      type: uploadMediaType,
      previewUrl: previewUrl || undefined
    };

    setMediaItems(prev => [newItem, ...prev]);
    closeUploadModal();
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setTimeout(() => {
      setUploadStep(1);
      setIsRefining(false);
      setIsRefined(false);
      setPreviewUrl(null);
      setUploadCategory('Photos');
      setUploadMediaType('image');
      setUploadData({ title: '', location: '', time: '', description: '' });
    }, 300); // Reset after animation
  };

  const handleRemoveItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 4rem 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div 
          className="glass-panel" 
          style={{ 
            display: 'inline-block', 
            padding: '0.4rem 1.25rem', 
            borderRadius: '30px', 
            marginBottom: '1rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Media & Event Archives
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, margin: '0 0 1rem 0', color: 'var(--primary-color)' }}>
          Foundation Photo & Video Gallery
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
          Explore visual documentations of our community development initiatives, health camps, cultural preservation events, and executive governance meetings.
        </p>
      </div>

      {/* Filter Tabs & Upload Button */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {(['All', 'Photos', 'Videos', 'Events'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={selectedFilter === filter ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Members & Executive Officers Upload Access */}
        {userRole && ['MEMBER', 'ADMIN', 'TRUSTEE', 'STAFF', 'SUPER_ADMIN'].includes(userRole) && (
          <>
            <div style={{ width: '1px', height: '28px', background: 'var(--border-color)', margin: '0 0.5rem', display: 'block' }} className="hidden sm:block"></div>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="btn btn-primary"
              style={{ 
                padding: '0.5rem 1.25rem', 
                fontSize: '0.875rem', 
                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Upload size={16} /> Upload Now
            </button>
          </>
        )}
      </div>

      {/* Gallery Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onClick={() => setSelectedMedia(item)}
          >
            <div>
              {/* Media Thumbnail Container */}
              <div 
                style={{
                  width: '100%',
                  height: item.category === 'Events' ? '200px' : '180px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(27, 42, 87, 0.08), rgba(2, 132, 199, 0.12))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: 'var(--info-color)',
                  position: 'relative',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden'
                }}
              >
                {item.category === 'Events' && item.id === '7' && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'var(--surface-color)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '1px solid var(--border-color)',
                    zIndex: 2
                  }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--error-color, #e11d48)', textTransform: 'uppercase' }}>
                      {item.date.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                      {item.date.match(/\d+/) ? item.date.match(/\d+/)?.[0] : ''}
                    </span>
                  </div>
                )}
                {item.previewUrl ? (
                  <img src={item.previewUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  item.type === 'video' ? <Play size={44} /> : <ImageIcon size={44} />
                )}
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'var(--surface-color)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-color)' }}>
                  <ZoomIn size={12} /> Inspect
                </div>
              </div>

              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--info-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {item.category} • {item.date}
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '4px', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {item.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', ...(item.category === 'Events' ? { background: 'var(--primary-color)', color: '#fff', border: 'none' } : {}) }}>
                {item.category === 'Events' ? 'View Event Details' : 'View Archive Detail'}
              </button>
              {userRole && ['MEMBER', 'ADMIN', 'TRUSTEE', 'STAFF'].includes(userRole) && (
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', color: 'var(--error-color, #e11d48)', borderColor: 'var(--error-color, #e11d48)' }}
                  onClick={(e) => handleRemoveItem(e, item.id)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Media Detail Modal Dialog using React Portal */}
      {selectedMedia && typeof document !== 'undefined' && createPortal(
        <div 
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100dvh',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setSelectedMedia(null)}
          onTouchMove={(e) => e.preventDefault()}
          onWheel={(e) => e.preventDefault()}
        >
          <div 
            className="card animate-fade-in"
            style={{
              width: 'min(560px, 94vw)',
              maxHeight: '88dvh',
              overflowY: 'auto',
              borderRadius: '24px',
              padding: '2rem',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
              background: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              margin: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            <div style={{ width: '100%', height: '300px', background: 'linear-gradient(135deg, rgba(27, 42, 87, 0.08), rgba(2, 132, 199, 0.12))', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info-color)', marginBottom: '1.5rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              {selectedMedia.previewUrl ? (
                <img src={selectedMedia.previewUrl} alt={selectedMedia.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                selectedMedia.type === 'video' ? <Play size={56} /> : <ImageIcon size={56} />
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--info-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {selectedMedia.category} • {selectedMedia.date}
              </span>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 900, marginTop: '4px', color: 'var(--primary-color)' }}>
                {selectedMedia.title}
              </h2>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {selectedMedia.description}
            </p>

            <button onClick={() => setSelectedMedia(null)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Close Media Viewer
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Upload Media Modal Dialog using React Portal */}
      {isUploadModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100dvh',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={closeUploadModal}
        >
          <div 
            className="card animate-fade-in"
            style={{
              width: 'min(600px, 94vw)',
              maxHeight: '92dvh',
              overflowY: 'auto',
              borderRadius: '24px',
              padding: '2.5rem',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
              background: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              margin: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeUploadModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
              {uploadStep === 1 ? 'Upload Foundation Media' : 'Media Details'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              {uploadStep === 1 
                ? 'Select a photo. Our system will automatically apply visual refinements.' 
                : 'Please complete all fields to officially log this media into the foundation archive.'}
            </p>

            {/* Step 1: Upload and Refine */}
            {uploadStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                {!previewUrl ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%',
                      height: '240px',
                      border: '2px dashed var(--primary-color)',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      background: 'rgba(2, 132, 199, 0.05)',
                      color: 'var(--primary-color)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ImagePlus size={48} style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Click to Browse Media</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Images & Videos up to 50MB</p>
                    <input 
                      type="file" 
                      accept="image/*, video/*" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                ) : (
                  <div style={{ width: '100%' }}>
                    <div style={{ 
                      width: '100%', 
                      height: '240px', 
                      borderRadius: '16px', 
                      overflow: 'hidden',
                      position: 'relative',
                      border: '1px solid var(--border-color)',
                      background: '#000'
                    }}>
                      {uploadMediaType === 'video' ? (
                        <video 
                          src={previewUrl} 
                          controls
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            opacity: isRefining ? 0.4 : 1,
                            filter: isRefining ? 'blur(4px) grayscale(50%)' : 'contrast(1.05) saturate(1.1)',
                            transition: 'all 0.5s ease'
                          }} 
                        />
                      ) : (
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            opacity: isRefining ? 0.4 : 1,
                            filter: isRefining ? 'blur(4px) grayscale(50%)' : 'contrast(1.05) saturate(1.1)',
                            transition: 'all 0.5s ease'
                          }} 
                        />
                      )}
                      
                      {isRefining && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                          <Loader2 size={40} className="animate-spin" style={{ marginBottom: '1rem' }} />
                          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Applying Auto-Refinement...</h3>
                        </div>
                      )}
                      
                      {isRefined && (
                        <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(16, 185, 129, 0.9)', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' }}>
                          <CheckCircle2 size={14} /> Refinement Complete
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className="btn btn-primary"
                      disabled={isRefining}
                      onClick={() => setUploadStep(2)}
                      style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', opacity: isRefining ? 0.7 : 1 }}
                    >
                      {isRefining ? 'Processing...' : 'Proceed to Details'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Form Details */}
            {uploadStep === 2 && (
              <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Category</label>
                  <select 
                    className="input-field" 
                    value={uploadCategory} 
                    onChange={e => setUploadCategory(e.target.value as any)}
                  >
                    <option value="Photos">Photos</option>
                    <option value="Videos">Videos</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Title</label>
                  <div style={{ position: 'relative' }}>
                    <Type size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="text" 
                      placeholder="e.g. Annual Meeting 2026"
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      value={uploadData.title}
                      onChange={e => setUploadData({...uploadData, title: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Location</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="text" 
                      placeholder="Where was this taken?"
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      value={uploadData.location}
                      onChange={e => setUploadData({...uploadData, location: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Time & Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="datetime-local" 
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      value={uploadData.time}
                      onChange={e => setUploadData({...uploadData, time: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Description</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={18} style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--text-secondary)' }} />
                    <textarea 
                      placeholder="Provide detailed context..."
                      className="input-field"
                      rows={4}
                      style={{ paddingLeft: '2.5rem', resize: 'none' }}
                      value={uploadData.description}
                      onChange={e => setUploadData({...uploadData, description: e.target.value})}
                    />
                  </div>
                </div>

                {!isFormComplete && (
                  <p style={{ color: 'var(--error-color, #e11d48)', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600, marginTop: '0.5rem' }}>
                    Please complete all values before submitting.
                  </p>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setUploadStep(1)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={!isFormComplete}
                    style={{ flex: 2, justifyContent: 'center', opacity: isFormComplete ? 1 : 0.5, cursor: isFormComplete ? 'pointer' : 'not-allowed' }}
                  >
                    Submit Media
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
