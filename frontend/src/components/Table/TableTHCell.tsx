import React, {
  FC,
  PropsWithChildren,
  useEffect,
} from 'react';
import styled, { css } from 'styled-components';

import CellPopup from '@/components/Table/CellPopup';

import useOnClickOutside from '@/hooks/useOnClickOutside';
import useToggle from '@/hooks/useToggle';

interface Props extends PropsWithChildren {
  isOpenToTop: boolean,
}

const TableThCell: FC<Props> = ({ isOpenToTop, children }) => {
  const [isEllipsisApplied, toggleIsEllipsisApplied] = useToggle();
  const [ref, isPopupVisible, toggleIsPopupVisible] = useOnClickOutside<HTMLDivElement>();

  useEffect(() => {
    if (ref.current && !isEllipsisApplied) {
      toggleIsEllipsisApplied(ref.current.offsetWidth < ref.current.scrollWidth);
    }
  }, [children, ref]);

  return (
    <Cell
      applyEllipsis={isEllipsisApplied}
      onClick={toggleIsPopupVisible}
    >
      <Text ref={ref} title={children as string}>
        {children}
      </Text>
      {isEllipsisApplied && isPopupVisible && (
        <CellPopup isOpenToTop={isOpenToTop}>
          {children}
        </CellPopup>
      )}
    </Cell>
  );
};

const Text = styled.div``;

const Cell = styled.th<{ applyEllipsis: boolean }>`
  position: relative;
  max-width: none;
  
  ${({ applyEllipsis }) => applyEllipsis && css`
    ${Text} {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `}}
`;

export default TableThCell;
