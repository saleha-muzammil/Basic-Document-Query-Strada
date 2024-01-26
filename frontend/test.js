document.getElementById('getData').addEventListener('click', () => {
  fetch('http://localhost:3000/getData')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
});

document.getElementById('addData').addEventListener('click', () => {
  fetch('http://localhost:3000/addData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({  newData: { name: "saleha" }  }),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
});

