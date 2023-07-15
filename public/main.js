// main.js
const update = document.querySelector('#update-button')

/*update.addEventListener('click', _ => {
    fetch('/devices', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameInput,
        organisation: 'TEST',
      }),
    })
    .then(res => {
        if (res.ok) return res.json()
      })
      .then(response => {
        console.log(response)
        window.location.reload(true)
      })
  })*/

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


/* Update existing devices */
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

