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
| `/login/user`                           | `GET`        | Redirects to `/feed` if logged in                                     |
| `/login/shelter`                        | `GET`        | Redirects to `/feed` if logged in                                     |
| `/logout`                               | `GET`        | Redirects to `/` after user logged out                                |
| `/signup/user`                          | `GET`        | Redirects to `/feed` if logged in                                     |
| `/signup/shelter`                       | `GET`        | Redirects to `/feed` if logged in                                     |
| `/feed `                                | `GET`        | Displays message (temp)                                               |
| `/accounts/viewShelters`                | `GET`        | View all shelter accounts                                             |
| `/accounts/viewUsers`                   | `GET`        | View all user accounts                                                |
| `/accounts/MyAccount`                   | `GET`        | View own info                                                         |
| `/accounts/MyAccount`                   | `GET`        | Update own info                                                       |
| `/accounts/MyAccount`                   | `DELETE`     | Delete own account                                                    |
| `/pets/viewAllPets`                     | `GET`        | View pets owned by either users or shelters(depending on the accountType logged in)|
| `/pets/:owner/viewShelterPets`          | `GET`        | View pets of owner                                                    |
| `/pets/:owner/viewUserPets`             | `GET`        | View pets of owner                                                    |
| `/pets/:owner/deleteAllUserPets`        | `DELETE`     | Delete all pets of a given user                                       |
| `/pets/:owner/deleteAllShelter`         | `DELETE`     | Delete all pets of a given shelter                                    |
| `/pets/myPets`                          | `POST`       | Add a pet to db (for shelters)                                        |
| `/pets/myPets`                          | `GET`        | View own pets                                                         |
| `/pets/myPets`                          | `DELETE`     | Delete all owned pets                                                 |
| `/pets/:pet_uuid`                       | `GET`        | View specific pet                                                     |
| `/pets/:pet_uuid`                       | `PUT`        | Update info of a pet  (could be used for ADOPT and DATES, set status to ADOPT, DATES, OR BOTH)|
| `/pets/:pet_uuid`                       | `DELETE`     | Delete a single pet given the pet_uuid                                |
| `/community/ `                          | `GET`        | Displays all posts sorted by date                                     |
| `/community/addPost`                    | `GET`        | Add post                                                              |
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
| `/rescue/:user/viewAllRequests`         | `GET`        | View all rescue requests from a user                                  |
| `/rescue/:rescue_uuid/deleteRequest`    | `GET`        | Delete a rescue request                                               |
| `/rescue/deleteAllMyRequests`           | `GET`        | Delete all rescue requests                                            |
| `/rescue/:rescue_uuid/viewRescueRequest`| `GET`        | View a rescue request                                             |
| `/rescue/submit_a_rescue_request`       | `GET`        | Submit a request for rescue                                           |
| `/*`                                    | `GET`        | Redirects to `/feed` if logged in, otherwise redirect to `/`          |

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
  `birthday`   | date                                  | NO |     | NULL    |                      
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
  `birthday`   | date                                  | NO |     | NULL    |
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

### Developers
##### API
* Evangelista, Erlen Mae
* Somabes, Kia Mei

##### Client
* Gotis, Ciara Mae
* Silaya, Ralph Lawrence
