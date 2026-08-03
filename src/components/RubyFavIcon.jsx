import React from 'react';

export default function RubyFavIcon({
  filled = false,
  size = 16,
  className = '',
  style = {},
  ...props
}) {
  return (
    <svg
      viewBox="0 0 15.787584 15.787584"
      width={size}
      height={size}
      fill="currentColor"
      className={`ruby-fav-icon ${filled ? 'filled' : 'unfilled'} ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      {...props}
    >
      {filled ? (
        <path
          d="M 7.893792,0 0,5.525655 7.893792,15.787584 15.787584,5.525655 Z"
          style={{ strokeWidth: 0.789379 }}
        />
      ) : (
        <path
          d="M 7.893792,0 0,5.525655 7.893792,15.787584 15.787584,5.525655 Z m 0,2.999641 4.894151,2.526014 -4.894151,6.315033 -4.894151,-6.315033 z"
          style={{ strokeWidth: 0.789379 }}
        />
      )}
    </svg>
  );
}
