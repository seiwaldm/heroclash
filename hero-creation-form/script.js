const HOST = "https://heroclash-postgres.herokuapp.com";
const jwtoken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjIzNTI5NDEyLCJleHAiOjE2MjYxMjE0MTJ9.adefpxDgVxOjTCyBj9mEJGhMBpCp8rl2iu43jM-0AlU";
const formElement = document.querySelector("form");
console.log(formElement);

formElement.addEventListener("submit", e => {
  e.preventDefault();

  const request = new XMLHttpRequest();

  const formData = new FormData();

  const formElements = formElement.elements;

  let currentFieldset = {};
  let currentFieldsetName = "";

  const data = {};

  for (let i = 0; i < formElements.length; i++) {
    const currentElement = formElements[i];
    if (currentElement.type === "fieldset") {
      if (currentFieldsetName !== "") {
        data[currentFieldsetName] = currentFieldset;
      }
      currentFieldsetName = currentElement.name;
      currentFieldset = {};
    }
    if (!["submit", "file", "fieldset"].includes(currentElement.type)) {
      if (currentElement.name === "name") {
        data[currentElement.name] = currentElement.value;
      } else {
        currentFieldset[currentElement.name] = currentElement.value;
      }
    } else if (currentElement.type === "file") {
      if (currentElement.files.length === 1) {
        const file = currentElement.files[0];
        formData.append(`files.${currentElement.name}`, file, file.name);
      } else {
        for (let i = 0; i < currentElement.files.length; i++) {
          const file = currentElement.files[i];

          formData.append(`files.${currentElement.name}`, file, file.name);
        }
      }
    }
  }

  getFreeId().then(heroId => {
    data["heroId"] = heroId;
    console.log(JSON.stringify(data));

    formData.append("data", JSON.stringify(data));

    request.open("POST", `${HOST}/heroes`);
    request.setRequestHeader("Authorization", "Bearer " + jwtoken);
    request.send(formData);
  });
});

async function getFreeId() {
  const response = await fetch(`${HOST}/heroes`);
  const heroData = await response.json();
  console.log(heroData);
  const heroIds = heroData.map(el => el.heroId);
  let heroId = 1;
  while (heroIds.includes(heroId)) {
    heroId++;
  }
  return heroId;
}
