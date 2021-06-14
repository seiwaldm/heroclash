const baseUrl = "https://heroclash-postgres.herokuapp.com/";
getHeroById(800);
calculateAverageHeroPower();

async function uploadHeroData() {
  const response = await fetch("heroes.json");
  const heroes = await response.json();
  console.log(heroes);

  heroes.forEach(hero => {
    hero.heroId = hero.id;
    delete hero.id;
    hero = JSON.stringify(hero);
    console.log(hero);
    fetch(`${baseUrl}heroes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: hero
    });
  });

  console.log(response);
}

async function getHeroById(heroId) {
  // const response = await fetch(`${baseUrl}heroes?heroId=${heroId}`);
  // const hero = await response.json();
  // console.log(hero);
  const response = await axios.get(`${baseUrl}heroes?heroId=${heroId}`);
  console.log(response.data);
}

async function calculateAverageHeroPower() {
  let total = 0;
  const response = await fetch("heroes.json");
  const heroes = await response.json();

  heroes.forEach(hero => {
    for (let stat in hero.powerstats) {
      total += hero.powerstats[stat];
    }
  });
  console.log(total / heroes.length);
}
