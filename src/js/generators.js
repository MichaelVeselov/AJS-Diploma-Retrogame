/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const rnd = Math.floor(Math.random() * allowedTypes.length);
    yield new allowedTypes[rnd](Math.floor(Math.random() * maxLevel) + 1);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];
  const character = characterGenerator(allowedTypes, maxLevel);

  for (let i = 0; i < characterCount; i++) {
    team.push(character.next(i).value);
  }

  return team;
}
