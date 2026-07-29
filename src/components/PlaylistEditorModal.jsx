import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  ListMusic,
  ChevronRight,
  ChevronDown,
  Folder,
  Music,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Save,
  Search,
  CheckSquare,
  Square,
} from 'lucide-react';
import { savePlaylistOnServer } from '../services/mediaService';

function buildFolderTree(tracks, filterText) {
  const root = { name: 'Root', path: '', folders: {}, files: [] };

  tracks.forEach((track) => {
    if (!track.relativePath) return;

    if (filterText) {
      const q = filterText.toLowerCase();
      const matches =
        (track.title && track.title.toLowerCase().includes(q)) ||
        (track.artist && track.artist.toLowerCase().includes(q)) ||
        (track.relativePath && track.relativePath.toLowerCase().includes(q));
      if (!matches) return;
    }

    const normalizedPath = track.relativePath.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');
    const fileName = parts.pop();
    let currentFolder = root;
    let currentPath = '';

    parts.forEach((part) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      if (!currentFolder.folders[part]) {
        currentFolder.folders[part] = {
          name: part,
          path: currentPath,
          folders: {},
          files: [],
        };
      }
      currentFolder = currentFolder.folders[part];
    });

    currentFolder.files.push({ ...track, fileName });
  });

  return root;
}

function getAllTracksInFolder(folderNode) {
  let result = [...folderNode.files];
  Object.values(folderNode.folders).forEach((sub) => {
    result = result.concat(getAllTracksInFolder(sub));
  });
  return result;
}

export default function PlaylistEditorModal({
  isOpen,
  onClose,
  playlists = [],
  allTracks = [],
  onPlaylistSaved,
}) {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('NEW');
  const [playlistName, setPlaylistName] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // Selection states
  const [selectedLeftIndices, setSelectedLeftIndices] = useState(new Set());
  const [selectedRightPaths, setSelectedRightPaths] = useState(new Set());

  // Tree UI state
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [rightSearchQuery, setRightSearchQuery] = useState('');

  // Status & loading
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Initialize or reset when modal opens or selected playlist changes
  useEffect(() => {
    if (!isOpen) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setSelectedLeftIndices(new Set());
    setSelectedRightPaths(new Set());

    if (selectedPlaylistId === 'NEW') {
      setPlaylistName('');
      setPlaylistTracks([]);
    } else {
      const pl = playlists.find((p) => p.id === selectedPlaylistId);
      if (pl) {
        setPlaylistName(pl.name.replace(/\.(m3u8?|pls)$/i, ''));
        // Resolve playlist track paths to track objects from allTracks
        const loadedTracks = [];
        if (Array.isArray(pl.tracks)) {
          pl.tracks.forEach((pathStr) => {
            if (typeof pathStr !== 'string') return;
            const matched = allTracks.find(
              (t) =>
                t.relativePath === pathStr ||
                t.relativePath.endsWith(pathStr) ||
                pathStr.endsWith(t.relativePath)
            );
            if (matched) {
              loadedTracks.push(matched);
            } else {
              // Fallback placeholder for raw path
              loadedTracks.push({
                relativePath: pathStr,
                title: pathStr.split(/[/\\]/).pop(),
                artist: 'Unknown',
              });
            }
          });
        }
        setPlaylistTracks(loadedTracks);
      }
    }
  }, [isOpen, selectedPlaylistId]);

  // Expand all folders by default when tree changes
  useEffect(() => {
    if (!isOpen) return;
    const paths = new Set();
    const collectFolderPaths = (folder) => {
      if (folder.path) paths.add(folder.path);
      Object.values(folder.folders).forEach(collectFolderPaths);
    };
    const tree = buildFolderTree(allTracks, '');
    collectFolderPaths(tree);
    setExpandedFolders(paths);
  }, [isOpen, allTracks.length]);

  if (!isOpen) return null;

  // Filter out tracks already present in playlist to PREVENT DUPLICATION
  const playlistPathSet = new Set(playlistTracks.map((t) => t.relativePath));
  const availableRightTracks = allTracks.filter(
    (t) => !playlistPathSet.has(t.relativePath)
  );

  const folderTreeRoot = buildFolderTree(availableRightTracks, rightSearchQuery);

  // Toggle folder expanded
  const toggleFolderExpand = (folderPath) => {
    const next = new Set(expandedFolders);
    if (next.has(folderPath)) {
      next.delete(folderPath);
    } else {
      next.add(folderPath);
    }
    setExpandedFolders(next);
  };

  // Selection handlers for Left Box (multi-select by default)
  const toggleLeftSelection = (index) => {
    const next = new Set(selectedLeftIndices);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelectedLeftIndices(next);
  };

  // Selection handlers for Right Tree (multi-select by default)
  const toggleRightTrackSelection = (trackPath) => {
    const next = new Set(selectedRightPaths);
    if (next.has(trackPath)) {
      next.delete(trackPath);
    } else {
      next.add(trackPath);
    }
    setSelectedRightPaths(next);
  };

  const toggleRightFolderSelection = (folderNode) => {
    const folderTracks = getAllTracksInFolder(folderNode);
    const folderTrackPaths = folderTracks.map((t) => t.relativePath);
    const allSelected = folderTrackPaths.every((p) => selectedRightPaths.has(p));

    const next = new Set(selectedRightPaths);
    folderTrackPaths.forEach((p) => {
      if (allSelected) next.delete(p);
      else next.add(p);
    });
    setSelectedRightPaths(next);
  };

  // Transfer Actions
  const handleAddSelectedToPlaylist = () => {
    if (selectedRightPaths.size === 0) return;
    const tracksToAdd = availableRightTracks.filter((t) =>
      selectedRightPaths.has(t.relativePath)
    );
    setPlaylistTracks([...playlistTracks, ...tracksToAdd]);
    setSelectedRightPaths(new Set());
  };

  const handleRemoveSelectedFromPlaylist = () => {
    if (selectedLeftIndices.size === 0) return;
    const nextTracks = playlistTracks.filter((_, idx) => !selectedLeftIndices.has(idx));
    setPlaylistTracks(nextTracks);
    setSelectedLeftIndices(new Set());
  };

  // Reorder Left Box
  const handleMoveLeftUp = () => {
    if (selectedLeftIndices.size !== 1) return;
    const idx = Array.from(selectedLeftIndices)[0];
    if (idx <= 0) return;
    const nextTracks = [...playlistTracks];
    const temp = nextTracks[idx - 1];
    nextTracks[idx - 1] = nextTracks[idx];
    nextTracks[idx] = temp;
    setPlaylistTracks(nextTracks);
    setSelectedLeftIndices(new Set([idx - 1]));
  };

  const handleMoveLeftDown = () => {
    if (selectedLeftIndices.size !== 1) return;
    const idx = Array.from(selectedLeftIndices)[0];
    if (idx < 0 || idx >= playlistTracks.length - 1) return;
    const nextTracks = [...playlistTracks];
    const temp = nextTracks[idx + 1];
    nextTracks[idx + 1] = nextTracks[idx];
    nextTracks[idx] = temp;
    setPlaylistTracks(nextTracks);
    setSelectedLeftIndices(new Set([idx + 1]));
  };

  // Save Playlist to server as M3U
  const handleSavePlaylist = async () => {
    if (!playlistName.trim()) {
      setErrorMessage('Please enter a playlist name.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const trackRelativePaths = playlistTracks.map(
        (t) => t.relativePath || t.id
      );

      const res = await savePlaylistOnServer(playlistName.trim(), trackRelativePaths);
      setSuccessMessage(res.message || 'Playlist saved successfully!');

      if (onPlaylistSaved) {
        await onPlaylistSaved();
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save playlist');
    } finally {
      setIsSaving(false);
    }
  };

  // Recursive Tree Node Renderer for Right Box
  const renderTreeNode = (folderNode, depth = 0) => {
    const isExpanded = expandedFolders.has(folderNode.path) || rightSearchQuery.length > 0;
    const folderTracks = getAllTracksInFolder(folderNode);
    const folderTrackPaths = folderTracks.map((t) => t.relativePath);
    const isFolderSelected =
      folderTrackPaths.length > 0 &&
      folderTrackPaths.every((p) => selectedRightPaths.has(p));
    const isFolderPartiallySelected =
      !isFolderSelected && folderTrackPaths.some((p) => selectedRightPaths.has(p));

    return (
      <div key={folderNode.path || folderNode.name} className="tree-folder-node">
        {folderNode.path && (
          <div
            className="tree-folder-header"
            style={{ paddingLeft: `${depth * 14 + 8}px` }}
          >
            <button
              type="button"
              className="btn-icon-sm"
              onClick={() => toggleFolderExpand(folderNode.path)}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            <button
              type="button"
              className="checkbox-btn"
              onClick={() => toggleRightFolderSelection(folderNode)}
            >
              {isFolderSelected ? (
                <CheckSquare size={14} className="checkbox-checked" />
              ) : isFolderPartiallySelected ? (
                <CheckSquare size={14} className="checkbox-partial" />
              ) : (
                <Square size={14} className="checkbox-unchecked" />
              )}
            </button>

            <Folder size={14} className="folder-icon" />
            <span
              className="folder-name"
              onClick={() => toggleFolderExpand(folderNode.path)}
            >
              {folderNode.name}
            </span>
            <span className="count-badge">{folderTracks.length}</span>
          </div>
        )}

        {(isExpanded || !folderNode.path) && (
          <div className="tree-folder-children">
            {/* Render Subfolders */}
            {Object.values(folderNode.folders).map((sub) =>
              renderTreeNode(sub, folderNode.path ? depth + 1 : depth)
            )}

            {/* Render Files */}
            {folderNode.files.map((file) => {
              const isFileSelected = selectedRightPaths.has(file.relativePath);
              return (
                <div
                  key={file.relativePath}
                  className={`tree-file-node ${isFileSelected ? 'selected' : ''}`}
                  style={{ paddingLeft: `${(folderNode.path ? depth + 1 : depth) * 14 + 28}px` }}
                  onClick={() => toggleRightTrackSelection(file.relativePath)}
                >
                  {isFileSelected ? (
                    <CheckSquare size={14} className="checkbox-checked" />
                  ) : (
                    <Square size={14} className="checkbox-unchecked" />
                  )}
                  <Music size={13} className="file-icon" />
                  <span className="file-title">{file.title || file.fileName}</span>
                  {file.artist && <span className="file-artist">- {file.artist}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="modal-overlay modal-backdrop" onClick={onClose}>
      <div className="playlist-editor-modal glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <ListMusic size={22} className="title-icon" />
            <h2>Playlist Manager</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Top Dropdown & Playlist Name Selection */}
        <div className="editor-top-bar">
          <div className="form-group flex-1">
            <label>Select Playlist to Edit or Create</label>
            <select
              className="select-input"
              value={selectedPlaylistId}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
            >
              <option value="NEW">➕ -- Create New Playlist --</option>
              {[...playlists]
                .sort((a, b) => {
                  if (Boolean(a.isArtistPlaylist) !== Boolean(b.isArtistPlaylist)) {
                    return a.isArtistPlaylist ? 1 : -1;
                  }
                  return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
                })
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.isArtistPlaylist ? '🎵 ' : ''}{p.name} ({Array.isArray(p.tracks) ? p.tracks.length : 0} songs)
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label>Playlist Name (.m3u)</label>
            <input
              type="text"
              className="text-input"
              placeholder="e.g. Summer Roadtrip"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
          </div>
        </div>

        {/* Dual List Box Layout */}
        <div className="dual-box-container">
          {/* Left Box: Songs in Playlist */}
          <div className="box-panel left-panel">
            <div className="panel-header">
              <h3>
                Songs in Playlist <span className="badge">{playlistTracks.length}</span>
              </h3>
              <div className="panel-actions">
                <button
                  type="button"
                  className="btn-icon-action"
                  onClick={handleMoveLeftUp}
                  disabled={selectedLeftIndices.size !== 1 || Array.from(selectedLeftIndices)[0] <= 0}
                  title="Move Up"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  className="btn-icon-action"
                  onClick={handleMoveLeftDown}
                  disabled={
                    selectedLeftIndices.size !== 1 ||
                    Array.from(selectedLeftIndices)[0] >= playlistTracks.length - 1
                  }
                  title="Move Down"
                >
                  <ArrowDown size={15} />
                </button>
              </div>
            </div>

            <div className="panel-body list-box">
              {playlistTracks.length === 0 ? (
                <div className="empty-panel-msg">
                  No songs in playlist. Add songs from the right tree.
                </div>
              ) : (
                playlistTracks.map((t, idx) => {
                  const isSelected = selectedLeftIndices.has(idx);
                  return (
                    <div
                      key={`${t.relativePath}-${idx}`}
                      className={`playlist-item-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleLeftSelection(idx)}
                    >
                      <span className="item-index">{idx + 1}.</span>
                      <span className="item-name">{t.title || t.relativePath}</span>
                      {t.artist && <span className="item-sub">- {t.artist}</span>}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Middle Controls Column: Transfer Arrows */}
          <div className="transfer-column">
            <button
              type="button"
              className="btn-transfer primary"
              onClick={handleAddSelectedToPlaylist}
              disabled={selectedRightPaths.size === 0}
              title="Add selected songs to playlist"
            >
              <ArrowLeft size={20} />
              <span>Add</span>
            </button>

            <button
              type="button"
              className="btn-transfer secondary"
              onClick={handleRemoveSelectedFromPlaylist}
              disabled={selectedLeftIndices.size === 0}
              title="Remove selected songs from playlist"
            >
              <span>Remove</span>
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Right Box: Folder Tree of Available Library Songs */}
          <div className="box-panel right-panel">
            <div className="panel-header">
              <h3>
                Available Library Folders <span className="badge">{availableRightTracks.length}</span>
              </h3>
              <div className="tree-search-wrapper">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Filter folders..."
                  value={rightSearchQuery}
                  onChange={(e) => setRightSearchQuery(e.target.value)}
                  className="tree-search-input"
                />
              </div>
            </div>

            <div className="panel-body tree-box">
              {availableRightTracks.length === 0 ? (
                <div className="empty-panel-msg">
                  {allTracks.length === 0
                    ? 'No media files scanned in library.'
                    : 'All songs are already in this playlist.'}
                </div>
              ) : (
                renderTreeNode(folderTreeRoot)
              )}
            </div>
          </div>
        </div>

        {/* Notifications & Error messages */}
        {errorMessage && <div className="modal-error">{errorMessage}</div>}
        {successMessage && <div className="modal-success">{successMessage}</div>}

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </button>

          <button
            className="btn-primary btn-save-playlist"
            onClick={handleSavePlaylist}
            disabled={isSaving || !playlistName.trim()}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Playlist (.m3u)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
