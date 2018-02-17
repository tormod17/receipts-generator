const lang = {};
lang.de = require('./lang_de.json');

exports.getText = (key, locale = 'de') => lang[locale][key] || key 

