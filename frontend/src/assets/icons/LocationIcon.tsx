import React from 'react';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

const LocationIcon: React.FC<Props> = ({
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
      d="M7.99992 9.45346C9.14867 9.45346 10.0799 8.52221 10.0799 7.37346C10.0799 6.2247 9.14867 5.29346 7.99992 5.29346C6.85117 5.29346 5.91992 6.2247 5.91992 7.37346C5.91992 8.52221 6.85117 9.45346 7.99992 9.45346Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M2.4133 6.16016C3.72664 0.386831 12.28 0.393498 13.5866 6.16683C14.3533 9.5535 12.2466 12.4202 10.4 14.1935C9.05997 15.4868 6.93997 15.4868 5.5933 14.1935C3.7533 12.4202 1.64664 9.54683 2.4133 6.16016Z"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
);

export default LocationIcon;
