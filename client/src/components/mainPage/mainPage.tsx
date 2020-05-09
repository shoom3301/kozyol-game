import React, { Component } from 'react'
import { GamesList } from 'components/gamesList/gamesList'
import { GameCreation } from 'components/gameCreation/gameCreation'
import styled from 'styled-components'

export class MainPage extends Component<any, any> {
  render(): React.ReactElement {
    return (
      <div>
        <MainPageTitle>KOZYOL GAME</MainPageTitle>
        <MainPageContainer>
          <GamesList/>
          <GameCreation/>
        </MainPageContainer>
      </div>
    )
  }
}

const MainPageContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 0 5%;
`

const MainPageTitle = styled.h1`
  text-align: center;
  color: rgba(26,90,188,0.83);
`
