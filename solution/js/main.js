let page = 1;
const perPage = 8;

async function loadCompanyData(name = null) {
  const paginationClass = document.querySelector('.pagination');
  let apiUrl = `https://energetic-sundress-deer.cyclic.app/api/companies?page=${page}&perPage=${perPage}`

  console.log("loading...");

  // Loading the Data
  if(name) {
    apiUrl += `&name=${encodeURIComponent(name)}`;
    paginationClass.classList.add("d-none");
  } else {
    paginationClass.classList.remove("d-none");
  }
}

module.exports = loadCompanyData;