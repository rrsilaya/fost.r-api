var mysql = require('mysql');
var db = require('./db');

//creates a mysql connection
var connection = mysql.createConnection(db.connection);

//creates the database
connection.query('CREATE DATABASE `' + db.database + '`;');
console.log('Created database!');

//creates the tables
connection.query('\
CREATE TABLE `' + db.database + '`.`' + db.users_table + '` (\
    `Username` varchar(36) NOT NULL UNIQUE PRIMARY KEY,\
    `firstname` varchar(36) NOT NULL,\
    `lastname` varchar(36) NOT NULL,\
    `birthday` DATE NOT NULL,\
    `address` varchar(236) NOT NULL,\
    `contactnum` int(11) NOT NULL,\
    `email` varchar(36) NOT NULL UNIQUE,\
    `password` varchar(255) NOT NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL\
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;'
    );

connection.query('\
CREATE TABLE `' + db.database + '`.`' + db.shelters_table + '` (\
    `Username` varchar(52) NOT NULL UNIQUE PRIMARY KEY,\
    `shelter_name` varchar(52) NOT NULL,\
    `address` varchar(236) NOT NULL,\
    `contactnum` int(11) NOT NULL,\
    `email` varchar(36) NOT NULL UNIQUE,\
    `password` varchar(255) NOT NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL\
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;'
    );

connection.query('\
    CREATE TABLE `' + db.database + '`.`' + db.posts_table + '` (\
    `post_id` Integer NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,\
    `Posted_by` varchar(52) NOT NULL,\
    `post_title` varchar(52) NOT NULL,\
    `text_post` varchar(305) NOT NULL,\
    `attachedfile_path` varchar(255) NOT NULL UNIQUE,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL\
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;'
    );
/*
connection.query('\
    CREATE TABLE `' + db.database + '`.`' + 'pets_of_users' + '` (\
    `pet_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
    `name` varchar(52) NOT NULL,\
    `kind` ENUM('DOG', 'CAT', 'BIRD', 'OTHERS'),\
    `breed` varchar(36) NOT NULL,\
    `sex` ENUM ('MALE', 'FEMALE'),\
    `birthday` DATE NOT NULL,\
    `username` varchar(36) DEFAULT NULL,\
    CONSTRAINT pets_username_shelters_fk FOREIGN KEY(username)\
    REFERENCES shelters(Username) ON DELETE SET NULL,\
    created_at datetime NOT NULL, \
    updated_at datetime NOT NULL\
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;'
    );

connection.query('\
    CREATE TABLE `' + db.database + '`.`' + 'pets_of_shelters' + '` (\
    `pet_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
    `name` varchar(52) NOT NULL,\
    `kind` ENUM('DOG', 'CAT', 'BIRD', 'OTHERS') NOT NULL,\
    `breed` varchar(36) NOT NULL,\
    `sex` ENUM ('MALE', 'FEMALE') NOT NULL,\
    `birthday` DATE NOT NULL,\
    `username` varchar(52) DEFAULT NULL,\
    CONSTRAINT pets_username_shelters_fk FOREIGN KEY(username)\
    REFERENCES shelters(Username) ON DELETE SET NULL,\
    created_at datetime NOT NULL, \
    updated_at datetime NOT NULL\
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;'
    );
*/

console.log('Created tables!');
connection.end();

 module.exports = connection;