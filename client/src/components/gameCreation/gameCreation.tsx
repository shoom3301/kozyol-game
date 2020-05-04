import React, { ChangeEvent, Component } from 'react';
import { Button } from 'ui-elements/button';
import { Box, FormContainer, Label, Title } from 'ui-elements/form';
import { Select } from 'ui-elements/select';
import { gamesService } from 'services/games.service';

interface GameCreationState {
  slotsCount: number;
  formDisabled: boolean;
}

export class GameCreation extends Component<any, GameCreationState> {
  state: GameCreationState = { slotsCount: 2, formDisabled: false };

  createGame = () => {
    gamesService.createGame(this.state.slotsCount)
      .catch(alert)
      .then(() => {
        gamesService.updateList()
      })
  }

  onSlotsCountChange = (event: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ ...this.state, ...{ slotsCount: parseInt(event.target.value) } })
  }

  render(): React.ReactElement {
    return (
      <FormContainer>
        <Box>
          <Title>Создать игру</Title>
        </Box>
        <Box>
          <Label>Кол-во игроков:</Label>
          <Select name="slotsCount"
                  value={this.state.slotsCount}
                  onChange={this.onSlotsCountChange}>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </Select>
        </Box>

        <Box align="center">
          <Button onClick={this.createGame}>Создать</Button>
        </Box>
      </FormContainer>
    )
  }
}
