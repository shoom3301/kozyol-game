- Авторизация/регистрация passport.js
- Создание игры
- Список игр
- Вход в игру
- Старт игры (когда все слоты заполнены)
- Ход игрока (правила очередности)
- Текущий ход (1-4 карты) (по кол-ву игроков)
- Завершение хода (персчет очков)
- Раздача карт хода
- Завершение тура (подсчет очков, подытог)
- Завершение игры (подсчет очков, подытог)

Сущности:
- Ход
- Круг
- Тур
- Игра

User:
```
{
	id: String,
	name: String,
	hash: String
}
```

Game (GET by id):
```
{
	id: String,
	state: GameState,
	trump: String,
	currentPlayerId: String,
	stepEndTime: TimeStamp,
	myScore: Number,
	roundScore: {
	  [playerId: String]: Number
	}[],
	cardsOnTable: {
	  playerId: String,
	  cards: {
      type: String,
      value: String
    }[] || null // null - если не побил
	},
	players: {
	  id: String,
	  name: String,
	  order: Number
	}[],
	myCards: {
	  type: String,
	  value: String
	}[]
}
```

GameState:
```
{
	WAIT_PLAYERS,
	PLAY,
	ENDED
}
```

GameStep (POST):
```
{
  gameId: String,
  cards: {
    type: String,
    value: String
  }[]
}
```

Games List (GET):
```
{
  id: String,
  slotsCount: Number,
  playersCount: Number
}
```

Connect (POST by gameId): Game
