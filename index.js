function stringifyCompactConfig(configObject) {
	function stringifyObject(obj) {
		let result = '';
		for (let key in obj) {
			if (typeof obj[key] === 'object') {
				result += `${key}(${stringifyObject(obj[key])}),`;
			} else {
				result += `${key}|${obj[key]
					.toString()
					.replace(/([\\\(\)|])/g, '\\$1')},`;
			}
		}
		return result.slice(0, -1); // Remove trailing comma
	}

	return stringifyObject(configObject);
}
const regexes = {
  value: /^(?<key>[^|\)\()]+)\|(?<value>[^\),]+)\,/,
  object: /^(?<key>[^|]+)\((?<object>[^\)]+|[^\)]+\))\),/
}
function parseCompactConfig(string) {
  var result = {};
  var compactString = (string+'').replace(/\\(.)/g,(a,b)=>'ESCAPED{'+Buffer.from(b).toString('hex')+'}');
  let count=20,match;
  if (typeof compactString !== 'string') throw new Error('Not a string.');
  //console.log('++Start',string)
  if(!compactString.endsWith(',')) compactString += ','
  while (compactString.length > 0 && count >= 0) {
    //console.log('  '+compactString)
    count--;
    match = compactString.match(regexes.value);
    compactString = compactString.replace(regexes.value, '');
    if (match) {
      count++;
      //console.log('++Value',match[0])
      //console.log(match);
      let value = match.groups.value.replace(/ESCAPED{([a-zA-Z0-8]{1,8})}/g, (a, b) => '\\' + Buffer.from(b, 'hex').toString());
      try {
        result[match.groups.key] = JSON.parse(value);
      } catch {
        result[match.groups.key] = value;
      }
      continue;
    }
    match = compactString.match(regexes.object);
    compactString = compactString.replace(regexes.object, '');
    if (match) {
      count++;
      //console.log(match[0])
      //console.log('++Recursing',match[0])
      result[match.groups.key] = parseCompactConfig(match.groups.object)
      continue;
    }
    compactString = compactString.slice(1)
  }
  //console.log('++Exit',string)
  if (count < 0) throw new Error('Infinite loop detected');
  return result
}

module.exports = {
  parse: parseCompactConfig,
  stringify: stringifyCompactConfig
}
/*
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
};
const compactConfigString = stringifyCompactConfig(configObject);
const parsed = parseCompactConfig(compactConfigString);
console.log(compactConfigString);
console.log(parsed);
//*/