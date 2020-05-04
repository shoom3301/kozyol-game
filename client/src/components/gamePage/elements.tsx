import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Title } from 'ui-elements/form';

export const GamePageTitle = styled.h1`
  text-align: center;
  color: rgba(26,90,188,0.83);
`;

export const Container = styled.div`
  text-align: center;
`;

export const CardsList = styled.ul`
  text-align: center;
  margin: 0;
  padding: 0;
`;

export const CardSlot = styled.li`
  text-align: center;
  display: inline-block;
  border: 1px solid #000;
  padding: 10px;
  width: 120px;
  height: 150px;
  margin: 10px;
  background: #f3f3f3;
  overflow: hidden;
  position: relative;
`;

export const MyCardSlot = styled(CardSlot)`
  cursor: pointer;
  border-radius: 10px;
  background: #e4e4e4;

  :hover {
    background: rgba(26, 90, 188, 0.83);
  }
`;

export const CardItem = styled.img`
  width: 90px;
  position: absolute;
  left: 10px;
  top: 10px;
  
  :nth-child(2) {
    left: 20px;
    top: 20px;
  }
  
  :nth-child(3) {
    left: 30px;
    top: 30px;
  }
  
  :nth-child(4) {
    left: 40px;
    top: 40px;
  }
  
  :nth-child(5) {
    left: 50px;
    top: 50px;
  }
`;

export const ToMain = styled(Link)`
    display: inline-block;
    background-color: rgba(26, 90, 188, 0.83);
    color: #fff;
    padding: 5px 10px;
    font-size: 16px;
    text-decoration: none;
    border-radius: 3px;
    vertical-align: top;
    margin-top: 4px;
    margin-right: 10px;
`;

export const PlayersWaiting = styled(Title)`
    text-align: center;
    padding: 10px;
    border: 1px solid #444;
    margin-bottom: 15px;
`;
