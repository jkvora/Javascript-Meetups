const chalk = require('chalk');
const fs = require('fs');
const CLI = require('clui');
const Spinner = CLI.Spinner;

const inquirer = require('inquirer');
inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

const filePath = './meetup.json';
var lstmeetups = require(filePath);

searchField = fieldType => {
  return function searchData(answers, input) {
    return new Promise(function(resolve, reject) {
      var lstSearchItems = lstmeetups.map(item => {
        return item[fieldType] || '';
      });

      if (input) {
        lstSearchItems = lstSearchItems.filter(item => {
          return typeof item == 'string' && item.indexOf(input) != -1;
        });
      }

      resolve([...new Set(lstSearchItems)]);
    });
  };
};

publishMeetup = newMeetup => {
  const status = new Spinner('Publishing to store.....');
  status.start();
  lstmeetups.push(newMeetup);
  try {
    fs.writeFileSync(
      __dirname + '/' + filePath,
      JSON.stringify(lstmeetups),
      'utf-8'
    );
    status.message('Creating markdown files....');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  askMeetupDetails: () => {
    return inquirer
      .prompt([
        {
          type: 'autocomplete',
          name: 'name',
          message: 'Enter Name:',
          suggestOnly: true,
          source: searchField('name'),
          pageSize: 4,
          validate: function(val) {
            return val
              ? true
              : 'Type Full text here or Press Tab to autocomplete';
          }
        },
        {
          type: 'input',
          name: 'talk',
          message: 'Enter Title of Talk:',
          pageSize: 4,
          validate: function(val) {
            return val
              ? true
              : 'Type Full text here or Press Tab to autocomplete';
          }
        },
        {
          type: 'autocomplete',
          name: 'resource',
          message: 'Enter Resource link (ppt,github link):',
          suggestOnly: true,
          source: searchField('resource'),
          pageSize: 4,
          validate: function(val) {
            return val
              ? true
              : 'Type Full text here or Press Tab to autocomplete';
          }
        },
        {
          type: 'autocomplete',
          name: 'twitter',
          message: 'Enter Twitter handle:',
          suggestOnly: true,
          source: searchField('twitter'),
          pageSize: 4
        },
        {
          type: 'autocomplete',
          name: 'city',
          message: 'Enter City:',
          suggestOnly: true,
          source: searchField('city'),
          pageSize: 4,
          validate: function(val) {
            return val
              ? true
              : 'Type Full text here or Press Tab to autocomplete';
          }
        },
        {
          type: 'autocomplete',
          name: 'meetup',
          message: 'Enter Meetup Group:',
          suggestOnly: true,
          source: searchField('meetup'),
          pageSize: 4,
          validate: function(val) {
            return val
              ? true
              : 'Type Full text here or Press Tab to autocomplete';
          }
        }
      ])
      .then(function(newMeetup) {
        console.log(chalk.green(JSON.stringify(newMeetup, null, 2)));

        inquirer
          .prompt({
            name: 'publish',
            type: 'confirm',
            message: 'Publish it?'
          })
          .then(function(answers) {
            if (answers.publish) {
              publishMeetup(newMeetup);
            } else {
              console.log('Do not publish');
            }
          });
      });
  }
};
