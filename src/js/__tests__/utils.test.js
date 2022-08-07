import { calcTileType } from '../utils.js';

describe('function calcTileType should return', () => {
  test('top-left', () => {
    expect(calcTileType(0, 8)).toBe('top-left');
  });
  test('top', () => {
    expect(calcTileType(4, 8)).toBe('top');
  });
  test('top-right', () => {
    expect(calcTileType(7, 8)).toBe('top-right');
  });
  test('left', () => {
    expect(calcTileType(16, 8)).toBe('left');
  });
  test('center', () => {
    expect(calcTileType(20, 8)).toBe('center');
  });
  test('right', () => {
    expect(calcTileType(23, 8)).toBe('right');
  });
  test('bottom-left', () => {
    expect(calcTileType(56, 8)).toBe('bottom-left');
  });
  test('bottom', () => {
    expect(calcTileType(60, 8)).toBe('bottom');
  });
  test('bottom-right', () => {
    expect(calcTileType(63, 8)).toBe('bottom-right');
  });
});
