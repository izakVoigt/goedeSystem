import styled from "styled-components";

export const Container = styled.form`
  width: 600px;
  min-height: 500px;
  margin: auto;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  border: 2px solid #428961;
  background-color: #505050;
  box-shadow: inset 0 0 40px #292929;
`;

export const ErrorArea = styled.span`
  color: red;
`;

export const Title = styled.h1`
  margin: 30px 0 60px 0;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
`;

export const Input = styled.input`
  width: 90%;
  height: 30px;
  margin: 10px;
  padding: 5px;
  border: 1px solid #489b6c;
  border-radius: 10px;
  background-color: #464646;
  outline: none;
`;

export const Button = styled.button`
  margin: 30px 0;
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid #489b6c;
  background-color: transparent;
  text-decoration: none;
  transition: all ease-in-out 0.1s;

  &:hover {
    cursor: pointer;
    background-color: #489b6c;
    color: #fff;
  }
`;

export const Loading = styled.div`
  margin: 20px 0;
  padding: 10px 30px;
`;

export const LoadingAnimation = styled.div`
  width: 39px;
  height: 39px;
  border-radius: 50%;
  border: 4px solid #464646;
  border-top-color: #489b6c;
  animation: rotating 1s infinite;

  @keyframes rotating {
    to {
      transform: rotate(1turn);
    }
  }
`;
