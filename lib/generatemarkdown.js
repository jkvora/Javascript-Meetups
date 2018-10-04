const json2md = require('json2md');
var fs = require('fs');
var allmeetups = require('./meetup.json');

run = () => {
  var cities = [];
  for (i = 0; i < allmeetups.length; i++) {
    if (cities[allmeetups[i].city]) {
      cities[allmeetups[i].city].push(allmeetups[i]);
    } else {
      cities[allmeetups[i].city] = [];
      cities[allmeetups[i].city].push(allmeetups[i]);
    }
  }

  let finalSet = {};
  for (let city in cities) {
    let meetup_city = [...cities[city]];
    var meetups = {};
    for (i = 0; i < meetup_city.length; i++) {
      if (meetups[meetup_city[i].meetup]) {
        meetups[meetup_city[i].meetup].push(meetup_city[i]);
      } else {
        meetups[meetup_city[i].meetup] = [];
        meetups[meetup_city[i].meetup].push(meetup_city[i]);
      }
    }
    finalSet[city] = meetups;
    //cities[city]=meetups;
  }

  console.log(finalSet);

  generateFolders(finalSet);
};

generateFolders = lstMeetups => {
  for (let city in lstMeetups) {
    makeDirectory('Meetup/' + city);

    for (let event in lstMeetups[city]) {
      makeDirectory('Meetup/' + city + '/' + event);

      for (let k = 0; k < lstMeetups[city][event].length; k++) {
        var mdchunk = json2md([
          { h1: lstMeetups[city][event][k].talk },
          { blockquote: lstMeetups[city][event][k].name },
          {
            ul: [
              'Twitter:' + lstMeetups[city][event][k].twitter,
              'Resource :' + lstMeetups[city][event][k].resource
            ]
          }
        ]);
        console.log(mdchunk);
        fs.writeFileSync(
          'Meetup/' +
          city +
          '/' +
          event +
          '/' +
          lstMeetups[city][event][k].talk +
          '.md',
          mdchunk,
          'utf-8'
        );
      }
    }
  }
};

makeDirectory = path => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, 0766, function (err) {
      if (err) {
        console.log(err);
        response.send("ERROR! Can't make the directory! \n");
      }
    });
  }
};

run();
