const lang = {};
lang.de = require('./lang_de.json');

export function getText(key, locale = 'de')  { return  lang[locale][key] || key }

