const customScrollCss = `@media (hover: hover) {
  &::-webkit-scrollbar-thumb {
    background-color: #e5e5e5;
    border-radius: 4px;
  }

  scrollbar-color: #e5e5e5;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    transition: all 0.3s ease-in;
    width: 3px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    -webkit-box-shadow: inset 0 0 0 transparent;
    margin: 3px 0;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0);
    border-radius: 5px;
    outline: 2px solid transparent;
    height: 20%;
    width: 20%;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: #e5e5e5;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.35);
  }
}
`;

export default customScrollCss;
