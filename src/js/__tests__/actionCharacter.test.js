import Swordsman from '../Characters/Swordsman.js';
import GameController from '../GameController.js';
import GamePlay from '../GamePlay.js';
import PositionedCharacter from '../PositionedCharacter.js';

describe('should test diverse actions for the character Swordsman', () => {
  const swordsman = new PositionedCharacter(new Swordsman(1, 'swordsman'), 27);
  const gameController = new GameController(new GamePlay());

  test('test a diagonal move', () => {
    const received = gameController.checkMove(27, 20, swordsman);
    expect(received).toBeTruthy();
  });

  test('test a vertical move', () => {
    const received = gameController.checkMove(27, 51, swordsman);
    expect(received).toBeTruthy();
  });

  test('test a horizonatl move', () => {
    const received = gameController.checkMove(27, 25, swordsman);
    expect(received).toBeTruthy();
  });

  test('test an impossible move', () => {
    const received = gameController.checkMove(27, 33, swordsman);
    expect(received).toBeFalsy();
  });

  test('test a diagonal attack', () => {
    const received = gameController.checkAttack(27, 18, swordsman);
    expect(received).toBeTruthy();
  });

  test('test a vertical attack', () => {
    const received = gameController.checkAttack(27, 35, swordsman);
    expect(received).toBeTruthy();
  });

  test('test a horizontal attack', () => {
    const received = gameController.checkAttack(27, 28, swordsman);
    expect(received).toBeTruthy();
  });

  test('test an impossible attack', () => {
    const received = gameController.checkAttack(27, 37, swordsman);
    expect(received).toBeFalsy();
  });
});
