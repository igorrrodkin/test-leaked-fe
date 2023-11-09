import React from 'react';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

const ClockIcon: React.FC<Props> = ({
  width = 16,
  height = 16,
  color = '#ACB5BB',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.6666 8.50016C14.6666 12.1802 11.6799 15.1668 7.99992 15.1668C4.31992 15.1668 1.33325 12.1802 1.33325 8.50016C1.33325 4.82016 4.31992 1.8335 7.99992 1.8335C11.6799 1.8335 14.6666 4.82016 14.6666 8.50016Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.4734 10.6202L8.40675 9.38684C8.04675 9.1735 7.75342 8.66017 7.75342 8.24017V5.50684"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ClockIcon;
