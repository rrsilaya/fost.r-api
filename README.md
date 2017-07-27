<h1 align="center">
  <img alt="fost.r" src="./assets/logo2-dblue.png" height="256px" />
  <br />
  fost.r API
  <br />
  <img src="https://img.shields.io/badge/status-development-yellow.svg" />
  <img src="https://img.shields.io/badge/node-v7.8.0-green.svg" />
  <img src="https://img.shields.io/badge/express-v4.15.3-green.svg" />
  <img src="https://img.shields.io/badge/mysql-v2.13.0-green.svg" />
  <br />
</h1>
<h4 align="center">Raise the awareness on homeless animals because of neglect or abuse</h4>

### Table of Contents
- [Installation](#installation)
- [Routes](#routes)
- [Tables](#tables)
  * [`users`](#users)
  * [`shelters`](#shelters)
  * [`pets_of_users`](#pets_of_users)
  * [`pets_of_shelters`](#pets_of_shelters)
  * [`posts`](#posts)
  * [`comments_on_posts`](#comments_on_posts)
  * [`rescue`](#rescue)
- [Requests](#requests)
- [Responses](#responses)
- [Developers](#developers)
  * [API](#api)
  * [Client](#client)

### Installation
1. Install [NodeJS](https://nodejs.org/en/download/) and [MySQL](https://dev.mysql.com/downloads/installer/).
2. Install dependencies with `npm install`.
3. Configure database by editing `database/db.js` and `database\connection.js` with your MySQL credentials.
4. Create database with `node ./database/config.js`.
5. Populate with test data by running `npm populate`.
6. Start the server with `npm run devstart`.
7. Access the api through `http://localhost:3000/api/`.

### Routes

| Routes                                  | Method       | Remarks 
| --------------------------------------- | ------------ | ----------------------------------------------------------|
| `/`                                     | `GET`        | Displays message(temp)                                                |
| `/login/user`                           | `POST`       | Redirects to `/feed` if logged in                                     |
| `/login/shelter`                        | `POST`       | Redirects to `/feed` if logged in                                     |
| `/logout`                               | `GET`        | Redirects to `/` after user logged out                                |
| `/notifications`                        | `GET`        | View notifications                                                    |
| `/signup/user`                          | `POST`       | Redirects to `/feed` if logged in                                     |
| `/signup/shelter`                       | `POST`       | Redirects to `/feed` if logged in                                     |
| `/feed `                                | `GET`        | Displays message (temp)                                               |
| `/accounts/viewShelters`                | `GET`        | View all shelter accounts                                             |
| `/accounts/viewUsers`                   | `GET`        | View all user accounts                                                |
| `/accounts/MyAccount`                   | `GET`        | View own info                                                         |
| `/accounts/MyAccount`                   | `PUT`        | Update own info                                                       |
| `/accounts/MyAccount`                   | `DELETE`     | Delete own account                                                    |
| `/pets/viewAllPets`                     | `GET`        | View pets owned by either users or shelters(depending on the accountType logged in)|
| `/pets/:owner/viewShelterPets`          | `GET`        | View pets of owner                                                    |
| `/pets/:owner/viewUserPets`             | `GET`        | View pets of owner                                                    |
| `/pets/:owner/deleteAllUserPets`        | `DELETE`     | Delete all pets of a given user                                       |
| `/pets/:owner/deleteAllShelter`         | `DELETE`     | Delete all pets of a given shelter                                    |
| `/pets/myPets`                          | `POST`       | Add a pet to db                                                       |
| `/pets/myPets`                          | `GET`        | View own pets                                                         |
| `/pets/myPets`                          | `DELETE`     | Delete all owned pets                                                 |
| `/pets/:pet_uuid`                       | `GET`        | View specific pet                                                     |
| `/pets/:pet_uuid`                       | `PUT`        | Update info of a pet  (could be used for ADOPT and DATES, set status to ADOPT, DATES, OR BOTH)|
| `/pets/:pet_uuid`                       | `DELETE`     | Delete a single pet given the pet_uuid                                |
| `/community/ `                          | `GET`        | Displays all posts sorted by date                                     |
| `/community/addPost`                    | `POST`       | Add post                                                              |
| `/community/:post_uuid`                 | `GET`        | View a post given its uuid                                            |
| `/community/:post_uuid`                 | `PUT`        | Vote a post given its uuid                                            |
| `/community/:post_uuid`                 | `DELETE`     | Delete a post given its uuid (iff post is posted by the user itself)  |
| `/community/:post_uuid`                 | `POST`       | Add a comment                                                         |
| `/community/:user/viewPosts`            | `GET`        | View all posts of a user                                              |
| `/community/deleteAllMyPosts`           | `DELETE`     | Delete all posts of user                                              |
| `/community/:post_uuid/viewAllComments` | `GET`        | View all comments in the post                                      |
| `/community/:post_uuid/:comment_uuid`   | `GET`        | View a comment                                           |
| `/community/:post_uuid/:comment_uuid`   | `DELETE`     | Delete a comment                                           |
| `/community/:post_uuid/:comment_uuid`   | `PUT`        | Vote a comment                                                |
| `/rescue/`                              | `GET`        | View all requests                                                     |
| `/rescue/viewMyRequests`                | `GET`        | View all submitted requests                                           |
| `/rescue/:rescue_uuid`                  | `GET`        | View :rescue_uuid of logged in user                                   |
| `/rescue/:rescue_uuid`                  | `DELETE`     | Deletes :rescue_uuid of logged in user                                |
| `/rescue/:user/viewAllRequests`         | `GET`        | View all rescue requests from a user                                  |
| `/rescue/:rescue_uuid/deleteRequest`    | `GET`        | Delete a rescue request                                               |
| `/rescue/deleteAllMyRequests`           | `GET`        | Delete all rescue requests                                            |
| `/rescue/:rescue_uuid/viewRescueRequest`| `GET`        | View a rescue request                                             |
| `/rescue/submit_a_rescue_request`       | `POST`       | Submit a request for rescue                                           |
| `/*`                                    | `GET`        | Redirects to `/feed` if logged in, otherwise redirect to `/`          |

### Requests
Please take note of the capitalization. * is placed if it is **required**.


| Routes                      | Method | Requests |
| --------------------------- | ------ | ---------------------------------------------------------- |
| `/signup/user`              | `POST` | Username*, firstname*, lastname*, birthday*, address*, contactnum*, email*, password*, icon |
| `/signup/shelter`           | `POST` | Username*, shelter_name*, address*, contactnum*, email*, password*, file*, icon |
| `/login/user`               | `POST` | Username*, password*                                |
| `/login/shelter`            | `POST` | Username*, password*                                |
| `/pets/myPets`              | `POST` | name*, kind* (DOG, CAT, BIRD, OTHERS), breed*, sex*(MALE, FEMALE), birthday*               |
| `/accounts/MyAccount`       | `PUT`  | refer to *signup/_ route* depending on account type |
| `/pets/:pet_uuid`           | `PUT`  | refer to *pets/myPets route*                        |
| `/community/addPost`        | `POST` | post_title*, text_post*, photo                      |
| `/community/:post_uuid`     | `POST` | comment_body*, photo                                |
| `/rescue/submit_a_rescue_request`       | `POST` | rescue_body*, photo                     |

### Responses

| Routes                      | Method | Responses | 
| --------------------------- | ------ | ---------------------------------------------------------- |
| `/login/user`                           | `POST`       | `(200)` sends req.session.body.accountType |
| `/login/shelter`                        | `POST`       | `(200)` sends req.session.body.accountType |
| `/logout`                               | `GET`        | `(200)` sends null                         |
| `/notifications                         | `GET`        | `(204)` sends null                         |
| `/signup/user`                          | `POST`       | `(201)` json of newUser                    |
| `/signup/shelter`                       | `POST`       | `(201)` json of newShelter                 |
| `/feed `                                | `GET`        | `(200)`                                    |
| `/accounts/viewShelters`                | `GET`        | json of shelters                           |
| `/accounts/viewUsers`                   | `GET`        | json of users                              |
| `/accounts/MyAccount`                   | `GET`        | `(200)` json of own account's info         |
| `/accounts/MyAccount`                   | `PUT`        | `(201)` json of mysql query                |
| `/accounts/MyAccount`                   | `DELETE`     | `(204)` ends                               |
| `/pets/viewAllPets`                     | `GET`        | json of pets                               |
| `/pets/:owner/viewShelterPets`          | `GET`        | json of pets                               |
| `/pets/:owner/viewUserPets`             | `GET`        | json of pets                               |
| `/pets/:owner/deleteAllUserPets`        | `DELETE`     | `(204)` ends                               |
| `/pets/:owner/deleteAllShelter`         | `DELETE`     | `(204)` ends                               |
| `/pets/myPets`                          | `POST`       | `(201)` json of mysql query                |
| `/pets/myPets`                          | `GET`        | `(200)` json of owned pets                 |
| `/pets/myPets`                          | `DELETE`     | `(204)` ends                               |
| `/pets/:pet_uuid`                       | `GET`        | `(200)` json of pet's info                 |
| `/pets/:pet_uuid`                       | `PUT`        | `(201)` json of mysql query                |
| `/pets/:pet_uuid`                       | `DELETE`     | `(204)` ends                               |
| `/community/ `                          | `GET`        | `(200)` json of posts                      |
| `/community/addPost`                    | `POST`       | `(201)` json of post                       |
| `/community/:post_uuid`                 | `GET`        | `(200)` sends posts and comments           |
| `/community/:post_uuid`                 | `PUT`        | `(201)` json of mysql query                |
| `/community/:post_uuid`                 | `DELETE`     | `(204)` ends                               |
| `/community/:post_uuid`                 | `POST`       | `(201)` json of newComment                 |
| `/community/:user/viewPosts`            | `GET`        | `(200)` json of posts by :user             |
| `/community/deleteAllMyPosts`           | `DELETE`     | `(204)` ends                               |
| `/community/:post_uuid/viewAllComments` | `GET`        | `(200)` json of comments in :post_uuid     |
| `/community/:post_uuid/:comment_uuid`   | `GET`        | `(200)` json :comment_uuid in :post_uuid   |
| `/community/:post_uuid/:comment_uuid`   | `DELETE`     | `(204)` ends                               |
| `/community/:post_uuid/:comment_uuid`   | `PUT`        | `(201)` json of mysql query                |
| `/rescue/`                              | `GET`        | `(200)` json of requests (if shelter); redirects to /viewMyRequests (if user)        |
| `/rescue/viewMyRequests`                | `GET`        | `(200)` json of requests (only for users)  |
| `/rescue/:rescue_uuid`                  | `GET`        | `(200)` json of rescue                     |
| `/rescue/:rescue_uuid`                  | `DELETE`     | `(204)` ends                               |
| `/rescue/:user/viewAllRequests`         | `GET`        | `(200)` json of requests from :user (only for shelters)  |
| `/rescue/deleteAllMyRequests`           | `GET`        | `(204)` ends (only for users)              |
| `/rescue/:rescue_uuid/viewRescueRequest`| `GET`        | `(200)` json of rescue where rescue_uuid = :rescue_uuid  |
| `/rescue/submit_a_rescue_request`       | `POST`       | `(201)` json of newRescue                  |
### Tables
#### `users`

  Field       | Type         | Null | Key | Default | Extra |
 -------------|--------------|------|-----|---------|-------|
 `Username`   | varchar(36)  | NO   | PRI | NULL    |       |
 `firstname`  | varchar(36)  | NO   |     | NULL    |       |
 `lastname`   | varchar(36)  | NO   |     | NULL    |       |
 `birthday`   | varchar(36)  | NO   |     | NULL    |       |
 `address`    | varchar(236) | NO   |     | NULL    |       |
 `contactnum` | varchar(20)  | NO   |     | NULL    |       |
 `email`      | varchar(36)  | NO   | PRI | NULL    |       |
 `password`   | varchar(255) | NO   |     | NULL    |       |
 `icon_url`   | varchar(255) | YES  |     | NULL    |       |
 `icon_width` | varchar(36)  | YES  |     | NULL    |       |
 `icon_height`| varchar(36)  | YES  |     | NULL    |       |
 `created_at` | datetime     | NO   |     | NULL    |       |
 `updated_at` | datetime     | NO   |     | NULL    |       |

#### `shelters`
  Field      | Type         |Null| Key | Default | Extra  
  ---------- | ------------ | ---| --- | ------- | -----  
  `Username`   | varchar(36)  | NO | PRI |         |        
  `shelter_name`  | varchar(52)  | NO |     | NULL    |        
  `address`    | varchar(236) | NO |     | NULL    |        
  `contactnum` | varchar(20)  | NO |     | NULL    |        
  `email`      | varchar(36)  | NO | UNI | NULL    |        
  `password`   | varchar(255) | NO |     | NULL    |
  `icon_url`   | varchar(255) | YES|     | NULL    |
  `icon_width` | varchar(36)  | YES|     | NULL    |
  `icon_height`| varchar(36)  | YES|     | NULL    | 
  `file_path`  |varchar(255)  | NO |     | NULL    |       
  `created_at` | datetime     | NO |     | NULL    |        
  `updated_at` | datetime     | NO |     | NULL    |   

#### `pets_of_users`
  Field      | Type                                  |Null| Key | Default | Extra                
  ---------- | ------------------------------------- |----| --- | ------- | -------------------   
  `name`       | varchar(52)                           | NO |     | NULL    |                      
  `kind`   	   | enum("DOG", "CAT", "BIRD", "OTHERS")  | NO |     | NULL    |                      
  `breed`      | varchar(36)                           | NO |     | NULL    |                      
  `sex`        | enum("MALE", "FEMALE")                | NO |     | NULL    |                      
  `birthday`   | varchar(36)                           | NO |     | NULL    |                      
  `user_Username`   | varchar(36)                           | NO | MUL | NULL    |                      
  `created_at` | datetime                              | NO |     | NULL    |                      
  `updated_at` | datetime                              | NO |     | NULL    |
  `uuid`       | varchar(36)                           | NO | PRI | NULL    |
  `url`        | varchar(255)                          | YES|     | NULL    |
  `width`      | varchar(36)                           | YES|     | NULL    | 
  `height`     | varchar(36)                           | YES|     | NULL    |                        

#### `pets_of_shelters`
  Field      | Type                                  |Null| Key | Default | Extra                
  ---------- | ------------------------------------- | ---| --- | ------- | -------------------
  `name`       | varchar(52)                           | NO |     | NULL    |                      
  `kind`   	   | enum("DOG", "CAT", "BIRD", "OTHERS")  | NO |     | NULL    |                      
  `breed`      | varchar(36)                           | NO |     | NULL    |                      
  `sex`        | enum("MALE", "FEMALE")                | NO |     | NULL    |                      
  `birthday`   | varchar(36)                           | NO |     | NULL    |
  `status`     | enum("DATES", "ADOPT", "BOTH")        | YES|     | NULL    |                      
  `shelter_Username`   | varchar(52)                           | NO | MUL | NULL    |                      
  `created_at` | datetime                              | NO |     | NULL    |                      
  `updated_at` | datetime                              | NO |     | NULL    |                      
  `uuid`       | varchar(36)                           | NO | PRI | NULL    |
  `url`        | varchar(255)                          | YES|     | NULL    |
  `width`      | varchar(36)                           | YES|     | NULL    | 
  `height`     | varchar(36)                           | YES|     | NULL    |

#### `posts`
  Field         | Type                                  |Null| Key | Default | Extra                
  --------------| ------------------------------------- | ---| --- | ------- | -------------------
  `Posted_by`     | varchar(52)                           | NO | MUL | NULL    |                      
  `post_title`    | varchar(255)                          | NO |     | NULL    |                      
  `text_post`     | TEXT                                  | NO |     | NULL    |
  `votes`         | int(5)                                | NO |     | NULL    |                      
  `image_urlpath` | varchar(255)                          | YES| UNI | NULL    |                      
  `post_uuid`     | varchar(36)                           | NO | PRI | NULL    |                      
  `created_at`    | datetime                              | NO |     | NULL    |                      
  `updated_at`    | datetime                              | NO |     | NULL    |                      

#### `comments_on_posts`
  Field         | Type         | Null | Key | Default | Extra |
  --------------|--------------|------|-----|---------|-------|
  `comment_uuid`  | varchar(36)  | NO   | PRI | NULL    |       |
  `commented_by`  | varchar(52)  | NO   |     | NULL    |       |
  `comment_body`  | varchar(255) | NO   |     | NULL    |       |
  `votes`         | int(5)                                | NO |     | NULL    |
  `image_urlpath` | varchar(255) | YES  | UNI | NULL    |       |
  `created_at`    | datetime     | NO   |     | NULL    |       |
  `updated_at`    | datetime     | NO   |     | NULL    |       |
  `post_uuid`     | varchar(36)  | NO   | MUL | NULL    |       |


#### `rescue`
  Field             | Type         | Null | Key | Default | Extra |
 -------------------|--------------|------|-----|---------|-------|
  `rescue_uuid`       | varchar(36)  | NO   | PRI | NULL    |       |
  `rescue_body`       | varchar(255) | NO   |     | NULL    |       |
  `rescue_imgurl`     | varchar(255) | YES  | UNI | NULL    |       |
  `date_submitted`    | datetime     | NO   |     | NULL    |       |
  `updated_on`        | datetime     | NO   |     | NULL    |       |
  `contactnum_sender` | int(11)      | NO   |     | NULL    |       |
  `email_sender`      | varchar(36)  | NO   |     | NULL    |       |
  `address_sender`    | varchar(236) | NO   |     | NULL    |       |
  `sender_Username`   | varchar(52)  | NO   | MUL | NULL    |       |

### `notifications`

  Field         | Type         | Null | Key | Default | Extra          |
 ---------------|--------------|------|-----|---------|----------------|
  notif_id      | int(11)      | NO   | PRI | NULL    | auto_increment |
  notif_for     | varchar(36)  | NO   | MUL | NULL    |                |
  notif_message | varchar(255) | NO   |     | NULL    |                |
  notif_url     | varchar(255) | NO   |     | NULL    |                |
  date_created  | datetime     | NO   |     | NULL    |                |

### Developers
##### API
* Evangelista, Erlen Mae
* Somabes, Kia Mei

##### Client
* Gotis, Ciara Mae
* Silaya, Ralph Lawrence
