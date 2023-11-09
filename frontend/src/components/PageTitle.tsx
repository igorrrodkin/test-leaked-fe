import React from 'react';
import styled from 'styled-components';

interface Props extends React.PropsWithChildren {
  fontSize?: number,
  marginBottom?: string,
  textAlign?: string
}

const PageTitle: React.FC<Props> = ({
  fontSize = 24,
  textAlign = 'left',
  marginBottom = '.25rem',
  children,
}) => (
  <H1
    fontSize={fontSize}
    marginBottom={marginBottom}
    textAlign={textAlign}
  >
    {children}
  </H1>
);

const H1 = styled.h1<{ fontSize: number, marginBottom: string, textAlign: string }>`
  margin-bottom: ${({ marginBottom }) => marginBottom};
  font-size: ${({ fontSize }) => fontSize}px;
  text-align: ${({ textAlign }) => textAlign};
  font-weight: 600;
`;

export default PageTitle;
