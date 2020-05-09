import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'
import { Title } from 'ui-elements/form'

const cardWidth = 64
const cardHeight = 89
const cardOffset = 8

export const GamePageTitle = styled.h1`
  text-align: center;
  font-size: 24px;
  color: rgba(26,90,188,0.83);
`

export const Container = styled.div`
  text-align: center;
`

export const CardsList = styled.ul`
  text-align: center;
  margin: 10px 0;
  padding: 0;
  height: 130px;
  white-space: nowrap;
`

export const CardSlot = styled.li<{ cardsCount?: number }>`
  display: inline-block;
  white-space: nowrap;
  width: ${({ cardsCount = 0 }) => cardWidth + (cardOffset * (cardsCount - 1))}px;
  height: ${({ cardsCount = 0 }) => cardHeight + (cardOffset * (cardsCount - 1))}px;
  overflow: hidden;
  vertical-align: top;
  margin: 0 10px;
  
  :first-child {
    margin-left: 0;
  }
  
  :last-child {
    margin-right: 0;
  }

  @media (max-width: 600px) {
    margin: 0 3px;
  }
`

export const MyCardSlot = styled.li<{ selected?: boolean }>`
  cursor: pointer;
  display: inline-block;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #c7c7c7;

  ${({ selected }) => selected && css`
    background: rgba(72,132,217,0.83);
    
    :hover {
      background: rgba(26, 90, 188, 0.83)!important;
    }
  `}

  :hover {
    background: rgba(177,206,252,0.83);
  }
`

export const CardItem = styled.img`
  width: ${cardWidth}px;
  height: ${cardHeight}px;
  margin-left: 0;
`

export const CardItemOnTable = styled(CardItem)`
  :nth-child(2) {
    transform: translate(-${(cardWidth - cardOffset)}px, ${cardOffset}px);
  }
  
  :nth-child(3) {
    transform: translate(-${(cardWidth - cardOffset) * 2}px, ${cardOffset * 2}px);
  }
  
  :nth-child(4) {
    transform: translate(-${(cardWidth - cardOffset) * 3}px, ${cardOffset * 3}px);
  }
  
  :nth-child(5) {
    transform: translate(-${(cardWidth - cardOffset) * 4}px, ${cardOffset * 4}px);
  }
`

export const ToMain = styled(Link)`
    display: inline-block;
    background-color: rgba(26, 90, 188, 0.83);
    color: #fff;
    padding: 5px 10px;
    font-size: 16px;
    text-decoration: none;
    border-radius: 3px;
    vertical-align: top;
    margin-right: 10px;
`

export const PlayersWaiting = styled(Title)`
    text-align: center;
    padding: 10px;
    border: 1px solid #444;
    margin-bottom: 15px;
`
