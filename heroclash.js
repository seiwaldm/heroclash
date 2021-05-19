// Copyright (C) 2020  Markus Seiwald, GPLv3

class Heroclash {
  constructor() {
    this.players = [];
    this.heap = [];
    this.players.push(new Player("Player 1"));
    this.players.push(new Player("Player 2"));
    this.baseUrl = "http://localhost:1337/";
  }

  //load data from json-file and save to localStorage
  async loadData() {
    const response = await fetch("heroes.json");
    const heroes = await response.json();

    //save to localStorage
    localStorage.setItem("heroes", JSON.stringify(heroes));
  }

  async getHeroById(heroId) {
    const response = await fetch(`${this.baseUrl}heroes?heroId=${heroId}`);
    return await response.json();
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

    //assign ai to players
    const playerNumber = document.querySelector("#playerNumber").value;
    if (playerNumber == 0) {
      this.players[0].ai = true;
      this.players[1].ai = true;
    } else if (playerNumber == 1) {
      this.players[1].ai = true;
    }
  }

  async handleCombat(discipline) {
    const stats1 = this.players[0].deck[0].powerstats;
    const stats2 = this.players[1].deck[0].powerstats;

    const p1 = this.players[0];
    const p2 = this.players[1];

    const result = stats1[discipline] - stats2[discipline];
    let hero1 = p1.deck[0].id;
    let hero2 = p2.deck[0].id;

    let winner = 0;
    let initiative = p1.initiative ? 1 : 2;
    //TODO: refactor with result from determineWinner:
    if (result > 0) {
      winner = 1;
      p1.deck.push(this.players[0].deck.shift());
      p1.deck.push(this.players[1].deck.shift());
      p1.deck = p1.deck.concat(this.heap);
      this.heap.length = 0;
      p1.initiative = true;
      p2.initiative = false;
    } else if (result < 0) {
      winner = 2;
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

    // ------PROMISE CHAINING WITH THEN-------

    // this.getHeroById(hero1).then(response => {
    //   const heroId1 = response[0].id;
    //   console.log(heroId1);
    //   this.getHeroById(hero2).then(response1 => {
    //     const heroId2 = response1[0].id;
    //     fetch(`${this.baseUrl}battles`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       body: `{
    //   "hero1": ${heroId1},
    //   "hero2": ${heroId2},
    //   "discipline": "${discipline}",
    //   "winner": ${winner},
    //   "margin": ${Math.abs(result)},
    //   "initiative": ${initiative}
    //   }
    //   `
    //     });
    //   });
    // });

    // ------"PROMISE CHAINING" WITH ASYNC/AWAIT-------
    hero1 = await this.getHeroById(hero1);
    hero2 = await this.getHeroById(hero2);
    hero1 = hero1[0].id;
    hero2 = hero2[0].id;
    fetch(`${this.baseUrl}battles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: `{
      "hero1": ${hero1},
      "hero2": ${hero2},
      "discipline": "${discipline}",
      "winner": ${winner},
      "margin": ${Math.abs(result)},
      "initiative": ${initiative}
      }
      `
    });
  }

  chooseDiscipline(player) {
    const stats = player.deck[0].powerstats;
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
