/* eslint-disable no-restricted-syntax */
export default class Team {
  constructor() {
    this.members = new Set();
  }

  addChar(char) {
    if (this.members.has(char)) {
      throw new Error('Such a character is just a member of the team...');
    } else {
      this.members.add(char);
    }
  }

  addAllChars(...chars) {
    chars.forEach((char) => {
      this.members.add(char);
    });
  }

  removeChar(char) {
    this.members.delete(char);
  }

  toArray() {
    return Array.from(this.members);
  }

  *[Symbol.iterator]() {
    for (const char of this.members) {
      yield char;
    }
  }
}
