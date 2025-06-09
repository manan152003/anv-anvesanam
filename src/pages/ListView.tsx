import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListDetails, removeVideoFromList, updateList } from '../services/listService';
import type { List } from '../types';

const ListView = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [renamingError, setRenamingError] = useState('');

  useEffect(() => {
    if (listId) fetchList();
    // eslint-disable-next-line
  }, [listId]);

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

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', padding: 32 }}>{error}</div>;
  if (!list) return null;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#1A1A1A', borderRadius: 16, padding: 32, color: '#DFD0B8' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16, color: '#AFB774', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
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
            {list.videoItems.map((item: any) => (
              <li key={typeof item.videoId === 'object' ? item.videoId._id : item.videoId} style={{ display: 'flex', alignItems: 'center', marginBottom: 16, background: '#141414', borderRadius: 8, padding: 12 }}>
                <div style={{ width: 128, height: 72, background: '#eee', borderRadius: 8, overflow: 'hidden', flexShrink: 0, marginRight: 16 }}>
                  <img
                    src={item.videoId?.thumbnailUrl_youtube || (item.videoId?.youtubeVideoId ? `https://img.youtube.com/vi/${item.videoId.youtubeVideoId}/hqdefault.jpg` : '/placeholder-thumbnail.png')}
                    alt={item.videoId?.title_youtube || 'thumbnail'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{item.videoId?.title_youtube || 'Loading...'}</div>
                  <div style={{ fontSize: 14, color: '#AFB774' }}>{item.addedAt ? new Date(item.addedAt).toLocaleString() : ''}</div>
                </div>
                <button onClick={() => handleRemoveVideo(item.videoId._id || item.videoId)} style={{ color: '#ff4d4f', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 16 }}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListView; 