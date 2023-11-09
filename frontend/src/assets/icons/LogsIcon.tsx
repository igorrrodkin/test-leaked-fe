import React, { SVGAttributes } from 'react';

interface Props extends SVGAttributes<HTMLOrSVGElement> {}

const LogsIcon: React.FC<Props> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32" {...props}>
    <path fill="#6C7278" stroke="#6C7278" strokeWidth="1" d="M18 19h12v2H18zm0 4h12v2H18zm0 4h8v2h-8z" />
    <path fill="#6C7278" stroke="#6C7278" strokeWidth="1" d="M24 4a3.996 3.996 0 0 0-3.858 3H12V4H4v8h8V9h8.142a3.94 3.94 0 0 0 .425 1.019L10.019 20.567A3.952 3.952 0 0 0 8 20a4 4 0 1 0 3.858 5H16v-2h-4.142a3.94 3.94 0 0 0-.425-1.019l10.548-10.548A3.952 3.952 0 0 0 24 12a4 4 0 0 0 0-8Zm-14 6H6V6h4ZM8 26a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2Zm16-16a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2Z" />
  </svg>
);

export default LogsIcon;
