import React from 'react';
import styled from 'styled-components';

interface IUsersSection {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const UsersBlock: React.FC<IUsersSection> = ({ title, subtitle, children }) => (
  <Block>
    <Title>{title}</Title>
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
    {children}
  </Block>
);

const Block = styled.div``;

const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: #111827;
  margin-bottom: 12px;
`;
const Subtitle = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #6c7278;
  margin-bottom: 24px;
`;

export default UsersBlock;
