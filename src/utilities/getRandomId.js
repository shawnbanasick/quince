const getRandomLetter = () => {
  const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return randLetter;
};

const getRandomId = () => {
  let randomId = "";
  for (let i = 0; i < 8; i++) {
    randomId += getRandomLetter();
  }
  return randomId;
};

export default getRandomId;
