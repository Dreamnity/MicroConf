const {stringify,parse} = require('.');
const configObject = {
    server: {
      port: 8080,
      host: 'localhost',
      database: {
        url: 'mongodb://localhost:27017|',
        name: 'myDatabase',
      },
    },
    logging: {
      level: 'info',
      file: 'logs/app.log',
    },
    versions: process.versions
  };
console.log(_=stringify(configObject));
//console.log(parse('jsaghjfh%e*sj,hello world::123,random stuff:,likes minecraft:true,save:(level:7)',true));
console.log(parse(_,true))