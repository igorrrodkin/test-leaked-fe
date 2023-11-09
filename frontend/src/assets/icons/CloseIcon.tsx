import React, { SVGAttributes } from 'react';

import { HandleToggle } from '@/hooks/useToggle';

interface Props extends SVGAttributes<HTMLOrSVGElement> {
  handler?: HandleToggle
}

const CloseIcon: React.FC<Props> = ({ handler, ...props }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={handler}
    {...props}
  >
    <path d="M5.00098 5L19 18.9991" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.99996 18.9991L18.999 5" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default CloseIcon;
