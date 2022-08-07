import Bowman from './Characters/Bowman.js';
import Swordsman from './Characters/Swordsman.js';
import Magician from './Characters/Magician.js';
import Daemon from './Characters/Daemon.js';
import Undead from './Characters/Undead.js';
import Vampire from './Characters/Vampire.js';
import { generateTeam } from './generators.js';
import PositionedCharacter from './PositionedCharacter.js';
import Team from './Team.js';
import themes from './themes.js';
import cursors from './cursors.js';
import GameState from './GameState.js';
import GamePlay from './GamePlay.js';

const playerCharactersStartPositions = [
  0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
];
const computerCharactersStartPositions = [
  6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
];

const leftBoardSide = [0, 8, 16, 24, 32, 40, 48, 56];
const rightBoardSide = [7, 15, 23, 31, 39, 47, 55, 63];

const playerCharacters = [Bowman, Swordsman, Magician];
const computerCharacters = [Daemon, Undead, Vampire];

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = new Team();
    this.computerTeam = new Team();
    this.characters = [];
    this.counter = 0;
    this.indexChar = null;
    this.indexCursor = null;
    this.gameLevel = 1;
    this.points = 0;
    this.pointsHistory = [];
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    this.playerTeam.addAllChars(...generateTeam([Bowman, Swordsman], 1, 2));

    this.computerTeam.addAllChars(...generateTeam(computerCharacters, 1, 2));

    this.getTeamPositioned(this.playerTeam, playerCharactersStartPositions);

    this.getTeamPositioned(this.computerTeam, computerCharactersStartPositions);

    this.gamePlay.redrawPositions(this.characters);

    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));

    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  getRandomPosition(positions) {
    let position = positions[Math.floor(Math.random() * positions.length)];

    while (this.checkRandomPosition(position)) {
      position = positions[Math.floor(Math.random() * positions.length)];
    }
    return position;
  }

  checkRandomPosition(position) {
    return this.characters.some((character) => character.position === position);
  }

  getTeamPositioned(team, positions) {
    for (const member of team) {
      const position = this.getRandomPosition(positions);
      const memberPositioned = new PositionedCharacter(member, position);
      this.characters.push(memberPositioned);
    }
    return this.characters;
  }

  checkWin() {
    if (this.gameLevel === 4 && this.computerTeam.members.size === 0) {
      this.getPoints();
      this.pointsHistory.push(this.points);
      GamePlay.showMessage(
        `You won! Your result is ${
          this.points
        } points, your best result is ${Math.max(this.pointsHistory)} points.`
      );
      this.gameLevel += 1;
    }

    if (this.computerTeam.members.size === 0 && this.gameLevel <= 3) {
      this.gameLevel += 1;
      GamePlay.showMessage(`You reached the level ${this.gameLevel}.`);
      this.getPoints();
      this.getNextLevel();
    }

    if (this.playerTeam.members.size === 0) {
      this.pointsHistory.push(this.points);
      GamePlay.showMessage(
        `You lose! Your result is ${
          this.points
        } points, your best result is ${Math.max(this.pointsHistory)} points.`
      );
    }
  }

  getNextLevel() {
    this.characters = [];
    this.playerTeam.members.forEach((character) => character.levelUp());

    if (this.gameLevel === 2) {
      // console.log(this.playerTeam.members.size);
      this.gamePlay.drawUi(themes.desert);
      this.playerTeam.addAllChars(...generateTeam(playerCharacters, 1, 1));
      this.computerTeam.addAllChars(
        ...generateTeam(computerCharacters, 2, this.playerTeam.members.size)
      );
    }

    if (this.gameLevel === 3) {
      this.gamePlay.drawUi(themes.arctic);
      this.playerTeam.addAllChars(...generateTeam(playerCharacters, 2, 2));
      this.computerTeam.addAllChars(
        ...generateTeam(computerCharacters, 3, this.playerTeam.members.size)
      );
    }

    if (this.gameLevel === 4) {
      this.gamePlay.drawUi(themes.mountain);
      this.playerTeam.addAllChars(...generateTeam(playerCharacters, 3, 2));
      this.computerTeam.addAllChars(
        ...generateTeam(computerCharacters, 4, this.playerTeam.members.size)
      );
    }

    this.getTeamPositioned(this.playerTeam, playerCharactersStartPositions);
    this.getTeamPositioned(this.computerTeam, computerCharactersStartPositions);
    this.gamePlay.redrawPositions(this.characters);
  }

  getPoints() {
    this.points += this.playerTeam
      .toArray()
      .reduce((sum, current) => sum + current.health, 0);
  }

  getChar(index) {
    return this.characters.find((character) => character.position === index);
  }

  getMove(indexChar, distance) {
    const { boardSize } = this.gamePlay;

    const allowedPositions = [];

    for (let i = 1; i <= distance; i += 1) {
      allowedPositions.push(indexChar + boardSize * i);
      allowedPositions.push(indexChar - boardSize * i);
    }

    for (let i = 1; i <= distance; i += 1) {
      if (leftBoardSide.includes(indexChar)) {
        break;
      }

      allowedPositions.push(indexChar - i);
      allowedPositions.push(indexChar - (boardSize * i + i));
      allowedPositions.push(indexChar + (boardSize * i - i));

      if (leftBoardSide.includes(indexChar - i)) {
        break;
      }
    }

    for (let i = 1; i <= distance; i += 1) {
      if (rightBoardSide.includes(indexChar)) {
        break;
      }

      allowedPositions.push(indexChar + i);
      allowedPositions.push(indexChar - (boardSize * i - i));
      allowedPositions.push(indexChar + (boardSize * i + i));

      if (rightBoardSide.includes(indexChar + i)) {
        break;
      }
    }

    return allowedPositions.filter(
      (position) => position >= 0 && position <= 63
    );
  }

  checkMove(indexChar, index, char) {
    const { distance } = char.character;
    return this.getMove(indexChar, distance).includes(index);
  }

  getAttack(indexChar, attackRange) {
    const { boardSize } = this.gamePlay;

    const allowedPositions = [];

    for (let i = 1; i <= attackRange; i += 1) {
      allowedPositions.push(indexChar + boardSize * i);
      allowedPositions.push(indexChar - boardSize * i);
    }

    for (let i = 1; i <= attackRange; i += 1) {
      if (leftBoardSide.includes(indexChar)) {
        break;
      }

      allowedPositions.push(indexChar - i);
      for (let j = 1; j <= attackRange; j += 1) {
        allowedPositions.push(indexChar - i + boardSize * j);
        allowedPositions.push(indexChar - i - boardSize * j);
      }

      if (leftBoardSide.includes(indexChar - i)) {
        break;
      }
    }

    for (let i = 1; i <= attackRange; i += 1) {
      if (rightBoardSide.includes(indexChar)) {
        break;
      }

      allowedPositions.push(indexChar + i);
      for (let j = 1; j <= attackRange; j += 1) {
        allowedPositions.push(indexChar + i + boardSize * j);
        allowedPositions.push(indexChar + i - boardSize * j);
      }

      if (rightBoardSide.includes(indexChar + i)) {
        break;
      }
    }

    return allowedPositions.filter(
      (position) => position >= 0 && position <= 63
    );
  }

  checkAttack(indexChar, index, char) {
    const { attackRange } = char.character;
    return this.getAttack(indexChar, attackRange).includes(index);
  }

  setAttack(index) {
    const attacker = this.getChar(this.indexChar).character;
    const target = this.getChar(index).character;
    const damage = Math.max(
      attacker.attack - target.defence,
      attacker.attack * 0.1
    );

    this.gamePlay
      .showDamage(index, damage)
      .then(() => {
        target.health -= damage;
        if (target.health <= 0) {
          this.characters.splice(
            this.characters.indexOf(this.getChar(index)),
            1
          );
          this.playerTeam.removeChar(target);
          this.computerTeam.removeChar(target);
        }
      })
      .then(() => {
        this.gamePlay.redrawPositions(this.characters);
        this.checkWin();
        this.computerToMove();
      })
      .catch((error) => {
        GamePlay.showError(error);
      });
  }

  computerToMove() {
    if (this.counter !== 1 || this.computerTeam.members.size === 0) {
      return;
    }

    const computerTeam = this.characters.filter(
      (member) =>
        member.character instanceof Vampire ||
        member.character instanceof Daemon ||
        member.character instanceof Undead
    );

    const playerTeam = this.characters.filter(
      (member) =>
        member.character instanceof Bowman ||
        member.character instanceof Swordsman ||
        member.character instanceof Magician
    );

    let computer = null;
    let target = null;

    computerTeam.forEach((computerMember) => {
      const computerAttack = this.getAttack(
        computerMember.position,
        computerMember.character.attackRange
      );

      playerTeam.forEach((playerMember) => {
        if (computerAttack.includes(playerMember.position)) {
          computer = computerMember;
          target = playerMember;
        }
      });
    });

    if (target) {
      const damage = Math.max(
        computer.character.attack - target.character.defence,
        computer.character.attack * 0.1
      );
      this.gamePlay
        .showDamage(target.position, damage)
        .then(() => {
          target.character.health -= damage;
          if (target.character.health <= 0) {
            this.characters.splice(
              this.characters.indexOf(this.getChar(target.position)),
              1
            );
            this.playerTeam.removeChar(target.character);
            this.computerTeam.removeChar(target.character);
          }
        })
        .then(() => {
          this.gamePlay.redrawPositions(this.characters);
          this.checkWin();
        })
        .catch((error) => {
          GamePlay.showError(error);
        });
    } else {
      computer = computerTeam[Math.floor(Math.random() * computerTeam.length)];
      const computerMove = this.getMove(
        computer.position,
        computer.character.distance
      );
      this.getChar(computer.position).position =
        this.getRandomPosition(computerMove);
      this.gamePlay.redrawPositions(this.characters);
    }

    this.counter = 0;
  }

  onNewGameClick() {
    this.playerTeam = new Team();
    this.computerTeam = new Team();
    this.characters = [];
    this.counter = 0;
    this.indexChar = null;
    this.indexCursor = null;
    this.gameLevel = 1;
    this.points = 0;

    this.gamePlay.drawUi(themes.prairie);

    this.playerTeam.addAllChars(...generateTeam([Bowman, Swordsman], 1, 2));
    this.computerTeam.addAllChars(...generateTeam(computerCharacters, 1, 2));
    this.getTeamPositioned(this.playerTeam, playerCharactersStartPositions);
    this.getTeamPositioned(this.computerTeam, computerCharactersStartPositions);

    this.gamePlay.redrawPositions(this.characters);
  }

  onSaveGameClick() {
    const savedGame = {
      team: this.characters,
      gameLevel: this.gameLevel,
      counter: this.counter,
      points: this.points,
      pointsHistory: this.pointsHistory,
    };
    this.stateService.save(GameState.from(savedGame));
    GamePlay.showMessage('Game saved...');
  }

  onLoadGameClick() {
    GamePlay.showMessage('Loading...');
    const load = this.stateService.load();
    this.gameLevel = load.gameLevel;
    this.counter = load.counter;
    this.points = load.points;
    this.pointsHistory = load.pointsHistory;

    this.playerTeam = new Team();
    this.computerTeam = new Team();

    this.characters = load.team.map((item) => {
      let char;
      const {
        character: { level, type, health, attack, defence },
        position,
      } = item;
      switch (type) {
        case 'bowman':
          char = new Bowman(level);
          break;
        case 'swordsman':
          char = new Swordsman(level);
          break;
        case 'magician':
          char = new Magician(level);
          break;
        case 'vampire':
          char = new Vampire(level);
          break;
        case 'undead':
          char = new Undead(level);
          break;
        default:
          char = new Daemon(level);
      }

      char.health = health;
      char.attack = attack;
      char.defence = defence;

      if (type === 'bowman' || type === 'swordsman' || type === 'magician') {
        this.playerTeam.addChar(char);
      } else {
        this.computerTeam.addChar(char);
      }

      return new PositionedCharacter(char, position);
    });

    switch (this.gameLevel) {
      case 1:
        this.gamePlay.drawUi(themes.prairie);
        break;
      case 2:
        this.gamePlay.drawUi(themes.desert);
        break;
      case 3:
        this.gamePlay.drawUi(themes.arctic);
        break;
      default:
        this.gamePlay.drawUi(themes.mountain);
        break;
    }

    this.gamePlay.redrawPositions(this.characters);
  }

  onCellClick(index) {
    if (this.gameLevel === 5 || this.playerTeam.members.size === 0) {
      return;
    }

    if (this.counter === 1) {
      GamePlay.showMessage(`It's not your move`);
      return;
    }

    if (this.getChar(index)) {
      if (
        playerCharacters.some(
          (character) => this.getChar(index).character instanceof character
        )
      ) {
        if (this.indexChar === null) {
          this.indexChar = index;
        } else {
          this.gamePlay.deselectCell(this.indexChar);
          this.gamePlay.deselectCell(this.indexCursor);
        }
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index);
        this.indexChar = index;
      } else if (this.indexChar === null) {
        GamePlay.showError(`It's not you Character`);
      }
    }

    if (this.indexChar !== null) {
      if (
        this.checkMove(this.indexChar, index, this.getChar(this.indexChar)) &&
        !this.getChar(index)
      ) {
        this.getChar(this.indexChar).position = index;
        this.gamePlay.deselectCell(this.indexChar);
        this.gamePlay.deselectCell(this.indexCursor);
        this.indexChar = null;
        this.counter = 1;
        this.gamePlay.redrawPositions(this.characters);
        this.computerToMove();
      }

      if (
        this.getChar(index) &&
        computerCharacters.some(
          (character) => this.getChar(index).character instanceof character
        ) &&
        this.checkAttack(this.indexChar, index, this.getChar(this.indexChar))
      ) {
        this.setAttack(index);
        this.gamePlay.deselectCell(this.indexChar);
        this.gamePlay.deselectCell(this.indexCursor);
        this.indexChar = null;
        this.counter = 1;
        this.gamePlay.setCursor(cursors.auto);
      }

      if (
        this.indexChar !== index &&
        this.gamePlay.boardEl.style.cursor === 'not-allowed'
      ) {
        GamePlay.showMessage(`Your action is not allowed!`);
      }
    }
  }

  onCellEnter(index) {
    if (this.getChar(index)) {
      const char = this.getChar(index).character;
      const message = `\u{1F396}${char.level}\u{2694}${char.attack}\u{1F6E1}${char.defence}\u{2764}${char.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }
    if (this.indexChar !== null) {
      this.gamePlay.setCursor(cursors.notallowed);
      if (this.indexCursor === null) {
        this.indexCursor = index;
      } else if (this.indexChar !== this.indexCursor) {
        this.gamePlay.deselectCell(this.indexCursor);
      }

      if (
        this.getChar(index) &&
        playerCharacters.some(
          (character) => this.getChar(index).character instanceof character
        )
      ) {
        this.gamePlay.setCursor(cursors.pointer);
      }

      if (this.indexChar !== index) {
        if (
          !this.getChar(index) &&
          this.checkMove(this.indexChar, index, this.getChar(this.indexChar))
        ) {
          this.gamePlay.selectCell(index);
          this.gamePlay.setCursor(cursors.pointer);
          this.indexCursor = index;
        }

        if (
          this.getChar(index) &&
          computerCharacters.some(
            (character) => this.getChar(index).character instanceof character
          ) &&
          this.checkAttack(this.indexChar, index, this.getChar(this.indexChar))
        ) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
          this.indexCursor = index;
        }
      }
    } else {
      this.gamePlay.setCursor(cursors.auto);
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }
}
