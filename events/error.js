module.exports = (client, error) => {
  if (error.error.code == 'ENOTFOUND') {
    console.log(`ENOTFOUND, Unable to get address info: ${error.message} \n`); //boards or ika-search might be down
    return console.log(error);
  }
  if (error.error.code == 'ECONNRESET') {
    return console.log('ECONNRESET, Connection reset');
  }
  else {
    return console.error(error);
  }
};
