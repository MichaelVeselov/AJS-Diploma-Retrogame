import Character from '../Character.js';
import Swordsman from '../Characters/Swordsman.js';

test('should return error when trying to create direct a new instance of class Character', () => {
  expect(() => new Character(2, 'Swordsman')).toThrowError();
});

test('should not return error when trying to create a new instance of class Swordsman', () => {
  expect(() => new Swordsman(2, 'Swordsman')).not.toThrowError();
});
