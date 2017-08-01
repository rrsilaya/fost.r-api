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

## Table of Contents
- [Installation](#installation)
- [Routes](#routes)
- [API](#api)
  * [Requests](#requests)
  * [Responses](#responses)
- [Tables](#tables)
  * [`users`](#users)
  * [`shelters`](#shelters)
  * [`pets_of_users`](#pets_of_users)
  * [`pets_of_shelters`](#pets_of_shelters)
  * [`posts`](#posts)
  * [`comments_on_posts`](#comments_on_posts)
  * [`rescue`](#rescue)
  * [`notifications`](#notifications)
- [Developers](#developers)
  * [API](#api)
  * [Client](#client)

## Installation
1. Install [NodeJS](https://nodejs.org/en/download/) and [MySQL](https://dev.mysql.com/downloads/installer/).
2. Install dependencies with `npm install`.
3. Configure database by editing `database/db.js` and `database/connection.js` with your MySQL credentials.
4. Create database with `node ./database/config.js`.
5. Populate with test data by running `npm populate`.
6. Start the server with `npm run devstart`.
7. Access the api through `http://localhost:3000/api/`.

## Routes

|                  Route                   |  Method  |                                            Remarks                                             |
| :--------------------------------------- | :------- | :--------------------------------------------------------------------------------------------- |
| `/`                                      | `GET`    | Displays message(temp)                                                                         |
| `/session`                               | `GET`    | Returns the account type (if logged in)                                                        |
| `/login/user`                            | `POST`   | Redirects to `/feed` if logged in                                                              |
| `/login/shelter`                         | `POST`   | Redirects to `/feed` if logged in                                                              |
| `/logout`                                | `GET`    | Redirects to `/` after user logged out                                                         |
| `/signup/userUsername`                   | `POST`   | Checks if entered username is already taken (users)                                            |
| `/signup/userEmail`                      | `POST`   | Checks if entered email is already taken (users)                                               |
| `/signup/shelterUsername`                | `POST`   | Checks if username is already taken (shelters)                                                 |
| `/signup/shelterUsername`                | `POST`   | Checks if entered email is already taken (shelters)                                            |
| `/signup/user`                           | `POST`   | Redirects to `/feed` if logged in                                                              |
| `/signup/shelter`                        | `POST`   | Redirects to `/feed` if logged in                                                              |
| `/feed `                                 | `GET`    | Displays message (temp)                                                                        |
| `/notifications`                         | `GET`    | View all notifications                                                                         |
| `/accounts/viewShelters/page/:page_number`| `GET`   | View all shelter accounts by page                                                              |
| `/accounts/viewUsers/page/:page_number`  | `GET`    | View all user accounts by page                                                                 |
| `/accounts/MyAccount`                    | `GET`    | View own info                                                                                  |
| `/accounts/MyAccount`                    | `PUT`    | Update own info                                                                                |
| `/accounts/MyAccount`                    | `DELETE` | Delete own account                                                                             |
| `/pets/shelters/viewPetsBySex/:page_number/:sex/`|`GET`| View pets by specified sex in paramaters by page                                            |
| `/pets/shelters/viewPetsByKind/:page_number/:kind/`|`GET`| View pets by specified kind in paramaters by page                                         |
| `/pets/shelters/viewAllPets/page/:page_number`| `GET`| View pets owned by shelters by page                                                           |
| `/pets/users/viewAllPets/page/:page_number`| `GET`  | View pets owned by users by page                                                               |
| `/pets/adopt/page/:page_number`        | `GET`    | Show all pets (of shelters) that are allowed for adoption by page                                |
| `/pets/adopt/:owner`                     | `GET`    | Show all pets (of a shelter) that are allowed for adoption                                     |
| `/pets/adopt/:pet_uuid`                  | `POST`   | Process adoption request for :pet_uuid (if you're a user)                                      |
| `/pets/dates/page/:page_number`          | `GET`    | Show all pets (of shelters) that are allowed for dates by page                                 |
| `/pets/dates/:owner`                     | `GET`    | Show all pets (of a shelter) that are allowed for dates                                        |
| `/pets/dates/:pet_uuid`                  | `POST`   | Process date request for :pet_uuid (if you're a user)                                          |
| `/pets/both/page/:page_number`           | `GET`    | Show all pets (of shelters) that are allowed for adoption & dates by page                      |
| `/pets/:owner/viewShelterPets`           | `GET`    | View pets of owner                                                                             |
| `/pets/:owner/viewUserPets`              | `GET`    | View pets of owner                                                                             |
| `/pets/:owner/deleteAllUserPets`         | `DELETE` | Delete all pets of a given user                                                                |
| `/pets/:owner/deleteAllShelter`          | `DELETE` | Delete all pets of a given shelter                                                             |
| `/pets/myPets`                           | `POST`   | Add a pet to db                                                                                |
| `/pets/myPets`                           | `GET`    | View own pets                                                                                  |
| `/pets/myPets`                           | `DELETE` | Delete all owned pets                                                                          |
| `/pets/:pet_uuid`                        | `GET`    | View specific pet                                                                              |
| `/pets/:pet_uuid`                        | `PUT`    | Update info of a pet  (could be used for ADOPT and DATES, set status to ADOPT, DATES, OR BOTH) |
| `/pets/:pet_uuid`                        | `DELETE` | Delete a single pet given the pet_uuid                                                         |
| `/community/sortByTimeDesc/page/:page_number`| `GET`| Displays all posts sorted by date (from newest to oldest) by page                              |
| `/community/sortByTimeAsc/page/:page_number`| `GET` | Displays all posts sorted by date (from oldest to newest) by page                              |
| `/community/sortByCommentsDesc/page/:page_number`|`GET`| Displays all posts sorted by number of comments (from most to least) by page                |
| `/community/sortByCommentsAsc/page/:page_number`| `GET`| Displays all posts sorted by number of comments (from least to most) by page                |
| `/community/sortByVotesDesc/page/:page_number`| `GET`| Displays all posts sorted by number of votes (from most to least) by page                     |
| `/community/sortByVotesAsc/page/:page_number`| `GET`| Displays all posts sorted by number of votes (from least to most) by page                      |
| `/community/addPost`                     | `POST`   | Add post                                                                                       |
| `/community/:post_uuid`                  | `GET`    | View a post given its uuid                                                                     |
| `/community/:post_uuid`                  | `PUT`    | Vote a post given its uuid                                                                     |
| `/community/:post_uuid`                  | `DELETE` | Delete a post given its uuid (iff post is posted by the user itself)                           |
| `/community/:post_uuid`                  | `POST`   | Add a comment                                                                                  |
| `/community/:user/viewPosts`             | `GET`    | View all posts of a user                                                                       |
| `/community/deleteAllMyPosts`            | `DELETE` | Delete all posts of user                                                                       |
| `/community/viewAllComments/:post_uuid`  | `GET`    | View all comments in the post                                                                  |
| `/community/:post_uuid/:comment_uuid`    | `GET`    | View a comment                                                                                 |
| `/community/:post_uuid/:comment_uuid`    | `DELETE` | Delete a comment                                                                               |
| `/community/:post_uuid/:comment_uuid`    | `PUT`    | Vote a comment                                                                                 |
| `/rescue/`                               | `GET`    | View all requests                                                                              |
| `/rescue/viewMyRequests`                 | `GET`    | View all submitted requests                                                                    |
| `/rescue/:rescue_uuid`                   | `GET`    | View :rescue_uuid of logged in user                                                            |
| `/rescue/:rescue_uuid`                   | `DELETE` | Deletes :rescue_uuid of logged in user                                                         |
| `/rescue/:user/viewAllRequests`          | `GET`    | View all rescue requests from a user                                                           |
| `/rescue/:rescue_uuid/deleteRequest`     | `GET`    | Delete a rescue request                                                                        |
| `/rescue/deleteAllMyRequests`            | `GET`    | Delete all rescue requests                                                                     |
| `/rescue/:rescue_uuid/viewRescueRequest` | `GET`    | View a rescue request                                                                          |
| `/rescue/submit_a_rescue_request`        | `POST`   | Submit a request for rescue                                                                    |
| `/*`                                     | `GET`    | Redirects to `/feed` if logged in, otherwise redirect to `/`                                   |

## API
### Requests
> Please take note of the capitalization.

|               Route               | Method |                                                                 Required Fields                                                                  |     Optional Fields     |
| :-------------------------------- | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------- |
| `/signup/user`                    | `POST` | <ul><li>Username</li><li>firstname</li><li>lastname</li><li>birthday</li><li>address</li><li>contactnum</li><li>email</li><li>password</li></ul> | <ul><li>icon</li></ul>  |
| `/signup/shelter`                 | `POST` | <ul><li>Username</li><li>shelter_name</li><li>address</li><li>contactnum</li><li>email</li><li>password</li><li>file</li></ul>                   | <ul><li>icon</li></ul>  |
| `/login/user`                     | `POST` | <ul><li>Username</li><li>password</li></ul>                                                                                                      |                         |
| `/login/shelter`                  | `POST` | <ul><li>Username</li><li>password</li></ul>                                                                                                      |                         |
| `/pets/myPets`                    | `POST` | <ul><li>name</li><li>kind *(DOG, CAT, BIRD, or OTHERS)*</li><li>breed</li><li>sex *(MALE or FEMALE)*</li><li>birthday</li></ul>                  | <ul><li>photo</li></ul> |
| `/accounts/MyAccount`             | `PUT`  | refer to `signup/` route depending on account type                                                                                               |                         |
| `/pets/:pet_uuid`                 | `PUT`  | refer to `pets/myPets` route                                                                                                                     |                         |
| `/community/addPost`              | `POST` | <ul><li>post_title</li><li>text_post</li></ul>                                                                                                   | <ul><li>photo</li></ul> |
| `/community/:post_uuid`           | `POST` | <ul><li>comment_body</li><li>comment_title</li></ul>                                                                                                                   | <ul><li>photo</li></ul> |
| `/rescue/submit_a_rescue_request` | `POST` | <ul><li>rescue_body</li></ul>                                                                                                                    | <ul><li>photo</li></ul> |

### Responses
|                  Route                   |  Method  | Response Code |                             Response Body                             |
| :--------------------------------------- | :------- | :------------ | :-------------------------------------------------------------------- |
| `/session`                               | `GET`    | 200           | `req.session.body.accountType`                                        |
| `/login/user`                            | `POST`   | 200           | `req.session.body.accountType`                                        |
| `/login/shelter`                         | `POST`   | 200           | `req.session.body.accountType`                                        |
| `/logout`                                | `GET`    | 200           | `null`                                                                |
| `/signup/user`                           | `POST`   | 201           | json of newUser                                                       |
| `/signup/shelter`                        | `POST`   | 201           | json of newShelter                                                    |
| `/notifications`                         | `GET`    | 200           | json of notifications                                                 |
| `/feed `                                 | `GET`    | 200           |                                                                       |
| `/accounts/viewShelters`                 | `GET`    | 200           | json of shelters                                                      |
| `/accounts/viewUsers`                    | `GET`    | 200           | json of users                                                         |
| `/accounts/MyAccount`                    | `GET`    | 200           | json of own account's info                                            |
| `/accounts/MyAccount`                    | `PUT`    | 201           | json of mysql query                                                   |
| `/accounts/MyAccount`                    | `DELETE` | 204           |                                                                       |
| `/pets/viewAllPets`                      | `GET`    | 200           | json of pets                                                          |
| `/pets/:owner/viewShelterPets`           | `GET`    | 200           | json of pets                                                          |
| `/pets/:owner/viewUserPets`              | `GET`    | 200           | json of pets                                                          |
| `/pets/:owner/deleteAllUserPets`         | `DELETE` | 204           |                                                                       |
| `/pets/:owner/deleteAllShelter`          | `DELETE` | 204           |                                                                       |
| `/pets/myPets`                           | `POST`   | 201           | json of mysql query                                                   |
| `/pets/myPets`                           | `GET`    | 200           | json of owned pets                                                    |
| `/pets/myPets`                           | `DELETE` | 204           |                                                                       |
| `/pets/:pet_uuid`                        | `GET`    | 200           | json of pet's info                                                    |
| `/pets/:pet_uuid`                        | `PUT`    | 201           | json of mysql query                                                   |
| `/pets/:pet_uuid`                        | `DELETE` | 204           |                                                                       |
| `/community/sortByTimeDesc/page/:page_number`| `GET`| 200           | json of posts sorted by date (from newest to oldest)                  |
| `/community/sortByTimeAsc/page/:page_number` | `GET`| 200           | json of posts sorted by date (from oldest to newest)                  |
| `/community/sortByCommentsDesc/page/:page_number`| `GET`| 200       | json of posts sorted by number of comments (from most to least)       |
| `/community/sortByCommentsAsc/page/:page_number` | `GET`| 200       | json of posts sorted by number of comments (from least to most)       |
| `/community/sortByVotesDesc/page/:page_number`| `GET`   | 200       | json of posts sorted by number of votes (from most to least)          |
| `/community/sortByVotesAsc/page/:page_number` | `GET`   | 200       | json of posts sorted by number of votes (from least to most)          |
| `/community/addPost`                     | `POST`   | 201           | json of post                                                          |
| `/community/:post_uuid`                  | `GET`    | 200           |                                                                       |
| `/community/:post_uuid`                  | `PUT`    | 201           | json of mysql query                                                   |
| `/community/:post_uuid`                  | `DELETE` | 204           |                                                                       |
| `/community/:post_uuid`                  | `POST`   | 201           | json of newComment                                                    |
| `/community/:user/viewPosts`             | `GET`    | 200           | json of posts by :user                                                |
| `/community/deleteAllMyPosts`            | `DELETE` | 204           |                                                                       |
| `/community/viewAllComments/:post_uuid`  | `GET`    | 200           | json of comments in :post_uuid                                        |
| `/community/:post_uuid/:comment_uuid`    | `GET`    | 200           | json `comment_uuid` in `post_uuid`                                    |
| `/community/:post_uuid/:comment_uuid`    | `DELETE` | 204           |                                                                       |
| `/community/:post_uuid/:comment_uuid`    | `PUT`    | 201           | json of mysql query                                                   |
| `/rescue/`                               | `GET`    | 200           | json of requests (if shelter); redirects to /viewMyRequests (if user) |
| `/rescue/viewMyRequests`                 | `GET`    | 200           | json of requests (only for users)                                     |
| `/rescue/:rescue_uuid`                   | `GET`    | 200           | json of rescue                                                        |
| `/rescue/:rescue_uuid`                   | `DELETE` | 204           |                                                                       |
| `/rescue/:user/viewAllRequests`          | `GET`    | 200           | json of requests from :user (only for shelters)                       |
| `/rescue/deleteAllMyRequests`            | `DELETE` | 204           |                                                                       |
| `/rescue/:rescue_uuid/viewRescueRequest` | `GET`    | 200           | json of rescue where rescue_uuid = :rescue_uuid                       |
| `/rescue/submit_a_rescue_request`        | `POST`   | 201           | json of newRescue                                                     |

## Tables
### `users`

| Field         | Type         | Null | Key | Default |
|:--------------|:-------------|:-----|:----|:--------|
| `Username`    | varchar(36)  | NO   | PRI | NULL    |
| `firstname`   | varchar(36)  | NO   |     | NULL    |
| `lastname`    | varchar(36)  | NO   |     | NULL    |
| `birthday`    | varchar(36)  | NO   |     | NULL    |
| `address`     | varchar(236) | NO   |     | NULL    |
| `contactnum`  | varchar(20)  | NO   |     | NULL    |
| `email`       | varchar(36)  | NO   | PRI | NULL    |
| `password`    | varchar(255) | NO   |     | NULL    |
| `icon_url`    | varchar(255) | YES  |     | NULL    |
| `icon_width`  | varchar(36)  | YES  |     | NULL    |
| `icon_height` | varchar(36)  | YES  |     | NULL    |
| `created_at`  | datetime     | NO   |     | NULL    |
| `updated_at`  | datetime     | NO   |     | NULL    |

### `shelters`
| Field          | Type         | Null | Key | Default |
|:---------------|:-------------|:----:|:---:|:-------:|
| `Username`     | varchar(36)  |  NO  | PRI |         |
| `shelter_name` | varchar(52)  |  NO  |     |  NULL   |
| `address`      | varchar(236) |  NO  |     |  NULL   |
| `contactnum`   | varchar(20)  |  NO  |     |  NULL   |
| `email`        | varchar(36)  |  NO  | UNI |  NULL   |
| `password`     | varchar(255) |  NO  |     |  NULL   |
| `icon_url`     | varchar(255) | YES  |     |  NULL   |
| `icon_width`   | varchar(36)  | YES  |     |  NULL   |
| `icon_height`  | varchar(36)  | YES  |     |  NULL   |
| `file_path`    | varchar(255) |  NO  |     |  NULL   |
| `created_at`   | datetime     |  NO  |     |  NULL   |
| `updated_at`   | datetime     |  NO  |     |  NULL   |

### `pets_of_users`
| Field           | Type                                 | Null | Key | Default |
|:----------------|:-------------------------------------|:----:|:---:|:-------:|
| `name`          | varchar(52)                          |  NO  |     |  NULL   |
| `kind`          | enum("DOG", "CAT", "BIRD", "OTHERS") |  NO  |     |  NULL   |
| `breed`         | varchar(36)                          |  NO  |     |  NULL   |
| `sex`           | enum("MALE", "FEMALE")               |  NO  |     |  NULL   |
| `birthday`      | varchar(36)                          |  NO  |     |  NULL   |
| `description`   | varchar(200)                         | YES  |     |  NULL   |
| `user_Username` | varchar(36)                          |  NO  | MUL |  NULL   |
| `created_at`    | datetime                             |  NO  |     |  NULL   |
| `updated_at`    | datetime                             |  NO  |     |  NULL   |
| `uuid`          | varchar(36)                          |  NO  | PRI |  NULL   |
| `url`           | varchar(255)                         | YES  |     |  NULL   |
| `width`         | varchar(36)                          | YES  |     |  NULL   |
| `height`        | varchar(36)                          | YES  |     |  NULL   |

### `pets_of_shelters`
| Field              | Type                                 | Null | Key | Default |
|:-------------------|:-------------------------------------|:----:|:---:|:-------:|
| `name`             | varchar(52)                          |  NO  |     |  NULL   |
| `kind`             | enum("DOG", "CAT", "BIRD", "OTHERS") |  NO  |     |  NULL   |
| `breed`            | varchar(36)                          |  NO  |     |  NULL   |
| `sex`              | enum("MALE", "FEMALE")               |  NO  |     |  NULL   |
| `birthday`         | varchar(36)                          |  NO  |     |  NULL   |
| `description`      | varchar(200)                         | YES  |     |  NULL   | 
| `status`           | enum("DATES", "ADOPT", "BOTH")       | YES  |     |  NULL   |
| `shelter_Username` | varchar(52)                          |  NO  | MUL |  NULL   |
| `created_at`       | datetime                             |  NO  |     |  NULL   |
| `updated_at`       | datetime                             |  NO  |     |  NULL   |
| `uuid`             | varchar(36)                          |  NO  | PRI |  NULL   |
| `url`              | varchar(255)                         | YES  |     |  NULL   |
| `width`            | varchar(36)                          | YES  |     |  NULL   |
| `height`           | varchar(36)                          | YES  |     |  NULL   |

### `posts`
| Field           | Type         | Null | Key | Default |
|:----------------|:-------------|:----:|:---:|:-------:|
| `Posted_by`     | varchar(52)  |  NO  | MUL |  NULL   |
| `post_title`    | varchar(255) |  NO  |     |  NULL   |
| `text_post`     | TEXT         |  NO  |     |  NULL   |
| `votes`         | int(6)       |  NO  |     |  NULL   |
| `comments`      | int(6)       |  NO  |     |  NULL   |
| `image_urlpath` | varchar(255) | YES  | UNI |  NULL   |
| `post_uuid`     | varchar(36)  |  NO  | PRI |  NULL   |
| `created_at`    | datetime     |  NO  |     |  NULL   |
| `updated_at`    | datetime     |  NO  |     |  NULL   |

### `comments_on_posts`
| Field           | Type         | Null | Key | Default |
|:----------------|:-------------|:-----|:----|:--------|
| `comment_title` | varchar(36)  | NO   |     | NULL    |
| `comment_uuid`  | varchar(36)  | NO   | PRI | NULL    |
| `commented_by`  | varchar(52)  | NO   |     | NULL    |
| `comment_body`  | varchar(255) | NO   |     | NULL    |
| `votes`         | int(6)       | NO   |     | NULL    |
| `image_urlpath` | varchar(255) | YES  | UNI | NULL    |
| `created_at`    | datetime     | NO   |     | NULL    |
| `updated_at`    | datetime     | NO   |     | NULL    |
| `post_uuid`     | varchar(36)  | NO   | MUL | NULL    |


### `rescue`
| Field               | Type         | Null | Key | Default |
|:--------------------|:-------------|:-----|:----|:--------|
| `rescue_uuid`       | varchar(36)  | NO   | PRI | NULL    |
| `rescue_body`       | varchar(255) | NO   |     | NULL    |
| `rescue_imgurl`     | varchar(255) | YES  | UNI | NULL    |
| `date_submitted`    | datetime     | NO   |     | NULL    |
| `updated_on`        | datetime     | NO   |     | NULL    |
| `contactnum_sender` | int(11)      | NO   |     | NULL    |
| `email_sender`      | varchar(36)  | NO   |     | NULL    |
| `address_sender`    | varchar(236) | NO   |     | NULL    |
| `sender_Username`   | varchar(52)  | NO   | MUL | NULL    |

### `notifications`

| Field         | Type         | Null | Key | Default | Extra          |
|:--------------|:-------------|:-----|:----|:--------|:---------------|
| notif_id      | int(11)      | NO   | PRI | NULL    | auto_increment |
| notif_for     | varchar(36)  | NO   | MUL | NULL    |                |
| notif_message | varchar(255) | NO   |     | NULL    |                |
| notif_url     | varchar(255) | NO   |     | NULL    |                |
| date_created  | datetime     | NO   |     | NULL    |                |

## Developers
#### API
* Evangelista, Erlen Mae
* Somabes, Kia Mei

##### Client
* Gotis, Ciara Mae
* Silaya, Ralph Lawrence
