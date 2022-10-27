import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        color: #f0f0f0;

        @media (min-width: 1900px) {
            font-size: 16px;
        }
    }
    main {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        background-color: #505050;
    }

    ::-webkit-scrollbar {
        width: 12px;
    }
    ::-webkit-scrollbar-track {
        background-color: #505050;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: #f0f0f0;
    }
    ::-webkit-scrollbar-thumb:hover {
        background-color: #c8c8c8;
    }
`;

export default GlobalStyles;
