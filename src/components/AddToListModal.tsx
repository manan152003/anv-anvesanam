import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserLists, createList, addVideoToList } from '../services/listService';
import type { List } from '../types';
import { useNavigate } from 'react-router-dom';
import ListViewModal from './ListViewModal';

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const AddToListModal = ({ isOpen, onClose, videoId }: AddToListModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newListName, setNewListName] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());
  const [viewingListId, setViewingListId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchLists();
    }
  }, [isOpen, user]);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const userLists = await getUserLists();
      setLists(userLists);
    } catch (err) {
      setError('Failed to load lists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    try {
      setIsCreatingList(true);
      const newList = await createList({ name: newListName });
      setLists(prev => [...prev, newList]);
      setNewListName('');
    } catch (err) {
      setError('Failed to create list');
    } finally {
      setIsCreatingList(false);
    }
  };

  const handleAddToLists = async () => {
    try {
      const promises = Array.from(selectedLists).map(listId => 
        addVideoToList(listId, videoId)
      );
      await Promise.all(promises);
      onClose();
    } catch (err) {
      setError('Failed to add video to lists');
    }
  };

  const toggleListSelection = (listId: string) => {
    setSelectedLists(prev => {
      const next = new Set(prev);
      if (next.has(listId)) {
        next.delete(listId);
      } else {
        next.add(listId);
      }
      return next;
    });
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
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1A1A1A',
          borderRadius: '16px',
          padding: '32px',
          width: '480px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          color: '#DFD0B8',
          fontFamily: 'Lora, serif',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
          Add to Lists
        </h2>

        {/* Create New List */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
            placeholder="Create new list..."
            style={{
              width: '100%',
              padding: '12px',
              background: '#141414',
              border: '1px solid #DFD0B8',
              borderRadius: '8px',
              color: '#DFD0B8',
              fontSize: '16px',
              marginBottom: '8px',
            }}
          />
          <button
            onClick={handleCreateList}
            disabled={isCreatingList || !newListName.trim()}
            style={{
              padding: '8px 16px',
              background: '#210f37',
              color: '#DFD0B8',
              border: '1px solid #AFB774',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: isCreatingList || !newListName.trim() ? 0.5 : 1,
            }}
          >
            {isCreatingList ? 'Creating...' : 'Create List'}
          </button>
        </div>

        {/* List of Lists */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>Loading lists...</div>
        ) : error ? (
          <div style={{ color: '#ff4d4f', textAlign: 'center', padding: '24px' }}>{error}</div>
        ) : (
          <div style={{ marginBottom: '24px' }}>
            {lists.map(list => (
              <div
                key={list._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  borderBottom: '1px solid rgba(223, 208, 184, 0.1)',
                  opacity: list.isDefault ? 1 : 0.8,
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedLists.has(list._id)}
                  onChange={() => toggleListSelection(list._id)}
                  style={{ marginRight: '12px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 500 }}>
                    {list.name}
                    {list.isDefault && (
                      <span style={{ marginLeft: '8px', fontSize: '12px', color: '#AFB774' }}>
                        (Default)
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(223, 208, 184, 0.6)' }}>
                    {list.videoItems.length} videos
                  </div>
                </div>
                <button
                  onClick={() => setViewingListId(list._id)}
                  style={{ marginLeft: 12, color: '#AFB774', background: 'none', border: '1px solid #AFB774', borderRadius: 8, padding: '4px 12px', cursor: 'pointer' }}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: '#075b5e',
              color: '#DFD0B8',
              border: '1px solid #AFB774',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAddToLists}
            disabled={selectedLists.size === 0}
            style={{
              padding: '8px 16px',
              background: '#210f37',
              color: '#DFD0B8',
              border: '1px solid #AFB774',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: selectedLists.size === 0 ? 0.5 : 1,
            }}
          >
            Add to Selected Lists
          </button>
        </div>
      </div>
      <ListViewModal
        listId={viewingListId}
        isOpen={!!viewingListId}
        onClose={() => setViewingListId(null)}
        onListDeleted={fetchLists}
      />
    </div>
  );
};

export default AddToListModal; 