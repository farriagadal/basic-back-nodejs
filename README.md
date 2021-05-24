# BASIC BACKEND

## FEATURES

* Basic auth api ready
* Mailer with templates works (Nodemailer)
* DB MYSQL
* Linter Airbnb

## RECOMMENDED REQUIREMENTS

* Node 12.18.4

## INSTALL DEPENDENCIES

npm install

## DEPLOY MYSQL & CREATE DB (DOCKER)

docker-compose up -d

## CREATE MODEL & MIGRATION (SEQUELIZE)

sequelize model:generate --name Room --attributes name:string,count:string,status:string

## MIGRATE CHANGES TO DB

sequelize db:migrate