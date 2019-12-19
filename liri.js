require("dotenv").config();
const axios = require("axios");
const inquirer = require("inquirer");
const moment = require("moment");
const Spotify = require('node-spotify-api');
const fs = require('fs');

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

//Inquirer setup to ask where the user wants to search, what the user wants to search
inquirer.prompt([

    {
      type: "checkbox",
      name: "category",
      message: "What would you like to search: ",
      choices: [
          "Songs", "Bands", "Movies"
        ]
    },
    
    {
      type: "input",
      name: "search",
      message: "Your search: "
    }
  
  ]).then(function(reply) {
    //Depending on a user's answer, search using API’s
    
    //============SONGS=============
    // If the user's info exists
    if (reply.category.includes("Songs")) {
        if (reply.search !== ""){
            var searchSongs = reply.search;
            spotifySearch(searchSongs);
        } else {
            spotifySearch("Lose Yourself");
        }
        //Search Spotify
        function spotifySearch(searchSongs){
            spotify.search({ type: 'track', query: searchSongs }, function(err, data) {
                if (err) {
                return console.log('Error occurred: ' + err);
                }
                console.log("\n\nSpotify Data for '" + searchSongs + "': ");
                fs.appendFile("output.txt", "\n\nSpotify Data for '" + searchSongs + "': ", function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });
                var songsData = data.tracks.items;
                for (var i = 0; i < songsData.length; i++){
                    var artistList = [];
                    var artists = songsData[i].artists;
                    // console.log("ARTISTS ====== ", artists);
                    for (var j = 0; j < artists.length; j++){
                        artistList.push(artists[j].name);
                    }
                    console.log("\nSong: " + songsData[i].name +
                        "\nArtists: " + artistList.join(",").replace(",", ", ") + 
                        "\nAlbum: " + songsData[i].album.name + 
                        "\nLink to track: " + songsData[i].album.external_urls.spotify +
                        "\n====================="
                    ); //Display to console and append onto a .txt file
                    fs.appendFile("output.txt", "\nSong: " + songsData[i].name +
                        "\nArtists: " + artistList.join(",").replace(",", ", ") + 
                        "\nAlbum: " + songsData[i].album.name + 
                        "\nLink to track: " + songsData[i].album.external_urls.spotify +
                        "\n=====================", function(err) {

                        // If the code experiences any errors it will log the error to the console.
                        if (err) {
                          return console.log(err);
                        }
                    });
                }
            });
        }
    }
    //============BANDS=============
    if (reply.category.includes("Bands")) {
        if (reply.search !== ""){
            var searchBands = reply.search;
            //Search BandsInTown
            bandsSearch(searchBands);
        } else {
            bandsSearch("Killswitch Engage");
        }
        function bandsSearch(searchBands){
            axios.get("https://rest.bandsintown.com/artists/" + searchBands + "/events?app_id=codingbootcamp").then(
            function(response) {
                console.log("\n\nBandsInTown Data for '" + searchBands + "': ");
                var bandData = response.data;
                fs.appendFile("output.txt", "\n\nBandsInTown Data for '" + searchBands + "': ", function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });
                // console.log("AXIOS Response Data: ", response);
                for (var i = 0; i <bandData.length; i++){ //loop through items in data
                    console.log("Lineup: " + bandData[i].lineup.join(",").replace(",", ", ") +
                        "\nVenue: " + bandData[i].venue.name + //give venue name and location
                        "\nLocation: " + bandData[i].venue.city + ", " + bandData[i].venue.region +
                        "\nDate: " + moment(bandData[i].datetime).format('MMMM Do YYYY, h:mm') + //give date of event, reformatted
                        "\n====================="
                    ); //Display to console and append onto a .txt file
                    fs.appendFile("output.txt", "\nLineup: " + bandData[i].lineup.join(",").replace(",", ", ") +
                        "\nVenue: " + bandData[i].venue.name + //give venue name and location
                        "\nLocation: " + bandData[i].venue.city + ", " + bandData[i].venue.region +
                        "\nDate: " + moment(bandData[i].datetime).format('MMMM Do YYYY, h:mm') + //give date of event, reformatted
                        "\n=====================", function(err) {

                        // If the code experiences any errors it will log the error to the console.
                        if (err) {
                          return console.log(err);
                        }
                    });
                }   
            }).catch(function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
            });
        }
    }
    //============MOVIES=============
    if (reply.category.includes("Movies")) {
        if (reply.search !== ""){
            var searchMovies = reply.search;;
            //Search BandsInTown
            moviesSearch(searchMovies);
        } else {
            moviesSearch("Ace Ventura, Pet Detective");
        }
        function moviesSearch(searchMovies) {
        //Search OMDB
            axios.get("http://www.omdbapi.com/?t=" + searchMovies + "&y=&plot=short&apikey=e5dbc45d").then(
            function(response) {
                console.log("\n\nOMDB Data for '" + searchMovies + "': ");
                fs.appendFile("output.txt", "\n\nOMDB Data for '" + searchMovies + "': ", function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });
                var movieData = response.data;
                console.log("Title: " + movieData.Title +
                    "\nGenre: " + movieData.Genre + 
                    "\nDirector: " + movieData.Director + 
                    "\nRating: " + movieData.imdbRating + 
                    "\nPlot: " + movieData.Plot
                ); //Display to console and append onto a .txt file
                fs.appendFile("output.txt", "\nTitle: " + movieData.Title +
                    "\nGenre: " + movieData.Genre + 
                    "\nDirector: " + movieData.Director + 
                    "\nRating: " + movieData.imdbRating + 
                    "\nPlot: " + movieData.Plot, function(err) {

                    // If the code experiences any errors it will log the error to the console.
                    if (err) {
                        return console.log(err);
                    }
                });
            }).catch(function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
            });
        }
    } 
  
    // If the user's info doesn't exist
    else if (!reply.category.includes("Songs") && !reply.category.includes("Bands") && !reply.category.includes("Movies")) {
      console.log("==============================================");
      console.log("");
      console.log("You must specify a category to search");
      console.log("");
      console.log("==============================================");
    }
  });