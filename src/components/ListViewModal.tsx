import React, { useEffect, useState } from 'react';
import { getListDetails, removeVideoFromList, updateList, deleteList } from '../services/listService';
import { getVideoById } from '../services/videoService';
import type { List } from '../types';
import { getYouTubeThumbnail } from '../utils/youtube';

interface ListViewModalProps {
  listId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onListDeleted?: () => void;
}

const ListViewModal = ({ listId, isOpen, onClose, onListDeleted }: ListViewModalProps) => {
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [renamingError, setRenamingError] = useState('');
  const [videoCache, setVideoCache] = useState<Record<string, any>>({});
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen && listId) fetchList();
    // eslint-disable-next-line
  }, [isOpen, listId]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const data = await getListDetails(listId!);
      setList(data);
      setNewName(data.name);
    } catch (err) {
      setError('Failed to load list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!list) return;
    const missingIds = list.videoItems
      .filter(item => typeof item.videoId === 'string' && !videoCache[item.videoId])
      .map(item => item.videoId as string);

    if (missingIds.length === 0) return;

    missingIds.forEach(async (id) => {
      try {
        const video = await getVideoById(id);
        setVideoCache(prev => ({ ...prev, [id]: video }));
      } catch {}
    });
  }, [list, videoCache]);

  useEffect(() => {
    const loadThumbnails = async () => {
      if (list && list.videoItems) {
        const urls: { [key: string]: string } = {};
        await Promise.all(
          list.videoItems.map(async (item: any) => {
            if (item.videoId && item.videoId.youtube_id) {
              const url = await getYouTubeThumbnail(item.videoId.youtube_id);
              urls[item.videoId._id] = url;
            }
          })
        );
        setThumbnailUrls(urls);
      }
    };
    loadThumbnails();
  }, [list]);

  const handleRemoveVideo = async (videoId: string) => {
    if (!listId) return;
    try {
      await removeVideoFromList(listId, videoId);
      fetchList();
    } catch (err) {
      setError('Failed to remove video');
    }
  };

  const handleRename = async () => {
    if (!newName.trim() || !listId) return;
    try {
      await updateList(listId, { name: newName });
      setRenaming(false);
      fetchList();
    } catch (err: any) {
      setRenamingError(err?.message || 'Failed to rename list');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1A1A1A',
          borderRadius: 16,
          padding: 32,
          width: 480,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          color: '#DFD0B8',
          fontFamily: 'Lora, serif',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ marginBottom: 16, color: '#AFB774', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
        {loading ? (
          <div style={{ padding: 32 }}>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red', padding: 32 }}>{error}</div>
        ) : !list ? null : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              {renaming ? (
                <>
                  <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    style={{ fontSize: 20, padding: 8, borderRadius: 8, border: '1px solid #AFB774', marginRight: 8 }}
                  />
                  <button onClick={handleRename} style={{ marginRight: 8, color: '#DFD0B8', background: '#210f37', border: '1px solid #AFB774', borderRadius: 8, padding: '4px 12px' }}>Save</button>
                  <button onClick={() => setRenaming(false)} style={{ color: '#DFD0B8', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
                  {renamingError && <span style={{ color: 'red', marginLeft: 8 }}>{renamingError}</span>}
                </>
              ) : (
                <>
                  <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{list.name}</h2>
                  {!list.isDefault && (
                    <button onClick={() => setRenaming(true)} style={{ marginLeft: 16, color: '#AFB774', background: 'none', border: 'none', cursor: 'pointer' }}>Rename</button>
                  )}
                  {list.isDefault && <span style={{ marginLeft: 8, fontSize: 14, color: '#AFB774' }}>(Default)</span>}
                </> 
              )}
            </div>
            <div style={{ marginBottom: 24, fontSize: 16 }}>{list.videoItems.length} videos</div>
            <div>
              {list.videoItems.length === 0 ? (
                <div style={{ color: '#AFB774' }}>No videos in this list.</div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {list.videoItems.map((item: any) => {
                    let videoObj: any = typeof item.videoId === 'object'
                      ? item.videoId
                      : videoCache[item.videoId as string];

                    const thumbnail =
                      videoObj?.thumbnailUrl_youtube ||
                      (videoObj?.youtubeVideoId
                        ? `https://img.youtube.com/vi/${videoObj.youtubeVideoId}/hqdefault.jpg`
                        : '/placeholder-thumbnail.png');

                    const title =
                      videoObj?.title_youtube ||
                      (typeof item.videoId === 'object' && item.videoId.title) ||
                      (typeof item.videoId === 'string' ? 'Loading...' : '');

                    return (
                      <li key={typeof item.videoId === 'string' ? item.videoId : item.videoId._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 16, background: '#141414', borderRadius: 8, padding: 12 }}>
                        <div className="w-32 h-20 bg-gray-100 rounded overflow-hidden">
                          {item.videoId && thumbnailUrls[item.videoId._id] ? (
                            <img
                              src={thumbnailUrls[item.videoId._id]}
                              alt={item.videoId.title_youtube}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-400">Loading...</span>
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 500 }}>{title}</div>
                          <div style={{ fontSize: 14, color: '#AFB774' }}>{item.addedAt ? new Date(item.addedAt).toLocaleString() : ''}</div>
                        </div>
                        <button onClick={() => handleRemoveVideo(typeof item.videoId === 'object' ? item.videoId._id : item.videoId)} style={{ color: '#ff4d4f', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 16 }}>Remove</button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {!list.isDefault && (
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this list?')) {
                    try {
                      await deleteList(list._id);
                      onClose();
                      if (onListDeleted) onListDeleted();
                    } catch (err) {
                      alert('Failed to delete list');
                    }
                  }
                }}
                style={{
                  marginLeft: 16,
                  color: '#ff4d4f',
                  background: 'none',
                  border: '1px solid #ff4d4f',
                  borderRadius: 8,
                  padding: '4px 12px',
                  cursor: 'pointer'
                }}
              >
                Delete List
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListViewModal; 