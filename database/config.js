var mysql = require('mysql');
var db = require('./db');

//creates a mysql connection
var connection = mysql.createConnection(db.connection);

//creates the database
connection.query('DROP DATABASE IF EXISTS `' + db.database + '`;')
connection.query('CREATE DATABASE `' + db.database + '`;');

connection.query('USE `' + db.database + '`;');

//creates the tables
connection.query('\
CREATE TABLE users (\
    `Username` varchar(36) NOT NULL UNIQUE,\
    `firstname` varchar(36) NOT NULL,\
    `lastname` varchar(36) NOT NULL,\
    `birthday` DATE NOT NULL,\
    `address` varchar(236) NOT NULL,\
    `contactnum` int(11) NOT NULL,\
    `email` varchar(36) NOT NULL UNIQUE,\
    `password` varchar(255) NOT NULL,\
    `petsOwned` int (11) NOT NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL,\
    PRIMARY KEY(Username, email)\
    ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;'
    );

connection.query('\
CREATE TABLE shelters (\
    `Username` varchar(52) NOT NULL UNIQUE,\
    `shelter_name` varchar(52) NOT NULL,\
    `address` varchar(236) NOT NULL,\
    `contactnum` int(11) NOT NULL,\
    `email` varchar(36) NOT NULL UNIQUE,\
    `password` varchar(255) NOT NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL,\
    CONSTRAINT PRIMARY KEY(Username, email)\
    ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;'
    );

connection.query('\
    CREATE TABLE pets_of_shelters (\
    `pet_id` INT (11) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
    `name` varchar(52) NOT NULL,\
    `kind` enum("DOG", "CAT", "BIRD", "OTHERS") NOT NULL,\
    `breed` varchar(36) NOT NULL,\
    `sex` enum("MALE", "FEMALE") NOT NULL,\
    `birthday` DATE NOT NULL,\
    `status` enum("DATES", "ADOPT", "BOTH") NOT NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL,\
    `shelter_Username` varchar(52) NOT NULL,\
    INDEX par_ind (shelter_Username),\
    CONSTRAINT fk_shelters FOREIGN KEY (shelter_Username)\
    REFERENCES shelters(Username)\
    ON DELETE CASCADE\
    ON UPDATE CASCADE\
    ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;'
    );

connection.query('\
CREATE TABLE pets_of_users (\
    `pet_id` INT (11) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
    `name` varchar(52) NOT NULL,\
    `kind` enum("DOG", "CAT", "BIRD", "OTHERS") NOT NULL,\
    `breed` varchar(36) NOT NULL,\
    `sex` enum("MALE", "FEMALE") NOT NULL,\
    `birthday` DATE NOT NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL,\
    `user_Username` varchar(36) NOT NULL,\
    INDEX par_ind (user_Username),\
    CONSTRAINT fk_users FOREIGN KEY (user_Username)\
    REFERENCES users(Username)\
    ON DELETE CASCADE\
    ON UPDATE CASCADE\
    ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;'
    );

connection.end();

console.log('Created tables!');

 module.exports = connection;