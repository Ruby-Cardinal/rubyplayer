import React, { useState, useEffect } from 'react';
import { X, Palette, Sparkles, AlertTriangle, Disc, Activity, User, Lock, Key, CheckCircle, AlertCircle, Flower2, FileText } from 'lucide-react';
import { getThemes, getThemeById, getActiveTheme, getSavedThemeOption, setThemeOption } from '../services/themeService';

import {
  applySiteThemeColor,
  getSavedSiteThemeColor,
  getSavedRainbowFrozen,
  setRainbowFrozen,
  getSavedDisableRotation,
  setDisableRotation,
  getSavedDisableVisualizerMotion,
  setDisableVisualizerMotion,
  getSavedLyricSync,
  setLyricSync,
  changeUserPassword,
} from '../services/mediaService';


const COLOR_PRESETS = [
  { name: 'Ruby Red', hex: '#ff2e55' },
  { name: 'Sapphire Blue', hex: '#3b82f6' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Amethyst Purple', hex: '#8b5cf6' },
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Neon Cyan', hex: '#06b6d4' },
  { name: 'Hot Pink', hex: '#ec4899' },
];

export default function ConfigModal({ isOpen, onClose }) {
  const [siteColor, setSiteColor] = useState(() => getSavedSiteThemeColor());
  const [isRainbowFrozen, setIsRainbowFrozen] = useState(() => getSavedRainbowFrozen());
  const [disableRotation, setDisableRotationState] = useState(() => getSavedDisableRotation());
  const [disableVisualizerMotion, setDisableVisualizerMotionState] = useState(() => getSavedDisableVisualizerMotion());
  const [lyricSync, setLyricSyncState] = useState(() => getSavedLyricSync());

  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdMsg, setPwdMsg] = useState(null);
  const [pwdErr, setPwdErr] = useState(null);

  const [optionTick, setOptionTick] = useState(0);

  const handleOptionToggle = (themeId, optionId, value) => {
    setThemeOption(themeId, optionId, value);
    setOptionTick((t) => t + 1);
    applySiteThemeColor(siteColor);
  };

  const handleChangePassword = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPwdMsg(null);
    setPwdErr(null);
    if (!pwdNew) {
      setPwdErr('Please enter a new password');
      return;
    }
    try {
      await changeUserPassword(pwdCurrent, pwdNew);
      setPwdMsg('Password updated successfully');
      setPwdCurrent('');
      setPwdNew('');
    } catch (err) {
      setPwdErr('Failed to change password');
    }
  };

  useEffect(() => {
    const currentThemeColor = getSavedSiteThemeColor();
    setSiteColor(currentThemeColor);
    setIsRainbowFrozen(getSavedRainbowFrozen());
    setDisableRotationState(getSavedDisableRotation());
    setDisableVisualizerMotionState(getSavedDisableVisualizerMotion());
    setLyricSyncState(getSavedLyricSync());
    applySiteThemeColor(currentThemeColor);
    setDisableRotation(getSavedDisableRotation());
    setDisableVisualizerMotion(getSavedDisableVisualizerMotion());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleColorChange = (hex) => {
    setSiteColor(hex);
    applySiteThemeColor(hex);
  };

  const handleFrozenToggle = (e) => {
    const nextFrozen = e.target.checked;
    setIsRainbowFrozen(nextFrozen);
    setRainbowFrozen(nextFrozen);
  };

  const handleRotationToggle = (e) => {
    const nextVal = e.target.checked;
    setDisableRotationState(nextVal);
    setDisableRotation(nextVal);
  };

  const handleVisualizerMotionToggle = (e) => {
    const nextVal = e.target.checked;
    setDisableVisualizerMotionState(nextVal);
    setDisableVisualizerMotion(nextVal);
  };

  const handleLyricSyncToggle = (e) => {
    const nextVal = e.target.checked;
    setLyricSyncState(nextVal);
    setLyricSync(nextVal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applySiteThemeColor(siteColor);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Theme Personalization</div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              <Palette size={18} style={{ color: 'var(--accent-ruby)' }} />
              <span>Site Theme Accent Color</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  className="theme-preset-swatch"
                  onClick={() => handleColorChange(preset.hex)}
                  title={preset.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: preset.hex,
                    border: siteColor.toLowerCase() === preset.hex.toLowerCase() ? '3px solid #ffffff' : '2px solid transparent',
                    boxShadow: siteColor.toLowerCase() === preset.hex.toLowerCase() ? `0 0 12px ${preset.hex}` : 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, border 0.15s ease',
                    transform: siteColor.toLowerCase() === preset.hex.toLowerCase() ? 'scale(1.15)' : 'scale(1)',
                    filter: 'none',
                  }}
                />
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.25rem' }}>
                <input
                  type="color"
                  value={siteColor.toLowerCase() === 'rainbow' ? '#ff2e55' : (siteColor.startsWith('#') ? siteColor : '#ff2e55')}
                  onChange={(e) => handleColorChange(e.target.value)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-glass)',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '2px',
                  }}
                  title="Choose Custom Color"
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Custom</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              <Sparkles size={18} style={{ color: '#ec4899' }} />
              <span>Special Themes</span>
            </label>

            <div style={{ marginBottom: '0.85rem' }}>
              <select
                value={getThemeById(siteColor) ? siteColor.toLowerCase() : 'none'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'none') {
                    handleColorChange('#ff2e55');
                  } else {
                    handleColorChange(val);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--border-glass)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.85rem center',
                  backgroundSize: '1rem',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="none" style={{ background: '#18181b', color: '#f4f4f5' }}>
                  None (Use Standard Accent Color)
                </option>
                {getThemes().map((t) => (
                  <option key={t.id} value={t.id.toLowerCase()} style={{ background: '#18181b', color: '#f4f4f5' }}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {(() => {
              const activeT = getThemeById(siteColor);
              if (!activeT) return null;

              const hasOptions = Array.isArray(activeT.options) && activeT.options.length > 0;
              const IconComponent = activeT.Icon || Sparkles;

              return (
                <div style={{ marginTop: '0.85rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-sm, 6px)',
                      background: activeT.previewGradient || 'var(--accent-ruby-bg-glow)',
                      color: activeT.previewTextColor || '#ffffff',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      marginBottom: hasOptions ? '0.75rem' : '0',
                    }}
                  >
                    <IconComponent size={16} />
                    <span>Active Theme: {activeT.name}</span>
                  </div>

                  {hasOptions && activeT.options.map((opt) => {
                    if (opt.id === 'freeze') {
                      return (
                        <div key={opt.id}>
                          <div
                            style={{
                              marginBottom: '0.65rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: 'rgba(255, 255, 255, 0.04)',
                              padding: '0.65rem 0.85rem',
                              borderRadius: 'var(--radius-sm, 6px)',
                              border: '1px solid var(--border-glass)',
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '0.5rem' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                {opt.label}
                              </span>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                {opt.description}
                              </span>
                            </div>
                            <label className="toggle-switch">
                              <input type="checkbox" checked={isRainbowFrozen} onChange={handleFrozenToggle} />
                              <span className="toggle-slider"></span>
                            </label>
                          </div>
                          {!isRainbowFrozen && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.65rem',
                                padding: '0.7rem 0.9rem',
                                borderRadius: 'var(--radius-sm, 6px)',
                                background: 'rgba(245, 158, 11, 0.12)',
                                border: '1px solid rgba(245, 158, 11, 0.35)',
                                color: '#fcd34d',
                                fontSize: '0.78rem',
                                lineHeight: '1.45',
                              }}
                            >
                              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#f59e0b' }} />
                              <div>
                                <strong>Notice:</strong> May increase battery drain while active.
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                    const isChecked = getSavedThemeOption(activeT.id, opt.id, false);
                    return (
                      <div
                        key={opt.id}
                        style={{
                          marginBottom: '0.65rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(255, 255, 255, 0.04)',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm, 6px)',
                          border: '1px solid var(--border-glass)',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '0.5rem' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {opt.label}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {opt.description}
                          </span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleOptionToggle(activeT.id, opt.id, e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          <div style={{ marginBottom: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              <Activity size={18} style={{ color: 'var(--accent-ruby)' }} />
              <span>Playback Options</span>
            </label>

            <div
              style={{
                marginBottom: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm, 6px)',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Disc size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Disable Record Rotation
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Keeps the vinyl static while playing
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={disableRotation} onChange={handleRotationToggle} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div
              style={{
                marginBottom: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm, 6px)',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Activity size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Disable Visualizer Motion
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Disable visualizer motion while using the app
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={disableVisualizerMotion} onChange={handleVisualizerMotionToggle} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm, 6px)',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Lyric Sync
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    If lyrics have LRC time tags, it will display the live lyrics when playing.
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={lyricSync} onChange={handleLyricSyncToggle} />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>


          <div style={{ marginBottom: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              <User size={18} style={{ color: 'var(--accent-ruby)' }} />
              <span>Account &amp; Security</span>
            </label>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Key size={14} />
                <span>Change Password</span>
              </div>

              {pwdMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.78rem', marginBottom: '0.6rem' }}>
                  <CheckCircle size={14} />
                  <span>{pwdMsg}</span>
                </div>
              )}
              {pwdErr && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fca5a5', fontSize: '0.78rem', marginBottom: '0.6rem' }}>
                  <AlertCircle size={14} />
                  <span>{pwdErr}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                <input
                  type="password"
                  value={pwdCurrent}
                  onChange={(e) => setPwdCurrent(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); handleChangePassword(); } }}
                  placeholder="Current password"
                  style={{
                    flex: '1',
                    minWidth: '130px',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-glass)',
                    background: 'rgba(0, 0, 0, 0.2)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                  }}
                />
                <input
                  type="password"
                  value={pwdNew}
                  onChange={(e) => setPwdNew(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); handleChangePassword(); } }}
                  placeholder="New password"
                  style={{
                    flex: '1',
                    minWidth: '130px',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-glass)',
                    background: 'rgba(0, 0, 0, 0.2)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleChangePassword(); }}
                  className="btn-icon"
                  style={{ width: 'auto', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: '600' }}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                background: 'var(--accent-ruby)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-ruby)',
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
