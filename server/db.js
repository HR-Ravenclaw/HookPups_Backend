const { Pool } = require('pg')
require("dotenv").config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});

module.exports = {
  // chat room queries
  addNewChatroom: (data, callback) => {
    pool.query(`INSERT INTO chat_log (messages) VALUES ('${data.message}')`, (err, response) => {
      callback(err, response);
    })
  },
  updateChatroomMessages: (data, callback) => {
    pool.query(``, (err, response) => {
      callback(err, response);
    })
  },
  getChatroomMessages: (data, callback) => {
    pool.query(``, (err, response) => {
      callback(err, response);
    })
  },
  deleteChatroom: (data, callback) => {
    pool.query(``, (err, response) => {
      callback(err, response);
    })
  },




  //matches queries
  //Confirmed with postman
  getAllConfirmedMatches: (data, callback) => {
    pool.query(`SELECT * FROM dog_matches JOIN dog_details ON dog_matches.dog1_id = dog_details.dog_id JOIN dog_details AS match_dog ON dog_matches.dog2_id = match_dog.dog_id WHERE (((dog_details.owner_name = '${data.owner_name}' AND dog_details.dog_name = '${data.dog_name}') OR (match_dog.owner_name = '${data.owner_name}' AND match_dog.dog_name = '${data.dog_name}')) AND accepted = 'true');`, (err, response) => {
      callback(err, response);
    })
  },

  //Confirmed with postman
  getAllPendingMatches: (data,  callback) => {
    pool.query(`SELECT * FROM dog_matches JOIN dog_details ON dog_matches.dog1_id = dog_details.dog_id JOIN dog_details AS match_dog ON dog_matches.dog2_id = match_dog.dog_id WHERE (((dog_details.owner_name = '${data.owner_name}' AND dog_details.dog_name = '${data.dog_name}') OR (match_dog.owner_name = '${data.owner_name}' AND match_dog.dog_name = '${data.dog_name}')) AND accepted = 'false')`, (err, response) => {
      callback(err, response);
    })
  },
  getOneMatch: (data, callback) => {
    pool.query(`SELECT * FROM dog_matches JOIN dog_details ON dog_matches.dog1_id = dog_details.dog_id JOIN dog_details AS match_dog ON dog_matches.dog2_id = match_dog.dog_id WHERE (((dog_details.owner_name = '${data.owner1_name}' AND dog_details.dog_name = '${data.dog1_name}') OR (match_dog.owner_name = '${data.owner1_name}' AND match_dog.dog_name = '${data.dog1_name}')) AND ((dog_details.owner_name = '${data.owner2_name}' AND dog_details.dog_name = '${data.dog2_name}') OR (match_dog.owner_name = '${data.owner2_name}' AND match_dog.dog_name = '${data.dog2_name}')))`, (err, response) => {
      callback(err, response);
    })
  },
  addAMatch: (data, callback) => { //*********************** */
    pool.query(`INSERT INTO dog_matches (dog1_id, dog2_id, accepted) VALUES ('${data.dog1_id}', '${data.dog2_id}', 'false')`, (err, response) => { //use a join statement to get the dog_id by joining on the names with the dog_description table
      callback(err, response);
    })
  },
  updateMatch: (data, callback) => { //*************************** */
    pool.query(`UPDATE dog_matches SET accepted = true FROM dog_matches JOIN dog_details ON dog_matches.dog1_id = dog_details.dog_id JOIN dog_details AS match_dog ON dog_matches.dog2_id = match_dog.dog_id WHERE (((dog_details.owner_name = '${data.owner1_name}' AND dog_details.dog_name = '${data.dog1_name}') OR (match_dog.owner_name = '${data.owner1_name}' AND match_dog.dog_name = '${data.dog1_name}')) AND ((dog_details.owner_name = '${data.owner2_name}' AND dog_details.dog_name = '${data.dog2_name}') OR (match_dog.owner_name = '${data.owner2_name}' AND match_dog.dog_name = '${data.dog2_name}')))`, (err, response) => {
      callback(err, response);
    })
  },
  deleteAMatch: (data, callback) => {  //******************************* */
    pool.query(`DELETE FROM matches JOIN dog_details ON dog_matches.dog1_id = dog_details.dog_id JOIN dog_details AS match_dog ON dog_matches.dog2_id = match_dog.dog_id WHERE (((dog_details.owner_name = '${data.owner1_name}' AND dog_details.dog_name = '${data.dog1_name}') OR (match_dog.owner_name = '${data.owner1_name}' AND match_dog.dog_name = '${data.dog1_name}')) AND ((dog_details.owner_name = '${data.owner2_name}' AND dog_details.dog_name = '${data.dog2_name}') OR (match_dog.owner_name = '${data.owner2_name}' AND match_dog.dog_name = '${data.dog2_name}')))`, (err, response) => { //use a join statement to get the dog_id by joining on the names with the dog_description table
      callback(err, response);
    })
  },




  //dog info queries *******************************************
  getUnmatched: (data, callback) => {
    pool.query(`SELECT * FROM dog_details JOIN dog_matches ON dog_matches.dog1_id = dog_details.dog_id JOIN dog_details AS match_dog ON dog_matches.dog2_id = match_dog.dog_id WHERE (((dog_details.owner_name = '${data.owner1_name}' AND dog_details.dog_name = '${data.dog1_name}') OR (match_dog.owner_name = '${data.owner1_name}' AND match_dog.dog_name = '${data.dog1_name}')) AND ((dog_details.owner_name != '${data.owner2_name}' AND dog_details.dog_name != '${data.dog2_name}') OR (match_dog.owner_name != '${data.owner2_name}' AND match_dog.dog_name != '${data.dog2_name}')))`, (err, response) => {
      if(err) {
        console.log(err);
      } else {
        callback(err, response);
      }
    })
  },
  //confirmed working with postman
  getDogDescription: (data, callback) => {
    pool.query(`SELECT * FROM dog_details WHERE owner_name = '${data.owner_name}' AND dog_name = '${data.dog_name}'`, (err, response) => {
      callback(err, response);
    });
  },
  //Confirmed with postman
  editDogDescription: (data, params, callback) => {
      pool.query(`UPDATE dog_details SET size = '${data.size}', personality = '${data.personality}', description = '${data.description}', photos = '${JSON.stringify(data.photos)}', location = '${data.location}' WHERE owner_name = '${params.owner_name}' AND dog_name = '${params.dog_name}'`, (err, response) => {
        callback(err, response);
      });
  },
  //Confirmed with postman
  postDogDescription: (data, callback) => {
    pool.query(`INSERT INTO dog_details (owner_name, dog_name, breed, size, personality, description, photos, location) VALUES ('${data.owner_name}', '${data.dog_name}', '${data.breed}', '${data.size}', '${data.personality}', '${data.description}', '${JSON.stringify(data.photos)}', '${data.location}')`, (err, response) => {
      callback(err, response);
    });
  },
};
