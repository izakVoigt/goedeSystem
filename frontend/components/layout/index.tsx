import styled from "styled-components";

const Container = styled.section`
  margin: 120px 10px 60px 10px;
`;

const Layout = ({ children }) => {
  return <Container>{children}</Container>;
};

export default Layout;
