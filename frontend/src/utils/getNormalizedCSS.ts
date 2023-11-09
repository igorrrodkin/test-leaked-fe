import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

import InterBold from '@/assets/fonts/Inter-Bold.ttf';
import InterMedium from '@/assets/fonts/Inter-Medium.ttf';
import InterRegular from '@/assets/fonts/Inter-Regular.ttf';
import InterSemiBold from '@/assets/fonts/Inter-SemiBold.ttf';

const GlobalStyle = createGlobalStyle`
  ${normalize};

  @font-face {
    font-family: 'Inter';
    src: url(${InterRegular}) format('truetype');
    font-weight: 400;
  }

  @font-face {
    font-family: 'Inter';
    src: url(${InterMedium}) format('truetype');
    font-weight: 500;
  }

  @font-face {
    font-family: 'Inter';
    src: url(${InterSemiBold}) format('truetype');
    font-weight: 600;
  }

  @font-face {
    font-family: 'Inter';
    src: url(${InterBold}) format('truetype');
    font-weight: 700;
  }

  * {
    --sidebar-width: 256px;
    --search-height: 82px;
    --primary-dark-color: #1A1C1E;
    --primary-dark-hover-color: rgba(26, 28, 30, 0.8);
    --primary-green-color: #27A376;
    --primary-green-hover-color: #52b591;
    --primary-green-background-color: rgba(39, 163, 118, 0.1);
    --primary-yellow-color: #FFF099;
    --primary-yellow-border-color: #FFCC00;
    --primary-yellow-dark-color: #B78B00;
    --primary-yellow-background-color: #FFFBDB;
    --primary-red-color: #DD5757;
    --primary-red-hover-color: rgba(221, 87, 87, 0.8);
    --primary-red-background-color: #F2E7E7;
    --primary-warning-color: #DBAA00;
    --primary-warning-background-color: #FBF4E4;

    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
    color: var(--primary-dark-color);

    ::after, ::before {
      box-sizing: border-box;
    }

    :focus {
      outline: none;
    }
  }

  body {
    margin: 0;
    max-height: 100vh;
    height: 100%;
    font-size: 16px;
    background-color: #F1EFE9;
  }

  img {
    width: 100%;
    height: auto;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  svg, input, label, a {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  p, span, h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  button {
    cursor: pointer;
  }

  a {
    text-decoration: none;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .text-overflow {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default GlobalStyle;
