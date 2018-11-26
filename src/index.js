document.addEventListener('DOMContentLoaded', () => {
  const containerForAppendingPokemonCards = document.getElementById('pokemon-container')
  const pokemonSearchInputField = document.getElementById('pokemon-search-input')

  let allPokemonData = [] //won't have to fetch each time we want this data


  pokemonSearchInputField.addEventListener('input', function(event){
    //event is the input event
    //event/target is the <input> field the user typed into
    //event.target.value is the string the user inputed
    const userSearchTerm = event.target.value
    const filteredPokemon = allPokemonData.filter(function(pokemonObject){
      return pokemonObject.name.includes(userSearchTerm)
    })
    const pokeHTML = renderAllPokemon(filteredPokemon)
    containerForAppendingPokemonCards.innerHTML = pokeHTML
  })

  containerForAppendingPokemonCards.addEventListener('click', function(event){
    if (event.target.dataset.action === 'flip'){
      const clickedPokemon = allPokemonData.find(function(pokemonObject){
        return pokemonObject.id == event.target.dataset.id
      })
      if (event.target.src === clickedPokemon.sprites.front){
        event.target.src = clickedPokemon.sprites.back
      } else {
        event.target.src = clickedPokemon.sprites.front
      }
    }
  })


  //send a get request to the server
  //grab all the pokemon data
  fetch('http://localhost:3000/pokemon', { method: 'GET'})
    .then(function(responseObject){
      return responseObject.json()
    })
    .then(function(parsedPokeJSON){
      //store all the pokemon data in a JS array so we can interact with it after the initial fetch
      allPokemonData = parsedPokeJSON
      //producing a string of HTML cards for all the data in our database. adding that to the DOM
      containerForAppendingPokemonCards.innerHTML = renderAllPokemon(parsedPokeJSON)
      })
    })

    function renderAllPokemon(pokeCollection){
      return pokeCollection.map(function(pokemonObject) {
        return `
        <div class="pokemon-container">
        <div style="width:230px;margin:10px;background:#fecd2f;color:#2d72fc" class="pokemon-frame">
          <h1 class="center-text">${pokemonObject.name}</h1>
          <div style="width:239px;margin:auto">
            <div style="width:96px;margin:auto">
              <img data-id="${pokemonObject.id}" data-action="flip" class="toggle-sprite" src="${pokemonObject.sprites.front}">
            </div>
          </div>
        </div>
      </div>
        `
      }).join('') //take our array of HTML strings and turn it into one big string. this is so we do not see the commas all over the webpage
    }
