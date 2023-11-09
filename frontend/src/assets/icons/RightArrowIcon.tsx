import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLOrSVGElement> {

}

const RightArrowIcon: React.FC<Props> = ({ ...props }) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.94 13.2797L10.2867 8.93306C10.8 8.41973 10.8 7.57973 10.2867 7.06639L5.94 2.71973" stroke="#ACB5BB" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default RightArrowIcon;
