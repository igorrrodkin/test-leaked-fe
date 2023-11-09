import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: any;
  price: string;
  align?: 'flex-start' | 'flex-end';
  alignSelf?: 'flex-start' | 'flex-end' | 'auto';
  isMovedToTheLeft?: boolean;
  marginTop?: string;
}

const ServiceButton: React.FC<Props> = ({
  text,
  price,
  align = 'flex-end',
  alignSelf = 'flex-start',
  isMovedToTheLeft = false,
  marginTop = '0',
  ...props
}) => (
  <ButtonWrapper
    style={{
      marginLeft: isMovedToTheLeft ? '-4px' : '0',
      justifyContent: align,
      marginTop,
      alignSelf,
    }}
  >
    <Button
      style={
          isMovedToTheLeft
            ? { borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }
            : {}
        }
      {...props}
    >
      {text}
    </Button>
    {price === 'Free' ? null : (
      <Price>{`${`$${(+price / 100).toFixed(2)}`}`}</Price>
    )}
  </ButtonWrapper>
);

const ButtonWrapper = styled.div<{ align?: string }>`
  display: flex;
  grid-gap: 16px;
  justify-content: ${({ align }) => (align || 'flex-end')};
  align-items: center;
  align-self: flex-end;
  z-index: 5;
`;

const Button = styled.button`
  padding: 8px 12px;
  min-width: 73px;
  height: 38px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background-color: var(--primary-green-color);
  transition: 0.1s ease-in-out;

  :hover {
    background-color: var(--primary-green-hover-color);
  }
`;

const Price = styled.span`
  padding: 0.4rem 0.65rem;
  border: 1px solid rgba(39, 163, 118, 0.2);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-green-color);
  background-color: var(--primary-green-background-color);
`;

export default ServiceButton;
