var mysql = require('mysql');
var db = require('./db');

//creates a mysql connection
var connection = mysql.createConnection(db.connection);

//creates the database
connection.query('DROP DATABASE IF EXISTS `' + db.database + '`;');

connection.query('CREATE DATABASE `' + db.database + '`;');

connection.query('USE ' + db.database + ';');

//creates the tables
connection.query(
  '\
CREATE TABLE users (\
    `Username` varchar(36) NOT NULL UNIQUE  ,\
    `firstname` varchar(36) NOT NULL,\
    `lastname` varchar(36) NOT NULL,\
    `birthday` date DEFAULT NULL,\
    `address` varchar(236) NOT NULL,\
    `contactnum` varchar(20) NOT NULL,\
    `email` varchar(36) NOT NULL UNIQUE,\
    `password` varchar(255) NOT NULL,\
    `icon_url` varchar(255) DEFAULT NULL,\
    `icon_abspath`varchar(255) DEFAULT NULL,\
    `icon_width` varchar(36) DEFAULT NULL,\
    `icon_height` varchar(36) DEFAULT NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL,\
    PRIMARY KEY(Username, email)\
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;'
);

connection.query(
  '\
CREATE TABLE shelters (\
    `Username` varchar(52) NOT NULL UNIQUE ,\
    `shelter_name` varchar(52) NOT NULL,\
    `address` varchar(236) NOT NULL,\
    `contactnum` varchar(20) NOT NULL,\
    `email` varchar(36) NOT NULL UNIQUE,\
    `password` varchar(255) NOT NULL,\
    `icon_url` varchar(255) DEFAULT NULL,\
    `icon_abspath`varchar(255) DEFAULT NULL,\
    `icon_width` varchar(36) DEFAULT NULL,\
    `icon_height` varchar(36) DEFAULT NULL,\
    `file_path` varchar(255) NOT NULL,\
    `absfile_path` varchar(255) NOT NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL,\
    CONSTRAINT PRIMARY KEY(Username, email)\
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1;'
);

connection.query(
  '\
CREATE TABLE pets_of_shelters (\
    `name` varchar(52) NOT NULL,\
    `kind` enum("DOG", "CAT", "BIRD", "OTHERS") NOT NULL,\
    `breed` varchar(36) NOT NULL,\
    `sex` enum("MALE", "FEMALE") NOT NULL,\
    `birthday` varchar(36) NOT NULL,\
    `description` varchar(200) DEFAULT NULL,\
    `status` enum("DATES", "ADOPT", "BOTH") NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL,\
    `uuid` varchar(36) NOT NULL PRIMARY KEY,\
    `url` varchar(255) DEFAULT NULL,\
    `abspath` varchar(255) DEFAULT NULL,\
    `width` varchar(36) DEFAULT NULL,\
    `height` varchar(36) DEFAULT NULL,\
    `shelter_Username` varchar(52) NOT NULL,\
    CONSTRAINT pets_of_shelters_users_fk FOREIGN KEY (shelter_Username)\
    REFERENCES shelters(Username)\
    ON DELETE CASCADE\
    ON UPDATE CASCADE\
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;'
);

connection.query(
  '\
CREATE TABLE pets_of_users (\
    `name` varchar(52) NOT NULL,\
    `kind` enum("DOG", "CAT", "BIRD", "OTHERS") NOT NULL,\
    `breed` varchar(36) NOT NULL,\
    `sex` enum("MALE", "FEMALE") NOT NULL,\
    `birthday` date DEFAULT NULL,\
    `description` varchar(200) DEFAULT NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL,\
    `uuid` varchar(36) NOT NULL PRIMARY KEY,\
    `url` varchar(255) DEFAULT NULL,\
    `abspath` varchar(255) DEFAULT NULL,\
    `width` varchar(36) DEFAULT NULL,\
    `height` varchar(36) DEFAULT NULL,\
    `user_Username` varchar(36) NOT NULL,\
    CONSTRAINT pets_of_users_fk FOREIGN KEY (user_Username)\
    REFERENCES users(Username)\
    ON DELETE CASCADE\
    ON UPDATE CASCADE\
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1;'
);

connection.query(
  '\
CREATE TABLE adopts(\
    `user_Username` varchar(36) NOT NULL,\
    `pet_uuid` varchar(36) NOT NULL,\
    `adopt_uuid` varchar(36) NOT NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL,\
    CONSTRAINT adopts_users_fk FOREIGN KEY (user_Username)\
    REFERENCES users(Username)\
    ON DELETE CASCADE\
    ON UPDATE CASCADE,\
    CONSTRAINT adopts_pets_of_shelters_fk FOREIGN KEY (pet_uuid)\
    REFERENCES pets_of_shelters(uuid)\
    ON DELETE CASCADE\
    ON UPDATE CASCADE\
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1;'
);

//SELECT * FROM;
connection.query(
  '\
CREATE TABLE dates(\
    `user_Username` varchar(36) NOT NULL,\
    `pet_uuid` varchar(36) NOT NULL,\
    `status` enum("PENDING", "APPROVED", "REJECTED") NOT NULL,\
    `dates_uuid` varchar(36) NOT NULL PRIMARY KEY,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL,\
    CONSTRAINT dates_users_fk FOREIGN KEY (user_Username)\
    REFERENCES users(Username)\
    ON DELETE CASCADE\
    ON UPDATE CASCADE,\
    CONSTRAINT dates_pets_of_shelters_fk FOREIGN KEY (pet_uuid)\
    REFERENCES pets_of_shelters(uuid)\
    ON DELETE CASCADE\
    ON UPDATE CASCADE\
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;'
);

connection.query(
  '\
    CREATE TABLE posts (\
    `Posted_by` varchar(52) NOT NULL,\
    `post_title` varchar(255) NOT NULL,\
    `text_post` TEXT NOT NULL,\
    `votes` int (6) NOT NULL,\
    `comments` int(6) NOT NULL,\
    `image_urlpath` varchar(255) UNIQUE DEFAULT NULL,\
    `img_abspath` varchar(255) UNIQUE DEFAULT NULL,\
    `post_uuid` varchar(36) UNIQUE PRIMARY KEY NOT NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL\
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;'
);

connection.query(
  '\
CREATE TABLE votes_for_posts(\
    `voted_by` varchar(52) NOT NULL,\
    `post_uuid` varchar(36) NOT NULL,\
    CONSTRAINT votes_for_posts_fk FOREIGN KEY(post_uuid)\
    REFERENCES posts(post_uuid)\
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;'
);

connection.query(
  '\
CREATE TABLE comments_on_posts (\
    `comment_title` varchar(36) NOT NULL,\
    `comment_uuid` varchar(36) NOT NULL UNIQUE PRIMARY KEY,\
    `commented_by` varchar(52) NOT NULL,\
    `comment_body` varchar(255) NOT NULL,\
    `votes` int (6) NOT NULL,\
    `img_abspath` varchar(255) UNIQUE DEFAULT NULL,\
    `image_urlpath` varchar(255) UNIQUE DEFAULT NULL,\
    `created_at` datetime NOT NULL,\
    `updated_at` datetime NOT NULL,\
    `post_uuid` varchar(36) NOT NULL,\
    CONSTRAINT comments_on_post_fk FOREIGN KEY(post_uuid)\
    REFERENCES posts(post_uuid) \
    ON DELETE CASCADE\
    ON UPDATE CASCADE\
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;'
);

connection.query(
  '\
CREATE TABLE votes_for_comments(\
    `voted_by` varchar(52) NOT NULL,\
    `comment_uuid` varchar(36) NOT NULL,\
    CONSTRAINT votes_for_comments_fk FOREIGN KEY(comment_uuid)\
    REFERENCES comments_on_posts(comment_uuid)\
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;'
);

connection.query(
  '\
CREATE TABLE rescue (\
    `rescue_uuid` varchar(36) NOT NULL UNIQUE PRIMARY KEY,\
    `rescue_body` TEXT NOT NULL,\
    `rescue_abspath` varchar(255) UNIQUE DEFAULT NULL,\
    `rescue_imgurl` varchar(255) UNIQUE DEFAULT NULL,\
    `date_submitted` datetime NOT NULL,\
    `updated_on` datetime NOT NULL,\
    `contactnum_sender` int(11) NOT NULL,\
    `email_sender` varchar(36) NOT NULL,\
    `address_sender` varchar(236) NOT NULL,\
    `sender_Username` varchar(52) NOT NULL,\
    CONSTRAINT rescue_fk FOREIGN KEY(sender_Username)\
    REFERENCES users(Username)\
    ON DELETE CASCADE\
    ON UPDATE CASCADE\
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1;'
);

connection.query(
  '\
CREATE TABLE notifications (\
    `notif_id` INT NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,\
    `notif_for` varchar(36) NOT NULL,\
    `notif_message` varchar(255) NOT NULL,\
    `notif_url` varchar(255)  NOT NULL,\
    `date_created` datetime NOT NULL,\
    CONSTRAINT notifications_fk FOREIGN KEY(notif_for)\
    REFERENCES users(Username)\
    ON DELETE CASCADE\
    ON UPDATE CASCADE\
    ) ENGINE=InnoDB AUTO_INCREMENT=1  DEFAULT CHARSET=latin1;'
);

connection.query(
  '\
DELETE FROM notifications WHERE date_created < (CURDATE() - INTERVAL 15 DAY);'
);

connection.end();

console.log('Database configuration done!');

module.exports = connection;
