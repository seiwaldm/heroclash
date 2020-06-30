// Copyright (C) 2020  Markus Seiwald, GPLv3

class Heroclash {
  players = [];

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

    //save to localStorage
    localStorage.setItem("allHeroes", JSON.stringify(herodata));
    localStorage.setItem("allImages", JSON.stringify(images));
    // location.reload();
  }

  //start the game with the chosen deckSize
  start(deckSize) {
    let herodata;
    let images;

    //load herodata from localStorage
    herodata = JSON.parse(localStorage.getItem("allHeroes"));
    images = JSON.parse(localStorage.getItem("allImages"));

    //merge data from images into herodata:
    herodata.forEach((hero, index) => {
      let image = images[index].url;
      hero.image = image;
    });

    //store the id of all drawn characters:
    let ids = [];

    //draw the decks for the players:
    this.players.forEach((player) => {
      while (player.deck.length < deckSize) {
        let id = Math.floor(Math.random() * 731);
        while (!ids.includes(id)) {
          if (this.validStats(herodata[id])) {
            player.deck.push(herodata[id]);
          } else {
            id = Math.floor(Math.random() * 731);
            continue;
          }
          ids.push(id);
        }
      }
      //draw first card:
      player.activeCard = player.deck.pop();
    });

    //decide who starts:
    Math.random() < 0.5
      ? (this.players[0].initiative = false)
      : (this.players[1].initiative = false);
  }

  //checks if hero-stats contain a null-value
  validStats(hero) {
    let validStats = true;
    if (
      hero.intelligence === "null" ||
      hero.durability === "null" ||
      hero.speed === "null" ||
      hero.strength === "null" ||
      hero.combat === "null" ||
      hero.power === "null"
    ) {
      validStats = false;
    }
    return validStats;
  }

  handleCombat(discipline) {
    let p1 = this.players[0].console.log(values);
  }
}

//-------------------------------------------------------------------
class Player {
  constructor(name) {
    this.name = name;
    this.deck = [];
    this.initiative = true;
    this.activeCard = null;
  }
}

//------------------------------------------------------------------
