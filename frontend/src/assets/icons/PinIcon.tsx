import React from 'react';

interface Props {
  width?: number,
  height?: number,
  color?: string,
  stroke?: string,
}

const PinIcon: React.FC<Props> = ({
  width = 14,
  height = 14,
  color = 'white',
  stroke = '#fff',
}) => (
  <svg width={width} height={height} viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5064 5.32487L13.125 4.70625L8.75 0.375L8.17513 0.994062L8.694 1.51294L3.66625 5.76587L2.9155 5.01556L2.29688 5.625L4.77181 8.10869L0.875 12.0051L1.49188 12.625L5.39044 8.72731L7.875 11.2022L8.48444 10.5836L7.73369 9.83288L11.9879 4.806L12.5064 5.32487Z" fill={color} stroke={stroke} />
  </svg>
);

export default PinIcon;
