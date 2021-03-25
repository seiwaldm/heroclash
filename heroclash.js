// Copyright (C) 2020  Markus Seiwald, GPLv3

class Heroclash {
  players = [];
  heap = [];

  constructor() {
    this.players.push(new Player("Player 1"));
    this.players.push(new Player("Player 2"));
  }

  //load data from json-file and save to localStorage
  async loadData() {
    //fetch hero data:
    let response = await fetch("herostats.json");
    const herodata = await response.json();

    // fetch image-urls:
    response = await fetch("heroimages.json");
    const images = await response.json();

    response = await fetch("heroes.json");
    const heroes = await response.json();

    //save to localStorage
    localStorage.setItem("allHeroes", JSON.stringify(herodata));
    localStorage.setItem("allImages", JSON.stringify(images));
    localStorage.setItem("heroes", JSON.stringify(heroes));
    // location.reload();
  }

  //start the game with the chosen deckSize
  start(deckSize) {
    let heroes;

    //load herodata from localStorage
    heroes = JSON.parse(localStorage.getItem("heroes"));

    //store the id of all drawn characters:
    const ids = [];

    //draw the decks for the players:
    this.players.forEach(player => {
      while (player.deck.length < deckSize) {
        const id = Math.floor(Math.random() * 563);
        if (!ids.includes(id)) {
          player.deck.push(heroes[id]);
          ids.push(id);
        }
      }
    });

    //decide who starts:
    Math.random() < 0.5
      ? (this.players[0].initiative = false)
      : (this.players[1].initiative = false);

    //assign ai to player2 if 1-player-game is chosen
    if (document.querySelector("#playerNumber").value === 1) {
      this.players[1].ai = true;
    }
  }

  handleCombat(discipline) {
    const stats1 = this.players[0].deck[0].powerstats;
    const stats2 = this.players[1].deck[0].powerstats;

    const p1 = this.players[0];
    const p2 = this.players[1];

    const result = stats1[discipline] - stats2[discipline];

    //TODO: refactor with result from determineWinner:
    if (result > 0) {
      p1.deck.push(this.players[0].deck.shift());
      p1.deck.push(this.players[1].deck.shift());
      p1.deck = p1.deck.concat(this.heap);
      this.heap.length = 0;
      p1.initiative = true;
      p2.initiative = false;
    } else if (result < 0) {
      p2.deck.push(this.players[0].deck.shift());
      p2.deck.push(this.players[1].deck.shift());
      p2.deck = p2.deck.concat(this.heap);
      this.heap.length = 0;
      p1.initiative = false;
      p2.initiative = true;
    } else {
      this.heap.push(p1.deck.shift());
      this.heap.push(p1.deck.shift());
      this.heap.push(p2.deck.shift());
      this.heap.push(p2.deck.shift());
      if (p1.initiative === true) {
        p1.initiative = false;
        p2.initiative = true;
      } else {
        p1.initiative = true;
        p2.initiative = false;
      }
    }
  }

  chooseDiscipline() {
    const stats = this.players[1].deck[0].powerstats;
    let max = 0;
    let result;
    for (const stat in stats) {
      if (stats[stat] > max) {
        max = stats[stat];
        result = stat;
      }
    }
    return result;
  }
}

//-------------------------------------------------------------------
class Player {
  constructor(name) {
    this.name = name;
    this.deck = [];
    this.initiative = true;
    this.ai = false;
  }
}
