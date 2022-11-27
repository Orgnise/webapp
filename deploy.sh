#!/bin/bash

heroku git:remote -a react-kanban-01           
git subtree push --prefix server  heroku master

heroku git:remote -a kanban-client-app
git push heroku master
