const axios = require('axios');
const asserts = require('assert');

const swapiUrl = "https://swapi.dev/api";

describe('Star Wars API Tests', function() {

  //Test Case 1: Retrieve List of ALL Characters
  it('should retrieve a list of all Star Wars characters', async function () {
    let response = await axios.get(`${swapiUrl}/people`);
    let characters = [];

    //Find all possible characters from API and keeps a record of each in an array
    while(characters.length != response.data.count){
      for(let i = 0; i < response.data.results.length; i++){
        characters.push(response.data.results[i]);
      }

      if(response.data.next != null){
        response = await axios.get(response.data.next);
      }
    }

    //Check status code, characters found and server count matches, and at least one character found
    asserts.strictEqual(response.status, 200, 'Unexpected status code');
    asserts.strictEqual(response.data.count, characters.length, 'Characters found does not match server count');
    asserts.notStrictEqual(characters[0], undefined, 'No characters found');
  });

  // Test Case 2: Retrieve details for a specific Star Wars character
  it('should retrieve details for a specific Star Wars character', async function(){

    //Tester can find specific name and insert fields to check here
    const characterName = "Anakin Skywalker";
    const height = "188";
    const mass = "84";
    const hairColor = "blond";
    const birthYear = "41.9BBY";
    const gender = "male";

    let response = await axios.get(`${swapiUrl}/people`);
    let characterInfo = null;
    let notFound = true;

    //Look for name from server list
    //If at the end of the list and character still not found, break out from loop
    while(notFound){
      for(let i = 0; i < response.data.results.length; i++){
        if(response.data.results[i].name === characterName){
          characterInfo = response.data.results[i];
          notFound = false;
        }
      }

      if(response.data.next != null && notFound){
        response = await axios.get(response.data.next);
      }else if(response.data.next == null && notFound){
         break;
      }
    }

    asserts.strictEqual(response.status, 200, 'Unexpected status code');
    asserts.notStrictEqual(characterInfo, null, `Character ${characterName} not found`);
    if(characterInfo != null){
      asserts.strictEqual(characterInfo.height, height, 'Incorrect height found');
      asserts.strictEqual(characterInfo.mass, mass, 'Incorrect weight found');
      asserts.strictEqual(characterInfo.hair_color, hairColor, 'Incorrect hair color found');
      asserts.strictEqual(characterInfo.birth_year, birthYear, 'Incorrect birth year found');
      asserts.strictEqual(characterInfo.gender, gender, 'Incorrect gender found');
    }
    
    
  });

  //Test Case 3: Retrieve a list of all Star Wars films
  it('should retrieve a list of all Star Wars films', async function(){
    const response = await axios.get(`${swapiUrl}/films`);
    const films = [];

    //Did not implement multipage logic as all films should be retrieved on first page
    //May implement multipage logic in the future if more films are added
    for(let i = 0; i < response.data.count; i++){
      films.push(response.data.results[i]);
    }

    //Checks status code, film count and server count matches, and at least one film found
    asserts.strictEqual(response.status, 200, 'Unexpected status code');
    asserts.strictEqual(response.data.count, films.length, "Films found doensn't match server count");
    asserts.notStrictEqual(films[0], undefined, 'No films found');
  });

  //Test Case 4: Retrieve details for a specific Star Wars film
  it('should retrieve details for a specific Star Wars film', async function(){
    const response = await axios.get(`${swapiUrl}/films`);
    
    //Tester can find specific name and insert fields to check here
    const filmName = "A New Hope";
    const epId = 4;
    const director = "George Lucas";
    const releaseDate = "1977-05-25";
    let film = null;

    for(let i = 0; i < response.data.count; i++){
      if(response.data.results[i].title === filmName){
        film = response.data.results[i];
      }
    }

    asserts.strictEqual(response.status, 200, "Unexpected status code");
    asserts.notStrictEqual(film, null, `Film name ${filmName} not found`);
    if(film != null){
      asserts.strictEqual(film.episode_id, epId, "Incorrect Episode ID found");
      asserts.strictEqual(film.director, director, "Incorrect Director found");
      asserts.strictEqual(film.release_date, releaseDate, "Incorrect Release Date found");
      asserts.strictEqual(film.episode_id, epId, "Incorrect Episode ID found");
    }

  })
});