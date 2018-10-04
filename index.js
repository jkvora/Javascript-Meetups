const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const meetups = require('./lib/addtalks');

clear();
console.log(
  chalk.yellow(figlet.textSync('JS-Meetup', { horizontalLayout: 'full' }))
);

run = async () => {
  await meetups.askMeetupDetails();
};

run();
