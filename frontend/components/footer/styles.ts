import styled from "styled-components";

export const Container = styled.footer`
  width: 100%;
`;

export const FooterArea = styled.div`
  width: 100%;
  padding: 20px 10px;
  display: flex;
  align-items: flex-start;
  justify-content: space-evenly;
  background-color: #464646;
`;

export const ItemArea = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 900px) {
    text-align: center;
  }
`;

export const Menu = styled.ul`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  list-style: none;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const MenuItem = styled.li`
  margin: 3px 0;

  a {
    text-decoration: none;
  }
`;

export const MenuTitle = styled.h3`
  width: 100%;
  margin: 10px 0 20px 0;
  text-align: center;
  color: #489b6c;
`;

export const SocialMidiaArea = styled.div`
  width: 100%;
  padding: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #353535;

  a {
    margin: 0 8px;
  }
  a svg {
    width: 35px;
    height: 35px;
  }
`;
