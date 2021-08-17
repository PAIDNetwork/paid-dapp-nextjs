import React from 'react';

const PdSvgWarning = ({ className, color }) => {
  let customColor = color;
  if (color === 'danger') {
    customColor = '#da1e5e';
  }

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0)">
        <path
          d="M11 7V12"
          stroke={customColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.9997 20.1666C16.0623 20.1666 20.1663 16.0625 20.1663 10.9999C20.1663 5.93731 16.0623 1.83325 10.9997 1.83325C5.93706 1.83325 1.83301 5.93731 1.83301 10.9999C1.83301 16.0625 5.93706 20.1666 10.9997 20.1666Z"
          stroke={customColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="11" cy="15" r="1" fill={customColor} />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="22" height="22" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PdSvgWarning;
