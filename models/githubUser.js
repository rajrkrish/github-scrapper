const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const githubUserSchema = new Schema({
    name:  String,
    url: String,
    followers:   String,
    followers_count: Number,
    repository:[{
        name:  String,
        url: String,
        stars: Number,
        language: String,
        languages_url: String
    }]
});

const GithubUser = mongoose.model('GithubUser', githubUserSchema);

module.exports =  GithubUser;