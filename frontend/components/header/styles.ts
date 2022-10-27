import styled from "styled-components";
import { MenuProps } from "./types";

export const Container = styled.header`
  width: 100%;
  height: 60px;
  padding: 0 12px;
  position: fixed;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #3c3c3c;

  svg {
    width: 40px;
    height: 40px;
    display: none;
  }
  svg:hover {
    cursor: pointer;
  }
  @media (max-width: 900px) {
    svg {
      display: block;
    }
  }
`;

export const Menu = styled.ul<MenuProps>`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  list-style: none;

  @media (max-width: 900px) {
    height: calc(100vh - 60px);
    width: 300px;
    display: ${(props) => (!props.activeMenu ? "none" : "flex")};
    position: absolute;
    right: 0;
    top: 60px;
    flex-direction: column;
    background-color: #3c3c3c;
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const MenuItem = styled.li`
  height: 100%;
  margin: 0 5px;
  border-bottom: 3px solid transparent;
  transition: all ease-in-out 0.1s;

  &:hover {
    border-bottom: 3px solid #428961;
    box-shadow: inset 0 0 40px #292929;
  }
  a {
    width: 100%;
    height: 100%;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }
  @media (max-width: 900px) {
    width: 100%;
    padding: 0;
    border-bottom: 2px solid transparent;
    border-top: 2px solid #323232;

    &:hover {
      border-bottom: 2px solid #428961;
      border-top: 2px solid #428961;
      box-shadow: inset 0 0 40px #292929;
    }
  }
`;
