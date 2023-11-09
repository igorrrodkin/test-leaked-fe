import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLOrSVGElement> {

}

const ArrowBackIcon: React.FC<Props> = ({ ...props }) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.7">
      <path d="M9.57 5.92969L3.5 11.9997L9.57 18.0697" stroke="#111827" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.5 12H3.67" stroke="#111827" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export default ArrowBackIcon;
