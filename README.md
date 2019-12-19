# LIRI_Bot

#### Language Interpretation and Recognition Interface

LIRI is a Node-based app which when run will inquire via terminal what the user would like to search for, then responds with data about the chosen input. It utilizes three API's to print information (to both the terminal and to the given file named **output.txt**) about the user's input. These API's are -
###### BandsInTown
###### Spotify
###### OMDB

```diff
# An Example #
```
When a user runs '*node liri.js*' in their terminal, LIRI will query **What would you like to search?** The user is given three options: **Songs**, **Bands**, and **Movies**, and is able to select any combination of the three.

Provided at least one is chosen, the user is then prompted for a search. They may type anything in this field. If their query is matched by any of the chosen search options, data is then printed to the console and to the **output.txt** file.

So if a user selects **Movies**, then searches '8 Mile,' they will receive data about the film including Genre, Ratings, and a short Plot Summary.

```diff
+ Resources Used +
```
###### Inquirer - For Querying users for input
###### Moment - To reformat dates
###### AXIOS - For handling API objects
###### File System (fs) - To print to 'output.txt'
###### dotenv - Storing configuration in the environment separate from code
###### The aformentioned API's for data

```diff
! The Code !
```

To Properly use this application, you will have to use your own Spotify API information. You can do this by creating your own .env file, and filling in your own Spotify information, like this:

```js
# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret
```

Alternatively, you can simply replace your spotify keys within liri.js, like this:

```js
var spotify = new Spotify({
  id: <your spotify client id>,
  secret: <your spotify client secret>
});
```
However, your spotify client id and client secret will not be secure. More info on the [Spotify API](https://developer.spotify.com/documentation/web-api/) can be found here: https://www.npmjs.com/package/node-spotify-api

If you would like to add more search parameters, you will need to utilize [inquirer.prompt](https://www.npmjs.com/package/inquirer), and make additions to inquiries in **liri.js** within the inquirer prompt, shown below:

```js
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
  
  ]).then(function(reply) {///Do something
  ...}
  ```
  
  You may also want to change how/where the data is logged or printed to using File System. Below is a sample of the **console-logged** data and the **output.txt** printed data, which is appended asynchronously using [fs.appendFile](https://nodejs.org/api/fs.html#fs_fs_appendfile_path_data_options_callback). More information on fs can be found here: https://nodejs.org/api/fs.html 

```js
  console.log(
    "Lineup: " + bandData[i].lineup.join(",").replace(",", ", ") +
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
```

```diff
- Enjoy LIRI, and have fun coding! -
```