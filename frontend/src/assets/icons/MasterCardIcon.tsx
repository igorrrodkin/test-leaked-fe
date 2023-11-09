import React from 'react';

type MasterCardIconProps = {
  width?: string;
  height?: string;
};

const MasterCardIcon: React.FC<MasterCardIconProps> = ({ width = '69', height = '50' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 69 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      y="0.5"
      width="67.1818"
      height="49"
      rx="4.5"
      fill="white"
      stroke="#DCE4E8"
    />
    <g clipPath="url(#clip0_702_40065)">
      <path
        d="M28.2456 15.582H38.8039V34.5535H28.2456V15.582Z"
        fill="#FF5F00"
      />
      <path
        d="M28.9158 25.0667C28.9158 21.2121 30.7257 17.7931 33.5077 15.5809C31.4632 13.972 28.8824 13 26.0668 13C19.3964 13 14 18.3964 14 25.0667C14 31.7368 19.3964 37.1333 26.0667 37.1333C28.8822 37.1333 31.4631 36.1613 33.5077 34.5523C30.7257 32.3736 28.9158 28.9212 28.9158 25.0667Z"
        fill="#EB001B"
      />
      <path
        d="M53.0492 25.0667C53.0492 31.7368 47.6528 37.1333 40.9825 37.1333C38.167 37.1333 35.5861 36.1613 33.5415 34.5523C36.357 32.3402 38.1336 28.9212 38.1336 25.0667C38.1336 21.2121 36.3235 17.7931 33.5415 15.5809C35.586 13.972 38.167 13 40.9825 13C47.6528 13 53.0493 18.43 53.0493 25.0667H53.0492Z"
        fill="#F79E1B"
      />
    </g>
    <defs>
      <clipPath id="clip0_702_40065">
        <rect
          width="39.2308"
          height="25"
          fill="white"
          transform="translate(14 13)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default MasterCardIcon;
