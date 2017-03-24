const url = require('url');

const params = url.parse("postgres://uaizfakfjcymdm:a81eaeaa893f4ccc73462c4427e09cdee81a1b914bf714fa31f5a9560140d7db@ec2-54-243-185-123.compute-1.amazonaws.com:5432/de7fbptf1m733l");
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
};

console.log("\n\nCONFIG: ", config);


module.exports = config;
