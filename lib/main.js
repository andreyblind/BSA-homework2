var config = require('./config.js');
var toDoApp = require('./baseApp.js');
var handlers = require('./handler.js');
toDoApp.init(config,handlers);
