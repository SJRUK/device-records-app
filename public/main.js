// main.js - Client-side code //
const update = document.querySelector('#update-button')



/*Delete Device - WORKING but need to edit and display message*/
  const deleteButton = document.querySelector('#delete-button')

deleteButton.addEventListener('click', _ => {

  const deleteEntry = document.getElementById('deleteInput');
  const deleteValue = deleteInput.value;

  fetch('/devices', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      assetTag: deleteValue,
    })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
        if (response === 'No quote to delete') {
          messageDiv.textContent = 'No Darth Vader quote to delete'
        } 
        else {
          window.location.reload(true)
          }
      })
    .catch(console.error)
})


/* Update existing devices - WORKING*/
const updateForm = document.getElementById('updateForm');

updateForm.addEventListener('submit', event => {
  event.preventDefault(); // Prevent the default form submission behavior //

  // Retrieve the input values //
  const nameInput = document.getElementById('nameInput');
  const nameValue = nameInput.value;
  const assetInput = document.getElementById('assetInput');
  const assetValue = assetInput.value;
  const organisationInput = document.getElementById('organisationInput');
  const organisationValue = organisationInput.value;
  const lineManagerInput = document.getElementById('lineManagerInput');
  const lineManagerValue = lineManagerInput.value;
  const dateInput = document.getElementById('dateInput');
  const dateValue = dateInput.value;
  
  // Perform the update operation using the obtained name value //
  fetch('/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      assetTag: assetValue,
      name: nameValue,
      organisation: organisationValue,
      lineManager: lineManagerValue,
      dateRequired: dateValue
    }),
  })
    .then(res => {
      if (res.ok) return res.json();
    })
    .then(response => {
      console.log(response);
      window.location.reload();
    })
    .catch(error => console.error(error));
});


/*Search the database and get results - WORKING*/
const searchButton = document.querySelector('#search-button')

searchButton.addEventListener('click', _ => {

  const searchInput = document.getElementById('searchInput');
  const searchValue = searchInput.value;

fetch('/search', {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    assetTag: searchValue,
  }),
})
  .then(res => {
    if (res.ok) return res.json();
  })
  .then(response => {
    console.log(response);
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    if (response.length === 0) {
      resultsContainer.innerHTML = '<p>No results found.</p>';
    } else {
      response.forEach(device => {
        const deviceElement = document.createElement('div');
        const nameElement = document.createElement('h3');
        const organisationElement = document.createElement('p');

        nameElement.textContent = device.name;
        organisationElement.textContent = device.organisation;

        deviceElement.appendChild(nameElement);
        deviceElement.appendChild(organisationElement);

        resultsContainer.appendChild(deviceElement);
      });
    }
  })
  .catch(error => console.error(error));
});

    /*
    //console.log(response);//
    window.location.reload();
  })
  .catch(error => console.error(error));
});*/

