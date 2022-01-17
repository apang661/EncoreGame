const axios = require("axios");
require('dotenv').config({ path: './.env' });
const qs = require("qs");
const res = require("express/lib/response");
const { response } = require("express");
const { all } = require("express/lib/application");

let token = "";
let all_playlist_songs = [];

// Add a Spotify playlist to the queue of songs
async function add_spotify_playlist(link, callback) {
  all_playlist_songs.splice(0, all_playlist_songs.length);
  token = await getToken();
  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const playlist_id_split = link.split("/")[4];
  let playlist_id;
  if (playlist_id_split){
    playlist_id = playlist_id_split.substr(
    0,
    playlist_id_split.indexOf("?")
  );
  } else {
    callback(`no playlist found`);
    return;
  }
  let url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?market=ES`;
  try {
    let response = await axios.get(url, options);
    const playlist = response.data;
    console.log(playlist.items.length);
    for (let i = 0; i < playlist.items.length; i++) {
      let fixed_track_name = playlist.items[i].track.name;
      if (fixed_track_name.includes("(")) {
        fixed_track_name = fixed_track_name.substr(0, fixed_track_name.indexOf('('));
      }
      let playlist_data = {
        artist_name: playlist.items[i].track.album.artists[0].name,
        track_name: fixed_track_name,
        track_image: playlist.items[i].track.album.images[0].url,
        preview_mp3: playlist.items[i].track.preview_url,
      };
      all_playlist_songs.push(playlist_data);
    }
    console.log(all_playlist_songs.length);
    callback(undefined, all_playlist_songs);
  } catch (err) {
    console.log(err);
    callback(err);
  }
}

// Retrieves Spotify API token
const getToken = async (
  clientId = process.env.SPOTIFY_CLIENT_ID,
  clientSecret = process.env.SPOTIFY_CLIENT_SECRET
) => {
  const headers = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: clientId,
      password: clientSecret,
    },
  };
  const data = {
    grant_type: "client_credentials",
  };
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify(data),
      headers
    );
    return response.data.access_token;
  } catch (err) {
    console.log(err.response);
  }
};

module.exports = {
  add_spotify_playlist: add_spotify_playlist,
  all_playlist_songs: all_playlist_songs,
}