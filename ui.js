// Copyright (C) 2020  Markus Seiwald, GPLv3

class UI {
  //start everything off with this constructor:
  constructor() {
    this.game = new Heroclash();

    this.game.loadData().then(() => {
      this.game.start(280);

      this.updateState();
      this.updateCards();
      this.startTurn();

      console.log(this.game);

      //handle clicks and combat:
      let stats = document.querySelectorAll(".card-inner");
      stats.forEach(element =>
        element.addEventListener("click", event => {
          console.log(event.target.classList[0]);

          if (event.target.classList[0] === "image") {
            if (element.id === "card-inner1") {
              this.displayBio(this.game.players[0].deck[0]);
            }
            if (element.id === "card-inner2") {
              this.displayBio(this.game.players[1].deck[0]);
            }
          } else {
            if (element.id === "card-inner1") {
              this.turnCard(document.querySelector("#card-inner2"));
            }
            if (element.id === "card-inner2") {
              this.turnCard(document.querySelector("#card-inner1"));
            }

            const that = this;
            setTimeout(function() {
              that.game.handleCombat(event.target.classList[0]);
              that.turnCard(document.querySelector("#card-inner1"));
              that.turnCard(document.querySelector("#card-inner2"));
              setTimeout(function() {
                that.updateState();
                that.updateCards();
                that.startTurn();
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
      container.innerHTML = "GAME OVER - PLAYER 2 WINS!";
    } else if (this.game.players[1].deck.length === 0) {
      container.innerHTML = "GAME OVER - PLAYER 1 WINS!";
    } else {
      container.innerHTML = `
    <h2>P1: ${this.game.players[0].deck.length}</h2>
    <h3>Heap: ${this.game.heap.length}</h3>
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

      let color = this.setColor(activeCard);

      // if (alignment === "good") {
      //   color += "#80ccd8";
      // } else if (alignment === "bad") {
      //   color += "#e4003a";
      // } else {
      //   color += "f7a823";
      // }

      card.innerHTML = `
            <div class="card-front">
              <img
                src="images/card-red.png"
                width="330"
                alt="A red Playing Card"
              />
            </div>
            <div class="card-back" style="background-color:${color}">
              <div class="card-image">
                <img
                  class="image"
                  src="${images.md}"
                  alt="Avatar"
                />
              </div>
              <div class="stats">
                <h2>${activeCard.name}</h2>

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
    this.game.players[0].initiative === true
      ? this.turnCard(document.querySelector("#card-inner1"))
      : this.turnCard(document.querySelector("#card-inner2"));
  }

  setColor(card) {
    const alignment = card.biography.alignment;
    let color = "";
    if (alignment === "good") {
      color += "#80ccd8";
    } else if (alignment === "bad") {
      color += "#e4003a";
    } else {
      color += "#f7a823";
    }
    return color;
  }

  displayBio(hero) {
    const modal = document.querySelector("#myModal");
    modal.style.display = "block";
    modal.addEventListener("click", () => (modal.style.display = "none"));

    const modalHeader = document.querySelector(".modal-header");
    modalHeader.style.backgroundColor = this.setColor(hero);
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
    modalFooter.style.backgroundColor = this.setColor(hero);
    modalFooter.innerHTML = `
    <h3>Alignment: ${hero.biography.alignment}</h3>

    `;
  }
}

ui = new UI();

const start = document.getElementById("start");

start.addEventListener("click", showGameScreen);

function showGameScreen() {
  document.querySelector(".menu").style.display = "none";
  document.querySelector(".gamescreen").style.display = "grid";
}
