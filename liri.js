// npm link to keys
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var chalk = require("chalk")
// reference in if/else. Learned slice in class tonight
var command = process.argv[2]
var userInput = process.argv.slice(3).join("");

function startPoint(command, userInput) {
    if (command === "concert-this") {
        bandsInTown(userInput)
    } else if (command === "spotify-this-song") {
        songs(userInput)

    } else if (command === "movie-this") {
        movies(userInput)

    } else if (command === "do-what-it-says") {
        doWhatItSays()
    } else {
        console.log("invalid choice");
        process.exit;
    }
}
// ---------concert-this------------
function bandsInTown(artist) {
    console.log("bandsInTown" + artist)
    if (artist === "") {
        artist = "Lady Gaga";
    };

    var bandURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(bandURL).then(
        function (response) {
            var concerts = response.data;
            if (!concerts.length) {
                console.log(chalk.red ("No results found for " + artist));
                return;
            }
            for (let i = 0; i < concerts.length; i++) {
                console.log(chalk.blue.bgWhite("Venue: " + concerts[i].venue.name));
                console.log(chalk.blue.bgWhite("Location: " + concerts[i].venue.city + "," + concerts[i].venue.country));
                console.log(chalk.blue.bgWhite("Date: " + moment(concerts[i].datetime).format("MM/DD/YYYY")));
                console.log("\n--------------\n");
            }
            //Data requested from HMWK
        }
    );
};
// ---------------spotify-this-song-----------
function Artists(artist) {
    return artist.name
}
var spotify = new Spotify(keys.spotify);

function songs(song) {
    if (song === "") {
        song = "The Sign";
    };

    spotify.search({
        type: 'track',
        query: song
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var list = data.tracks.items;
        for (let i = 0; i < list.length; i++) {
            console.log("Artist: " + list[i].artists.map(Artists));
            console.log("Song: " + list[i].name);
            console.log("Preview Link: " + list[i].preview_url);
            console.log("Album: " + list[i].album.name);
            console.log("\n--------------\n");
        }
        //console logs for data points requested from hmwk
    });
}

// ----------movie-this ----------
function movies(movie) {
    if (movie === "") {
        movie = "Mr. Nobody";
    };
    var movieURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios.get(movieURL).then(
        function (response) {
            var movies = response.data;
            // response data below
            console.log("Title: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country Produced:" + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("\n--------------\n");
            //data requested from HMWK
        });
}
// Do What It Says

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log("data" + data)
        var dataArray = data.split(",")
        if (dataArray.length === 2) {
            startPoint(dataArray[0], dataArray[1])
        } else if (dataArray.length === 1) {
            startPoint(dataArray[0])
        }
    })
}

startPoint(command,userInput)