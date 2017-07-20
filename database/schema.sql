DROP DATABASE IF EXISTS fostr;
CREATE DATABASE fostr;
USE fostr;

CREATE TABLE users (
    `Username` varchar(36) NOT NULL UNIQUE,
    `firstname` varchar(36) NOT NULL,
    `lastname` varchar(36) NOT NULL,
    `birthday` varchar(36) NOT NULL,
    `address` varchar(236) NOT NULL,
    `contactnum` int(11) NOT NULL,
    `email` varchar(36) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `icon_url` varchar(255) DEFAULT NULL,
    `icon_width` varchar(36) DEFAULT NULL,
    `icon_height` varchar(36) DEFAULT NULL,    
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY(Username, email)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE shelters (
    `Username` varchar(52) NOT NULL UNIQUE,
    `shelter_name` varchar(52) NOT NULL,
    `address` varchar(236) NOT NULL,
    `contactnum` int(11) NOT NULL,
    `email` varchar(36) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `icon_url` varchar(255) DEFAULT NULL,
    `icon_width` varchar(36) DEFAULT NULL,
    `icon_height` varchar(36) DEFAULT NULL,
    `file_path` varchar(255) NOT NULL,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    CONSTRAINT PRIMARY KEY(Username, email)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE pets_of_shelters (
    `name` varchar(52) NOT NULL,
    `kind` enum("DOG", "CAT", "BIRD", "OTHERS") NOT NULL,
    `breed` varchar(36) NOT NULL,
    `sex` enum("MALE", "FEMALE") NOT NULL,
    `birthday` varchar(36) NOT NULL,
    `status` enum("DATES", "ADOPT", "BOTH") NULL,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    `uuid` varchar(36) NOT NULL PRIMARY KEY,
    `url` varchar(255) DEFAULT NULL,
    `width` varchar(36) DEFAULT NULL,
    `height` varchar(36) DEFAULT NULL,
    `shelter_Username` varchar(52) NOT NULL,
    CONSTRAINT pets_of_shelters_users_fk FOREIGN KEY (shelter_Username)
    REFERENCES shelters(Username)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE pets_of_users (
    `name` varchar(52) NOT NULL,
    `kind` enum("DOG", "CAT", "BIRD", "OTHERS") NOT NULL,
    `breed` varchar(36) NOT NULL,
    `sex` enum("MALE", "FEMALE") NOT NULL,
    `birthday` varchar(36) NOT NULL,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    `uuid` varchar(36) NOT NULL PRIMARY KEY,
    `url` varchar(255) DEFAULT NULL,
    `width` varchar(36) DEFAULT NULL,
    `height` varchaR(36) DEFAULT NULL,
    `user_Username` varchar(36) NOT NULL,
    CONSTRAINT pets_of_users_fk FOREIGN KEY (user_Username)
    REFERENCES users(Username)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE posts (
    `post_id` Integer UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `Posted_by` varchar(52) NOT NULL,
    `post_title` varchar(52) NOT NULL,
    `text_post` varchar(305) NOT NULL,
    `attachedfile_path` varchar(255) UNIQUE,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE comments (
    `comment_id` Integer NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
    `commented_by` varchar(52) NOT NULL,
    `comment_body` varchar(305) NOT NULL,
    `attachedfile_path` varchar(255) UNIQUE,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    `post_id` Integer NOT NULL,
    CONSTRAINT comments_on_post_fk FOREIGN KEY(post_id)
    REFERENCES posts(post_id) 
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;