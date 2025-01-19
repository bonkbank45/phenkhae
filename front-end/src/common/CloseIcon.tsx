import React from 'react';

const CloseIcon = ({ w, h }: { w: number; h: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    width={w}
    height={h}
  >
    <circle cx="512" cy="512" r="512" fill="#FF3B30" />
    <path
      d="M684.7 684.7c-12.5 12.5-32.8 12.5-45.3 0L512 557.3 384.7 684.7c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L466.7 512 339.3 384.7c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L512 466.7l127.3-127.3c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L557.3 512l127.3 127.3c12.5 12.5 12.5 32.8 0 45.3z"
      fill="#FFFFFF"
    />
  </svg>
);

export default CloseIcon;
