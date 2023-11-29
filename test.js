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
console.log('Length:\nJSON(No newline):',JSON.stringify(configObject).length,'MicroConf:',_.length,'\nBenchmark:');
function timer(fn,count=100,...args) {
    let total = 0,totalVelocity=0;var prev = 0;
    for(let i=0;i<count;i++) {
        _=Bun.nanoseconds();
        fn(...args);
        _=Bun.nanoseconds()-_;
        total+=_;
        if(prev==0) prev=_
        totalVelocity+=_-prev;
        prev=_;
    }
    console.log(fn.name,'took',(total/1000/count).toFixed(count.toString().split("0").length - 1),'us(average),',count,'times, average velocity:',(totalVelocity/1000/count).toFixed(count.toString().split("0").length - 1));
}
const jsonString = JSON.stringify(configObject)
function jsonStringify() {
    JSON.stringify(configObject);
}
function microconfStringify() {
    stringify(configObject);
}
function jsonParse() {
    JSON.parse(jsonString);
}
function microconfParse() {
    parse(_);
}
timer(jsonStringify,     1000000);
timer(microconfStringify,1000000);
timer(jsonParse,         1000000);
timer(microconfParse,    1000000);