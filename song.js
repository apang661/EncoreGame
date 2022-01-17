const axios = require("axios");
require('dotenv').config({ path: './.env' });
const qs = require("qs");
const res = require("express/lib/response");
const { response } = require("express");
const { all } = require("express/lib/application");
const { compileETag } = require("express/lib/utils");

let token = "";
let all_playlist_songs = [];

// Add a Spotify playlist to the queue of songs
async function add_spotify_playlist(link, callback) {
  all_playlist_songs.splice(0, all_playlist_songs.length);
  token = await getToken();
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
  try {
    await recursive_add_playlist(playlist_id, 0);
    callback(undefined, all_playlist_songs);
  } catch (err) {
    console.log(err);
    callback(err);
  }
}

// Uses recursion to get > 100 songs from a Spotify playlist
const recursive_add_playlist = async (playlist_id, offset) => {
    /**
     * @param {number} offset: local variable to help keep track of recursive process
     * @param {playlist_id} playlist_id: id of playlist to get songs from 
     */
    var current_offset = offset;
    var current_offset_100 = current_offset * 100;
    const options = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
      let response = await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?market=ES&offset=${current_offset_100}`, options);
      let playlist = response.data;
      if (playlist.items.length < 100) {
        push_the_songs(playlist);
      } else {
        push_the_songs(playlist);
        current_offset++;
        await recursive_add_playlist(playlist_id, current_offset);
      }
}

async function push_the_songs(playlist) {
  for (let i = 0; i < playlist.items.length; i++) {
    if (playlist.items[i].track) {
      let fixed_track_name = playlist.items[i].track.name;
      if (fixed_track_name.includes("(")) {
        fixed_track_name = fixed_track_name.substr(0, fixed_track_name.indexOf('('));
      }
      if (playlist.items[i].track.album.artists.length > 0) {
        let playlist_data = {
          artist_name: playlist.items[i].track.album.artists[0].name,
          track_name: fixed_track_name,
          track_image: playlist.items[i].track.album.images[0].url,
          preview_mp3: playlist.items[i].track.preview_url,
        };
        all_playlist_songs.push(playlist_data);
     }
    }
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