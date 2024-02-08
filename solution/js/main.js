let page = 1;
const perPage = 8;

async function loadCompanyData(name = null) {
  const paginationClass = document.querySelector('.pagination');
  let apiUrl = `https://energetic-sundress-deer.cyclic.app/api/companies?page=${page}&perPage=${perPage}`

  console.log("loading...");

  if(name) {
    apiUrl += `&name=${encodeURIComponent(name)}`;
    paginationClass.classList.add("d-none");
  } else {
    paginationClass.classList.remove("d-none");
  }

  try {
    const response = await fetch(apiUrl);

    if(!response.ok) {
      throw new Error("Fetch failed!");
    }

    const companies = await response.json(); 
    companyObjectToTableRowTemplate (companies)   
  } catch (err) {
    console.error(`Could not fetch: ${err}`);
  }
}

function companyObjectToTableRowTemplate(companies) {
  console.log("Updating...");
  const tableBody = document.querySelector('#companiesTable tbody');
  tableBody.innerHTML = '';

  companies.forEach(company => {
    const tags = company.tag_list ? company.tag_list.split(',').map(tag => tag.trim()).filter((tag, index) => index < 2).join(', ') : '--';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${company.name}</td>
      <td>${company.description || '--'}</td>
      <td>${company.number_of_employees || '--'}</td>
      <td>${company.offices && company.offices.length > 0 ? `${company.offices[0].city}, ${company.offices[0].country}` : '--'}</td>
      <td>${company.category_code || '--'}</td>
      <td>${company.founded_year ? `${company.founded_month}/${company.founded_day}/${company.founded_year}` : '--'}</td>
      <td><a href="${company.homepage_url || '#'}" target="_blank">${company.homepage_url || 'No Website'}</a></td>
      <td>${tags}</td>
    `;
    tableBody.appendChild(row);
  });
}

console.log("Inside main.js")
loadCompanyData();