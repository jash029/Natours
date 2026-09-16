import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after{
    margin:0;
    padding:0;
    box-sizing:border-box;
  }

  html{
    font-size:62.5%;
    scroll-behavior:smooth;
    height:100%;
  }

  body{
    height:100%;
    font-family:"Poppins",sans-serif;
    font-size:1.6rem;
    line-height:1.5;
    background-color: rgb(255, 255, 255);
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;

    overflow-x:hidden;
  }

  #root{
    height:100%;
  }
`;

export default GlobalStyle;
