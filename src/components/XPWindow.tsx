import React from 'react';

interface XPWindowProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function XPWindow({ title, children, onClose, className = '' }: XPWindowProps) {
  return (
    <div className={`xp-glass overflow-hidden ${className}`}>
      <div className="xp-titlebar">
        <span>{title}</span>
        <div className="flex gap-1">
          {onClose && (
            <button className="xp-close-btn" onClick={onClose}>✕</button>
          )}
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
