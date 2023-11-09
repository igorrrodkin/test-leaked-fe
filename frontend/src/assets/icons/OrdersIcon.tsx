import React from 'react';

const OrdersIcon: React.FC<{ color?: string }> = ({ color = '#6C7278' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.2526 10.725L15.9526 14.475C15.8401 15.6225 15.7501 16.5 13.7176 16.5H4.28257C2.25007 16.5 2.16007 15.6225 2.04757 14.475L1.74757 10.725C1.68757 10.1025 1.88257 9.525 2.23507 9.0825C2.24257 9.075 2.24257 9.075 2.25007 9.0675C2.66257 8.565 3.28507 8.25 3.98257 8.25H14.0176C14.7151 8.25 15.3301 8.565 15.7351 9.0525C15.7426 9.06 15.7501 9.0675 15.7501 9.075C16.1176 9.5175 16.3201 10.095 16.2526 10.725Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path
      d="M2.625 8.57252V4.71002C2.625 2.16002 3.2625 1.52252 5.8125 1.52252H6.765C7.7175 1.52252 7.935 1.80752 8.295 2.28752L9.2475 3.56252C9.4875 3.87752 9.63 4.07252 10.2675 4.07252H12.18C14.73 4.07252 15.3675 4.71002 15.3675 7.26002V8.60252"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.07251 12.75H10.9275"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default OrdersIcon;
