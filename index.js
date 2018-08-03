const github = require('./github');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/githubScrap');

github.initFetch();
