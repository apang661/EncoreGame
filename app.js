const request = require(`request`);
const axios = require("axios");
// import got from "got";
const qs = require("qs");

async function add_spotify_playlist(link) {
  let token = await getToken();
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
  // await axios.get(url, options).then(async (response) => {
  //   const playlist_items = JSON.parse(response.body).items;
  //   console.log(playlist_items);
  // });
  let response = await axios.get(url, options);
  let weatherdata = response.data;
  console.log(weatherdata);
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

add_spotify_playlist(
  "https://open.spotify.com/playlist/7BqZdu5sOhRdjoKmTP3Hdx?si=53a4a5c850e74bb7"
);
