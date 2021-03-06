// Copyright (C) 2020  Markus Seiwald, GPLv3

class UI {
  //start everything off with this constructor:
  constructor(cardcount) {
    this.game = new Heroclash();
    this.rounds = 0;
    this.maxDiff = 0;

    this.game.loadData().then(() => {
      this.game.start(cardcount);

      this.updateState();
      this.updateCards();
      this.startTurn();

      console.log(this.game);

      //handle clicks and combat:
      let stats = document.querySelectorAll(".card-inner");
      stats.forEach(element =>
        element.addEventListener("click", event => {
          const discipline = event.target.classList[0];

          if (event.target.classList[0] === "image") {
            if (element.id === "card-inner1") {
              this.displayBio(this.game.players[0].deck[0]);
            }
            if (element.id === "card-inner2") {
              this.displayBio(this.game.players[1].deck[0]);
            }
          } else {
            document
              .querySelectorAll(`.${discipline}`)
              .forEach(element => (element.style.backgroundColor = "#000"));

            if (element.id === "card-inner1") {
              this.turnCard(document.querySelector("#card-inner2"));
            }
            if (element.id === "card-inner2") {
              this.turnCard(document.querySelector("#card-inner1"));
            }

            const that = this;
            setTimeout(function() {
              that.game.handleCombat(discipline);
              that.rounds++;
              let diff = Math.abs(
                that.game.players[0].deck.length -
                  that.game.players[1].deck.length
              );
              if (diff > that.maxDiff) {
                that.maxDiff = diff;
              }
              that.turnCard(document.querySelector("#card-inner1"));
              that.turnCard(document.querySelector("#card-inner2"));
              setTimeout(function() {
                that.updateState();
                that.updateCards();
                that.startTurn();
                console.log(
                  `gespielte Runden: ${that.rounds}, maximale Differenz: ${that.maxDiff}, aktuelle Differenz: ${diff}`
                );
              }, 1000);
            }, 1700);
          }
        })
      );
    });
  }

  updateState() {
    const container = document.querySelector("#game-state");
    if (this.game.players[0].deck.length === 0) {
      container.innerHTML = "<p>GAME OVER - PLAYER 2 WINS</p>";
      container.classList.add("menu");
      const cards = document.querySelectorAll(".card");
      cards.forEach(card => (card.style.display = "none"));
    } else if (this.game.players[1].deck.length === 0) {
      container.innerHTML = "<p>GAME OVER - PLAYER 1 WINS</p>";
      container.classList.add("menu");
      const cards = document.querySelectorAll(".card");
      cards.forEach(card => (card.style.display = "none"));
    } else {
      container.innerHTML = `
    <h2>P1: ${this.game.players[0].deck.length}</h2>
    <h3>HEAP: ${this.game.heap.length}</h3>
    <h2>P2: ${this.game.players[1].deck.length}</h2>

    `;
    }
  }

  //display the active card of the two players:
  updateCards() {
    const cards = document.querySelectorAll(".card-inner");
    cards.forEach((card, index) => {
      const activeCard = this.game.players[index].deck[0];
      const stats = this.game.players[index].deck[0].powerstats;
      const images = this.game.players[index].deck[0].images;
      const alignment = this.game.players[index].deck[0].biography.alignment;

      card.innerHTML = `
            <div class="card-front">
              <img
                src="images/card-red.png"
                width="330"
                alt="A red Playing Card"
              />
            </div>
            <div class="card-back ${alignment}">
              <div class="card-image">
                <img
                  class="image"
                  src="${images.md}"
                  alt="Avatar"
                />
              </div>
              <div class="stats">
                <h2 class="hero-name">${activeCard.name}</h2>

                <ul>
                  <li class="intelligence">
                    <i class="fas fa-brain"> </i>Intelligence
                    <span style="margin-left: auto;">${stats.intelligence}</span>
                  </li>
                  <li class="strength">
                    <i class="fas fa-dumbbell"></i>Strength
                    <span style="margin-left: auto;">${stats.strength}</span>
                  </li>
                  <li class="speed">
                    <i class="fas fa-tachometer-alt"></i>Speed
                    <span style="margin-left: auto;">${stats.speed}</span>
                  </li>
                  <li class="durability">
                    <i class="fas fa-shield-alt"></i>Durability
                    <span style="margin-left: auto;">${stats.durability}</span>
                  </li>
                  <li class="power">
                    <i class="fas fa-fist-raised"></i>Power
                    <span style="margin-left: auto;">${stats.power}</span>
                  </li>
                  <li class="combat">
                    <i class="fas fa-khanda"></i>Combat
                    <span style="margin-left: auto;">${stats.combat}</span>
                  </li>
                </ul>
              </div>
    `;
      fitty(".hero-name");
    });
  }

  turnCard(card) {
    if (card.classList.contains("active")) {
      card.style.transform = "";
      card.classList.remove("active");
    } else {
      card.style.transform = "rotateY(180deg)";
      card.classList.add("active");
    }
  }

  //kick off a turn by turning the card of the player with initiative:
  startTurn() {
    let activePlayer;
    let playerNumber;
    if (this.game.players[0].initiative === true) {
      this.turnCard(document.querySelector("#card-inner1"));
      activePlayer = this.game.players[0];
      playerNumber = 0;
    } else {
      this.turnCard(document.querySelector("#card-inner2"));
      activePlayer = this.game.players[1];
      playerNumber = 1;
    }

    if (activePlayer.ai === true) {
      setTimeout(() => {
        const discipline = this.game.chooseDiscipline(activePlayer);
        document.querySelectorAll(`.${discipline}`)[playerNumber].click();
      }, 1300);
    }
  }

  displayBio(hero) {
    const modal = document.querySelector("#myModal");
    modal.style.display = "block";
    modal.addEventListener("click", () => (modal.style.display = "none"));

    const modalHeader = document.querySelector(".modal-header");
    modalHeader.classList.add(`${hero.biography.alignment}`);
    modalHeader.innerHTML = `
    <h2>${hero.name}</h2>`;

    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = `
      <ul>
      <li>A.K.A: ${hero.biography.aliases}</li> 
      <li>First Appearance: ${hero.biography.firstAppearance}</li>
        <li>Publisher: ${hero.biography.publisher}</li>
        <li>Gender: ${hero.appearance.gender}</li>
        <li>Race: ${hero.appearance.race}</li>
        <li>Occupation: ${hero.work.occupation}</li>
        <li>Base: ${hero.work.base}</li>
      </ul>
    `;

    const modalFooter = document.querySelector(".modal-footer");
    modalFooter.classList.add(`${hero.biography.alignment}`);
    modalFooter.innerHTML = `
    <h3>Alignment: ${hero.biography.alignment}</h3>

    `;
  }
}

const start = document.getElementById("start");
start.addEventListener("click", showGamescreen);

function showGamescreen() {
  const ui = new UI(document.querySelector("#cardcount").value);
  document.querySelector(".menu").style.display = "none";
  document.querySelector(".gamescreen").style.display = "grid";
}

function showGallery() {
  document.querySelector(".gallery").style.display = "flex";
  document.querySelector(".menu").style.display = "none";
}

const cardcount = document.querySelector("#cardcount");
const playerNumber = document.querySelector("#playerNumber");

document.querySelector("#lessCards").addEventListener("click", () => {
  if (cardcount.value > 1) cardcount.value--;
});

document.querySelector("#moreCards").addEventListener("click", () => {
  if (cardcount.value < 280) cardcount.value++;
});

document.querySelector("#lessPlayers").addEventListener("click", () => {
  if (playerNumber.value > 0) playerNumber.value--;
});

document.querySelector("#morePlayers").addEventListener("click", () => {
  if (playerNumber.value < 2) playerNumber.value++;
});

cardcount.addEventListener("change", () => {
  if (cardcount.value > 280) {
    cardcount.value = 280;
  }
  if (cardcount.value < 1) {
    cardcount.value = 1;
  }
});

playerNumber.addEventListener("change", () => {
  if (playerNumber.value > 2) {
    playerNumber.value = 2;
  }
  if (playerNumber.value < 0) {
    playerNumber.value = 0;
  }
});
