import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  as: Tag = 'button',
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'default' ? `btn-${size}` : '',
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag
      type={Tag === 'button' ? type : undefined}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </Tag>
  );
}
