import GameStateService from '../GameStateService.js';
import GamePlay from '../GamePlay.js';

jest.mock('../GamePlay');

beforeEach(() => {
  jest.resetAllMocks();
});

test('should return error when trying to load a null state', () => {
  const gameStateService = new GameStateService(null);
  expect(gameStateService.load).toThrowError();
});

test('mock should have been calles one time', () => {
  const gameStateService = new GameStateService(null);
  const mock = jest.fn(() => GamePlay.showError('Invalid state'));

  try {
    gameStateService.load();
  } catch (error) {
    mock();
  }

  expect(mock).toBeCalledTimes(1);
});
