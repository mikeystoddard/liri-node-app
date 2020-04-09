// npm link to keys
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
// reference in if/else
var command = process.argv[2]
var userInput = process.argv.slice(3).join(" ");

// ---------concert-this------------
function bandsInTown(artist) {
    // console.log("Artist", artist, "string");
    if (artist === "") {
        artist = "Lady Gaga";
    };
    var bandURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(bandURL).then(
        function (response) {
            var concerts = response.data;
            // console.log(response.data);
            for (let i = 0; i < concerts.length; i++) {
                console.log("Venue: " + concerts[i].venue.name);
                console.log("Location: " + concerts[i].venue.city + "," + concerts[i].venue.country);
                console.log("Date: " + moment(concerts[i].datetime).format("MM/DD/YYYY"));
                console.log("\n--------------\n");
            }
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

    spotify.search({ type: 'track', query: song }, function (err, data) {
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
           
        });
}
function doWhatItSays() {
    fs.readFile("random.txt", "utf-8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var random = data.split(",");
        songs(random[1]);
    });
}

if (command === "concert-this") {
    bandsInTown(userInput)
}

else if (command === "spotify-this-song") {
    songs(userInput)

} else if (command === "movie-this") {
    movies(userInput)

} else if (command === "do-what-it-says") {
    doWhatItSays()
} 
else {
    console.log("invalid choice");
    process.exit(0);
}