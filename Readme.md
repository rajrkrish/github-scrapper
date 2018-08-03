# Fetching user data from github using github v3 api

Refer here for api info: https://developer.github.com/v3/

Imported following data

    1) name: user's name
    2) url: user's github page url
    3) followers: url to fetch followers list
    4) followers_count: number of people following this user
    5) repository: list of repos owned by the user
        i) name: name of the repo
        ii) url: link to the repo
        iii) stars: number of people stared the repo
        iv) language: predominant language
        v) languages_url: link to fetch all the languages used in the project
         

## 1) Software Requirements
1) nodejs   -   8.11.2
2) mongodb  -   3.6.4


## 2) Configuration

Refer: config/default.json

1) token

    Grab a Oauth token from your github account. You can generate one here. https://github.com/settings/tokens

2) batch_size

    Number of user data to fetch from the api 'simultaneously'. Number between 5 - 10 seems to work. More than that, the api throws 403 error.



## 3) Deployment

1) Start mongodb server

2) Open up the terminal in the project folder and run the following commands

        npm i
        npm run start


