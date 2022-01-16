const request = require(`request`);
const axios = require("axios");
require('dotenv').config({ path: './.env' });
const qs = require("qs");

let token = "";
let all_playlist_songs = [];

async function add_spotify_playlist(link, callback) {
  token = await getToken();
  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const playlist_id_split = link.split("/")[4];
  const playlist_id = playlist_id_split.substr(
    0,
    playlist_id_split.indexOf("?")
  );
  let url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?market=ES`;
  try {
    let response = await axios.get(url, options);
    const playlist = response.data;
    for (let i = 0; i < playlist.items.length; i++) {
      let playlist_data = {
        artist_name: playlist.items[i].track.album.artists[0].name,
        track_name: playlist.items[i].track.name,
        track_image: playlist.items[i].track.album.images[0].url,
        preview_mp3: playlist.items[i].track.preview_url,
      };
      all_playlist_songs.push(playlist_data);
    }
    callback(undefined, all_playlist_songs);
  } catch (err) {
    callback(err);
  }
}

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
    console.log(err);
  }
};



module.exports = {
  add_spotify_playlist: add_spotify_playlist,
  all_playlist_songs: all_playlist_songs,
}