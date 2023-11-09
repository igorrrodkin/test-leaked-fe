import React from 'react';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

const OwnerIcon: React.FC<Props> = ({
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
      d="M7.99984 8.50016C9.84079 8.50016 11.3332 7.00778 11.3332 5.16683C11.3332 3.32588 9.84079 1.8335 7.99984 1.8335C6.15889 1.8335 4.6665 3.32588 4.6665 5.16683C4.6665 7.00778 6.15889 8.50016 7.99984 8.50016Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.7268 15.1667C13.7268 12.5867 11.1601 10.5 8.0001 10.5C4.8401 10.5 2.27344 12.5867 2.27344 15.1667"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default OwnerIcon;
