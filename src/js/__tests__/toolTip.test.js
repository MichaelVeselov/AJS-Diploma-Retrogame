import Swordsman from '../Characters/Swordsman.js';

test('check tooltip', () => {
  const swordsman = new Swordsman(2, 'swordsman');
  const tooltip = `\u{1F396}${swordsman.level}\u{2694}${swordsman.attack}\u{1F6E1}${swordsman.defence}\u{2764}${swordsman.health}`;
  const expected = '\u{1F396}2\u{2694}40\u{1F6E1}10\u{2764}50';
  expect(tooltip).toEqual(expected);
});
