import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserLists, createList, addVideoToList } from '../services/listService';
import type { List } from '../types';
import { useNavigate } from 'react-router-dom';
import ListViewModal from './ListViewModal';
import { useMobileView } from '../context/MobileViewContext';

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const AddToListModal = ({ isOpen, onClose, videoId }: AddToListModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobileView } = useMobileView();
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
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: isMobileView ? '0' : '24px',
          padding: isMobileView ? '20px' : '40px',
          width: isMobileView ? '100%' : '90vw',
          maxWidth: '600px',
          maxHeight: isMobileView ? '100vh' : '90vh',
          overflow: 'auto',
          color: '#DFD0B8',
          fontFamily: 'Lora, serif',
          boxShadow: isMobileView ? 'none' : '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)',
          animation: isMobileView ? 'slideUpMobile 0.3s ease-out' : 'slideUp 0.3s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ 
          fontSize: isMobileView ? '24px' : '32px', 
          fontWeight: 700, 
          marginBottom: isMobileView ? '24px' : '32px',
          fontFamily: 'Lora, serif',
          color: '#DFD0B8'
        }}>
          Add to Lists
        </h2>

        {/* Create New List */}
        <div style={{ 
          marginBottom: isMobileView ? '24px' : '32px',
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: isMobileView ? '16px' : '24px',
          padding: isMobileView ? '16px' : '24px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)'
        }}>
          <input
            type="text"
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
            placeholder="Create new list..."
            style={{
              width: '100%',
              padding: isMobileView ? '12px' : '16px',
              background: 'rgba(223, 208, 184, 0.05)',
              border: '1px solid rgba(223, 208, 184, 0.2)',
              borderRadius: isMobileView ? '12px' : '16px',
              color: '#DFD0B8',
              fontSize: isMobileView ? '14px' : '16px',
              fontFamily: 'Lora, serif',
              marginBottom: isMobileView ? '12px' : '16px',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(223, 208, 184, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(223, 208, 184, 0.3)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(223, 208, 184, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(223, 208, 184, 0.2)';
            }}
          />
          <button
            onClick={handleCreateList}
            disabled={isCreatingList || !newListName.trim()}
            style={{
              padding: isMobileView ? '8px 16px' : '12px 24px',
              background: 'rgba(223, 208, 184, 0.1)',
              color: '#DFD0B8',
              border: '1px solid rgba(223, 208, 184, 0.2)',
              borderRadius: isMobileView ? '12px' : '16px',
              cursor: isCreatingList || !newListName.trim() ? 'not-allowed' : 'pointer',
              opacity: isCreatingList || !newListName.trim() ? 0.5 : 1,
              fontSize: isMobileView ? '14px' : '16px',
              fontFamily: 'Lora, serif',
              transition: 'all 0.3s ease',
              width: isMobileView ? '100%' : 'auto'
            }}
            onMouseEnter={(e) => {
              if (!isCreatingList && newListName.trim()) {
                e.currentTarget.style.background = 'rgba(223, 208, 184, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isCreatingList && newListName.trim()) {
                e.currentTarget.style.background = 'rgba(223, 208, 184, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isCreatingList ? 'Creating...' : 'Create List'}
          </button>
        </div>

        {/* List of Lists */}
        {loading ? (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobileView ? '40px 0' : '60px 0'
          }}>
            <div style={{
              width: isMobileView ? '40px' : '60px',
              height: isMobileView ? '40px' : '60px',
              border: '3px solid #DFD0B8',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ 
              color: '#DFD0B8', 
              fontFamily: 'Lora, serif', 
              fontSize: isMobileView ? '16px' : '18px',
              fontWeight: 300,
              letterSpacing: '0.5px',
              marginTop: isMobileView ? '16px' : '20px'
            }}>
              Loading your lists...
            </div>
          </div>
        ) : error ? (
          <div style={{
            textAlign: 'center',
            padding: isMobileView ? '40px 20px' : '60px 40px',
            background: 'rgba(255, 77, 77, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: isMobileView ? '16px' : '20px',
            border: '1px solid rgba(255, 77, 77, 0.2)',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            <div style={{
              fontSize: isMobileView ? '20px' : '24px',
              color: '#ff6b6b',
              fontFamily: 'Lora, serif',
              marginBottom: '10px'
            }}>
              {error}
            </div>
            <div style={{
              fontSize: isMobileView ? '14px' : '16px',
              color: 'rgba(255, 107, 107, 0.7)',
              fontFamily: 'Lora, serif'
            }}>
              Please try again later
            </div>
          </div>
        ) : (
          <div style={{ 
            marginBottom: isMobileView ? '24px' : '32px',
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: isMobileView ? '16px' : '24px',
            padding: isMobileView ? '16px' : '24px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)'
          }}>
            {lists.map((list, index) => (
              <div
                key={list._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: isMobileView ? '12px' : '16px',
                  borderBottom: index < lists.length - 1 ? '1px solid rgba(223, 208, 184, 0.1)' : 'none',
                  transition: 'all 0.3s ease',
                  animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`,
                  flexWrap: isMobileView ? 'wrap' : 'nowrap',
                  gap: isMobileView ? '8px' : '0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(223, 208, 184, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedLists.has(list._id)}
                  onChange={() => toggleListSelection(list._id)}
                  style={{ 
                    marginRight: isMobileView ? '12px' : '16px',
                    width: isMobileView ? '16px' : '20px',
                    height: isMobileView ? '16px' : '20px',
                    accentColor: '#DFD0B8'
                  }}
                />
                <div style={{ flex: 1, minWidth: isMobileView ? 'calc(100% - 28px)' : 'auto' }}>
                  <div style={{ 
                    fontSize: isMobileView ? '16px' : '18px', 
                    fontWeight: 500,
                    fontFamily: 'Lora, serif',
                    color: '#DFD0B8',
                    marginBottom: '4px'
                  }}>
                    {list.name}
                    {list.isDefault && (
                      <span style={{ 
                        marginLeft: isMobileView ? '8px' : '12px', 
                        fontSize: isMobileView ? '12px' : '14px', 
                        color: 'rgba(223, 208, 184, 0.6)',
                        background: 'rgba(223, 208, 184, 0.1)',
                        padding: isMobileView ? '2px 8px' : '4px 12px',
                        borderRadius: isMobileView ? '8px' : '12px',
                        border: '1px solid rgba(223, 208, 184, 0.2)'
                      }}>
                        Default List
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: isMobileView ? '12px' : '14px', 
                    color: 'rgba(223, 208, 184, 0.6)',
                    fontFamily: 'Lora, serif'
                  }}>
                    {list.videoItems.length} videos
                  </div>
                </div>
                <button
                  onClick={() => setViewingListId(list._id)}
                  style={{ 
                    marginLeft: isMobileView ? 0 : 16, 
                    color: '#DFD0B8',
                    background: 'rgba(223, 208, 184, 0.1)',
                    border: '1px solid rgba(223, 208, 184, 0.2)',
                    borderRadius: isMobileView ? '12px' : '16px',
                    padding: isMobileView ? '6px 12px' : '8px 16px',
                    fontSize: isMobileView ? '12px' : '14px',
                    fontFamily: 'Lora, serif',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: isMobileView ? '100%' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(223, 208, 184, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(223, 208, 184, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: isMobileView ? '12px' : '16px', 
          justifyContent: 'flex-end',
          flexDirection: isMobileView ? 'column' : 'row'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: isMobileView ? '8px 16px' : '12px 24px',
              background: 'rgba(223, 208, 184, 0.1)',
              color: '#DFD0B8',
              border: '1px solid rgba(223, 208, 184, 0.2)',
              borderRadius: isMobileView ? '12px' : '16px',
              fontSize: isMobileView ? '14px' : '16px',
              fontFamily: 'Lora, serif',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: isMobileView ? '100%' : 'auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(223, 208, 184, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(223, 208, 184, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAddToLists}
            disabled={selectedLists.size === 0}
            style={{
              padding: isMobileView ? '8px 16px' : '12px 24px',
              background: 'rgba(223, 208, 184, 0.1)',
              color: '#DFD0B8',
              border: '1px solid rgba(223, 208, 184, 0.2)',
              borderRadius: isMobileView ? '12px' : '16px',
              fontSize: isMobileView ? '14px' : '16px',
              fontFamily: 'Lora, serif',
              cursor: selectedLists.size === 0 ? 'not-allowed' : 'pointer',
              opacity: selectedLists.size === 0 ? 0.5 : 1,
              transition: 'all 0.3s ease',
              width: isMobileView ? '100%' : 'auto'
            }}
            onMouseEnter={(e) => {
              if (selectedLists.size > 0) {
                e.currentTarget.style.background = 'rgba(223, 208, 184, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedLists.size > 0) {
                e.currentTarget.style.background = 'rgba(223, 208, 184, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
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

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            0% {
              opacity: 0;
              transform: translateY(60px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideUpMobile {
            0% {
              opacity: 0;
              transform: translateY(100%);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AddToListModal; 