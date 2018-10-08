const json2md = require('json2md');
var fs = require('fs');
var allmeetups = require('./../db/meetup.json');

generateMarkdown = () => {
  var groupBycities = allmeetups.reduce((result, meetup) => {
    result[meetup.city] = (result[meetup.city] || []).concat(meetup);
    return result;
  }, []);

  for (let city in groupBycities) {
    groupBycities[city] = groupBycities[city].reduce((result, cityitem) => {
      result[cityitem.meetup] = (result[cityitem.meetup] || []).concat(
        cityitem
      );
      return result;
    }, {});
  }
  generateFolders(groupBycities);
};

generateFolders = lstMeetups => {
  for (let city in lstMeetups) {
    makeDirectory('meetups/' + city);

    for (let event in lstMeetups[city]) {
      makeDirectory('meetups/' + city + '/' + event);
      let mdchunk = '';
      for (let k = 0; k < lstMeetups[city][event].length; k++) {
        mdchunk =
          mdchunk +
          json2md([
            { h1: lstMeetups[city][event][k].talk },
            { blockquote: lstMeetups[city][event][k].name },
            {
              ul: [
                'Twitter:' + lstMeetups[city][event][k].twitter,
                'Resource :' + lstMeetups[city][event][k].resource
              ]
            }
          ]);
      }
      fs.writeFileSync(
        'meetups/' + city + '/' + event + '/' + 'talks.md',
        mdchunk,
        'utf-8'
      );
    }
  }
};

makeDirectory = path => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, 0766, function(err) {
      if (err) {
        console.log(err);
        response.send("ERROR! Can't make the directory! \n");
      }
    });
  }
};

generateMarkdown();
module.exports = generateMarkdown;
