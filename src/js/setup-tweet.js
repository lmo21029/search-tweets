(function () {

window.addEventListener("load", init);

function init() {
  fetch('https://jsonplaceholder.typicode.com/todos/1')
.then(function(response) {
  return response.json();
})
.then(function(myJson) {
  console.log(myJson);
});

}

})();