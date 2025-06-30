// themes/Theme.js
import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  body: '#f5f5f5',
  text: '#333',
};

export const darkTheme = {
  body: '#1a1a1a',
  text: '#fff',
};

export const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.body};
    color: ${(props) => props.theme.text};
    transition: background-color 0.3s ease;
  }
`;
