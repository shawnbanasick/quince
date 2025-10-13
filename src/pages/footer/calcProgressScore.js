const calcProgressScore = (currentPage) => {
  let totalProgressScore;

  if (currentPage === "landing") {
    totalProgressScore = 10;
    return totalProgressScore;
  }
  if (currentPage === "consent") {
    totalProgressScore = 15;
    return totalProgressScore;
  }
  if (currentPage === "presort") {
    totalProgressScore = 20;
    return totalProgressScore;
  }
  if (currentPage === "thin") {
    totalProgressScore = 40;
    return totalProgressScore;
  }
  if (currentPage === "sort") {
    totalProgressScore = 60;
    return totalProgressScore;
  }
  if (currentPage === "postsort") {
    totalProgressScore = 80;
    return totalProgressScore;
  }
  if (currentPage === "survey") {
    totalProgressScore = 90;
    return totalProgressScore;
  }
  if (currentPage === "submit") {
    totalProgressScore = 100;
    return totalProgressScore;
  }
};

export default calcProgressScore;
