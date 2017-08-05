<h1 align="center">
	<img alt="fost.r" src="./src/assets/images/logo2-dblue.png" height="256px" />
	<br />
	fost.r API
	<br />
	<img src="https://img.shields.io/badge/status-development-yellow.svg" />
	<img src="https://img.shields.io/badge/node-v7.8.0-green.svg" />
	<img src="https://img.shields.io/badge/express-v4.15.3-green.svg" />
	<br />
</h1>
<h4 align="center">Raise the awareness on homeless animals because of neglect or abuse</h4>

## Table of Contents
- [Installation](#installation)
- [API](#api)
  * [Authentication](#authentication)
  * [Accounts](#accounts)
  * [Pet Feed](#pet-feed)
  * [Community](#community)
  * [Rescue](#rescue)
  * [Miscellaneous](#miscellaneous)
- [File Server](#file-server)
- [Tables](#tables)
  * [`users`](#users)
  * [`shelters`](#shelters)
  * [`pets_of_users`](#pets_of_users)
  * [`pets_of_shelters`](#pets_of_shelters)
  * [`adopts`](#adopts)
  * [`dates`](#dates)
  * [`posts`](#posts)
  * [`comments_on_posts`](#comments_on_posts)
  * [`rescue`](#rescue)
  * [`notifications`](#notifications)
- [Developers](#developers)
  * [API](#api)
  * [Client](#client)

## Installation
1. Install [NodeJS](https://nodejs.org/en/download/) and [MySQL](https://dev.mysql.com/downloads/installer/).
2. Install all dependencies with `npm install`.
3. Configure database by editing `database/db.js` and `database/connection.js` with your MySQL credentials.
4. Configure database by running `npm run configure`.
5. Start the server with `npm run devstart`.

## API
Access the API at `/api`.

### Authentication
| Route              | Method   | Request                                                                                                                                                                                      | Response                    |
| :----------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------- |
| `/session`         | `GET`    |                                                                                                                                                                                              | [`accountType`, `Username`] |
| `/login/user`      | `POST`   | <ul><li>Username</li><li>password</li>                                                                                                                                                       | ['user', `Username`]        |
| `/login/shelter`   | `POST`   | <ul><li>Username</li><li>password</li>                                                                                                                                                       | ['shelter', `Username`]     |
| `/signup/user`     | `POST`   | <ul><li>Username</li><li>firstname</li><li>lastname</li><li>birthday</li><li>address</li><li>contactnum</li><li>email</li><li>password</li></ul><br />Optional:<br/><ul><li>icon</li></ul>   | user object                 |
| `/signup/shelter`  | `POST`   | <ul><li>Username</li><li>shelter_name</li><li>address</li><li>contactnum</li><li>email</li><li>password</li><li>file</li></ul><br />Optional:<br/><ul><li>icon</li></ul>                     | user object                 |
| `/logout`          | `GET`    |                                                                                                                                                                                              | `null`                      |

### Accounts
|                   Route                    |  Method  |            Request             |          Response          |
| :----------------------------------------- | :------- | :----------------------------- | :------------------------- |
| `/accounts/MyAccount`                      | `GET`    |                                | account information object |
| `/accounts/MyAccount`                      | `PUT`    | *refer to* `accountType` table |                            |
| `/accounts/MyAccount`                      | `DELETE` |                                |                            |
| `/accounts/viewShelters/page/:page_number` | `GET`    |                                | array of shelter accounts  |
| `/accounts/viewUsers/page/:page_number`    | `GET`    |                                | array of user accounts     |

### Pet Feed
|                        Route                        |  Method  |                                                                                  Request                                                                                  |                                               Response                                               |
| :-------------------------------------------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------- |
| `/pets/myPets`                                      | `POST`   | <ul><li>name</li><li>kind *(DOG, CAT, BIRD, or OTHERS)*</li><li>breed</li><li>sex *(MALE or FEMALE)*</li><li>birthday</li></ul><br/>Optional:<br/><ul><li>photo</li></ul> | pet object                                                                                           |
| `/pets/myPets`                                      | `GET`    |                                                                                                                                                                           | array of pet objects                                                                                 |
| `/pets/:pet_uuid`                                   | `GET`    |                                                                                                                                                                           | pet object                                                                                           |
| `/pets/:pet_uuid`                                   | `PUT`    | <ul><li>name</li><li>kind *(DOG, CAT, BIRD, or OTHERS)*</li><li>breed</li><li>sex *(MALE or FEMALE)*</li><li>birthday</li></ul><br/>Optional:<br/><ul><li>photo</li></ul> |                                                                                                      |
| `/pets/:pet_uuid`                                   | `DELETE` |                                                                                                                                                                           |                                                                                                      |
| `/pets/adopt/page/:page_number`                     | `GET`    |                                                                                                                                                                           | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;pets: `[]`<br/>} |
| `/pets/adopt/:pet_uuid`                             | `POST`   |                                                                                                                                                                           |                                                                                                      |
| `/pets/dates/page/:page_number`                     | `GET`    |                                                                                                                                                                           | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;pets: `[]`<br/>} |
| `/pets/dates/:pet_uuid`                             | `POST`   | <ul><li>date</li></ul>                                                                                                                                                    |                                                                                                      |
| `/pets/dates/approve/:pet_uuid`                     | `PUT`    |                                                                                                                                                                           |                                                                                                      |
| `/pets/dates/reject/:pet_uuid`                      | `PUT`    |                                                                                                                                                                           |                                                                                                      |
| `/pets/dateRequests`                                | `GET`    |                                                                                                                                                                           | array of date request objects                                                                        |
| `/pets/dateRequests/:dates_uuid`                    | `GET`    |                                                                                                                                                                           | array of date request objects                                                                        |
| `/pets/both/page/:page_number`                      | `GET`    |                                                                                                                                                                           | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;pets: `[]`<br/>} |
| `/pets/:owner/viewShelterPets`                      | `GET`    |                                                                                                                                                                           | array of pet objects                                                                                 |
| `/pets/:owner/viewUserPets`                         | `GET`    |                                                                                                                                                                           | array of pet objects                                                                                 |
| `/pets/shelters/viewPetsBySex/:page_number/:sex/`   | `GET`    |                                                                                                                                                                           | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;pets: `[]`<br/>} |
| `/pets/shelters/viewPetsByKind/:page_number/:kind/` | `GET`    |                                                                                                                                                                           | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;pets: `[]`<br/>} |
| `/pets/shelters/viewAllPets/page/:page_number`      | `GET`    |                                                                                                                                                                           | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;pets: `[]`<br/>} |
| `/pets/users/viewAllPets/page/:page_number`         | `GET`    |                                                                                                                                                                           | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;pets: `[]`<br/>} |

### Community
|                           Route                           |  Method  |                       Request                        |                                                 Response                                                 |
| :-------------------------------------------------------- | :------- | :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `/community/addPost`                                      | `POST`   | <ul><li>post_title</li><li>text_post</li></ul>       | post object                                                                                              |
| `/community/:post_uuid`                                   | `GET`    |                                                      | post object                                                                                              |
| `/community/:post_uuid`                                   | `PUT`    |                                                      |                                                                                                          |
| `/community/:post_uuid`                                   | `DELETE` |                                                      |                                                                                                          |
| `/community/:post_uuid`                                   | `POST`   | <ul><li>comment_body</li><li>comment_title</li></ul> | comment object                                                                                           |
| `/community/sortByTimeDesc/page/:page_number`             | `GET`    |                                                      |                                                                                                          |
| `/community/sortByTimeAsc/page/:page_number`              | `GET`    |                                                      | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;posts: `[]`<br/>}    |
| `/community/sortByCommentsDesc/page/:page_number`         | `GET`    |                                                      | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;posts: `[]`<br/>}    |
| `/community/sortByCommentsAsc/page/:page_number`          | `GET`    |                                                      | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;posts: `[]`<br/>}    |
| `/community/sortByVotesDesc/page/:page_number`            | `GET`    |                                                      | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;posts: `[]`<br/>}    |
| `/community/sortByVotesAsc/page/:page_number`             | `GET`    |                                                      | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;posts: `[]`<br/>}    |
| `/community/:user/viewPosts/page/:page_number`            | `GET`    |                                                      | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;posts: `[]`<br/>}    |
| `/community/:post_uuid/:comment_uuid`                     | `GET`    |                                                      | comment object                                                                                           |
| `/community/:post_uuid/:comment_uuid`                     | `DELETE` |                                                      |                                                                                                          |
| `/community/:post_uuid/:comment_uuid`                     | `PUT`    |                                                      |                                                                                                          |
| `/community/viewAllComments/:post_uuid/page/:page_number` | `GET`    |                                                      | {<br/>&nbsp;&nbsp;page: `currentPage`,<br/>pageTotal: `totalPages`,<br/>&nbsp;&nbsp;comments: `[]`<br/>} |

### Rescue
|                  Route                   |  Method  |                                 Request                                 |             Response             |
| :--------------------------------------- | :------- | :---------------------------------------------------------------------- | :------------------------------- |
| `/rescue/`                               | `GET`    |                                                                         | array of request objects         |
| `/rescue/viewMyRequests`                 | `GET`    |                                                                         | array of request objects of user |
| `/rescue/:rescue_uuid`                   | `GET`    |                                                                         | request object                   |
| `/rescue/:rescue_uuid`                   | `DELETE` |                                                                         |                                  |
| `/rescue/:user/viewAllRequests`          | `GET`    |                                                                         | array of request objects of user |
| `/rescue/:rescue_uuid/viewRescueRequest` | `GET`    |                                                                         | request object                   |
| `/rescue/submit_a_rescue_request`        | `POST`   | <ul><li>rescue_body</li></ul><br/>Optional:<br/><ul><li>photo</li></ul> | request object                   |


### Miscellaneous
|      Route       | Method | Request |            Response           |
| :--------------- | :----- | :------ | :---------------------------- |
| `/notifications` | `GET`  |         | array of notification objects |

## File Server
Access the files at `/<route>/<file>`.
|         Files          |                  Route                   |
| :--------------------- | :--------------------------------------- |
| User account photos    | `/signup/icons/users`                    |
| Shelter account photos | `/signup/icons/shelters`                 |
| Shelter documents      | `/signup/shelter-docs`                   |
| Images of pets         | `/pets/photos`                           |
| Post images            | `/community/images_attached_to_posts`    |
| Comment images         | `/community/images_attached_to_comments` |
| Rescue images          | `/rescue/rescue-images`                  |

## Tables
### `users`

|     Field      |     Type     | Null | Key | Default |
| :------------- | :----------- | :--- | :-- | :------ |
| `Username`     | varchar(36)  | NO   | PRI | NULL    |
| `firstname`    | varchar(36)  | NO   |     | NULL    |
| `lastname`     | varchar(36)  | NO   |     | NULL    |
| `birthday`     | date         | YES  |     | NULL    |
| `address`      | varchar(236) | NO   |     | NULL    |
| `contactnum`   | varchar(20)  | NO   |     | NULL    |
| `email`        | varchar(36)  | NO   | PRI | NULL    |
| `password`     | varchar(255) | NO   |     | NULL    |
| `icon_url`     | varchar(255) | YES  |     | NULL    |
| `icon_abspath` | varchar(255) | YES  |     | NULL    |
| `icon_width`   | varchar(36)  | YES  |     | NULL    |
| `icon_height`  | varchar(36)  | YES  |     | NULL    |
| `created_at`   | datetime     | NO   |     | NULL    |
| `updated_at`   | datetime     | NO   |     | NULL    |


### `shelters`
|     Field      |     Type     | Null | Key | Default |
| :------------- | :----------- | :--- | :-- | :------ |
| `Username`     | varchar(52)  | NO   | PRI | NULL    |
| `shelter_name` | varchar(52)  | NO   |     | NULL    |
| `address`      | varchar(236) | NO   |     | NULL    |
| `contactnum`   | varchar(20)  | NO   |     | NULL    |
| `email`        | varchar(36)  | NO   | PRI | NULL    |
| `password`     | varchar(255) | NO   |     | NULL    |
| `icon_url`     | varchar(255) | YES  |     | NULL    |
| `icon_abspath` | varchar(255) | YES  |     | NULL    |
| `icon_width`   | varchar(36)  | YES  |     | NULL    |
| `icon_height`  | varchar(36)  | YES  |     | NULL    |
| `file_path`    | varchar(255) | NO   |     | NULL    |
| `absfile_path` | varchar(255) | NO   |     | NULL    |
| `created_at`   | datetime     | NO   |     | NULL    |
| `updated_at`   | datetime     | NO   |     | NULL    |


### `pets_of_users`

|      Field      |                 Type                | Null | Key | Default |
| :-------------- | :---------------------------------- | :--- | :-- | :------ |
| `name`          | varchar(52)                         | NO   |     | NULL    |
| `kind`          | `enum('DOG','CAT','BIRD','OTHERS')` | NO   |     | NULL    |
| `breed`         | varchar(36)                         | NO   |     | NULL    |
| `sex`           | `enum('MALE','FEMALE')`             | NO   |     | NULL    |
| `birthday`      | date                                | YES  |     | NULL    |
| `description`   | varchar(200)                        | YES  |     | NULL    |
| `created_at`    | datetime                            | NO   |     | NULL    |
| `updated_at`    | datetime                            | NO   |     | NULL    |
| `uuid`          | varchar(36)                         | NO   | PRI | NULL    |
| `url`           | varchar(255)                        | YES  |     | NULL    |
| `abspath`       | varchar(255)                        | YES  |     | NULL    |
| `width`         | varchar(36)                         | YES  |     | NULL    |
| `height`        | varchar(36)                         | YES  |     | NULL    |
| `user_Username` | varchar(36)                         | NO   | MUL | NULL    |

### `pets_of_shelters`
|       Field        |                 Type                | Null | Key | Default |
| :----------------- | :---------------------------------- | :--- | :-- | :------ |
| `name`             | varchar(52)                         | NO   |     | NULL    |
| `kind`             | `enum('DOG','CAT','BIRD','OTHERS')` | NO   |     | NULL    |
| `breed`            | varchar(36)                         | NO   |     | NULL    |
| `sex`              | `enum('MALE','FEMALE')`             | NO   |     | NULL    |
| `birthday`         | varchar(36)                         | NO   |     | NULL    |
| `description`      | varchar(200)                        | YES  |     | NULL    |
| `status`           | `enum('DATES','ADOPT','BOTH')`      | YES  |     | NULL    |
| `created_at`       | datetime                            | NO   |     | NULL    |
| `updated_at`       | datetime                            | NO   |     | NULL    |
| `uuid`             | varchar(36)                         | NO   | PRI | NULL    |
| `url`              | varchar(255)                        | YES  |     | NULL    |
| `abspath`          | varchar(255)                        | YES  |     | NULL    |
| `width`            | varchar(36)                         | YES  |     | NULL    |
| `height`           | varchar(36)                         | YES  |     | NULL    |
| `shelter_Username` | varchar(52)                         | NO   | MUL | NULL    |

### `adopts`
|      Field      |     Type    | Null | Key | Default |
| :-------------- | :---------- | :--- | :-- | :------ |
| `user_Username` | varchar(36) | NO   | MUL | NULL    |
| `pet_uuid`      | varchar(36) | NO   | MUL | NULL    |
| `adopt_uuid`    | varchar(36) | No   |     | NULL    |
| `created_at`    | datetime    | NO   |     | NULL    |
| `updated_at`    | datetime    | NO   |     | NULL    |

### `dates`
|      Field      |                    Type                   | Null | Key | Default |
| :-------------- | :---------------------------------------- | :--- | :-- | :------ |
| `user_Username` | varchar(36)                               | NO   | MUL | NULL    |
| `pet_uuid`      | varchar(36)                               | NO   | MUL | NULL    |
| `status`        | `enum('PENDING', 'APPROVED', 'REJECTED')` | NO   |     | NULL    |
| `dates_uuid`    | varchar(36)                               | No   |     | NULL    |
| `created_at`    | datetime                                  | NO   |     | NULL    |
| `updated_at`    | datetime                                  | NO   |     | NULL    |


### `posts`

|      Field      |     Type     | Null | Key | Default |
| :-------------- | :----------- | :--- | :-- | :------ |
| `Posted_by`     | varchar(52)  | NO   |     | NULL    |
| `post_title`    | varchar(255) | NO   |     | NULL    |
| `text_post`     | text         | NO   |     | NULL    |
| `votes`         | int(6)       | NO   |     | NULL    |
| `comments`      | int(6)       | NO   |     | NULL    |
| `image_urlpath` | varchar(255) | YES  | UNI | NULL    |
| `img_abspath`   | varchar(255) | YES  | UNI | NULL    |
| `post_uuid`     | varchar(36)  | NO   | PRI | NULL    |
| `created_at`    | datetime     | NO   |     | NULL    |
| `updated_at`    | datetime     | NO   |     | NULL    |

### `comments_on_posts`
|      Field      |     Type     | Null | Key | Default |
| :-------------- | :----------- | :--- | :-- | :------ |
| `comment_title` | varchar(36)  | NO   |     | NULL    |
| `comment_uuid`  | varchar(36)  | NO   | PRI | NULL    |
| `commented_by`  | varchar(52)  | NO   |     | NULL    |
| `comment_body`  | varchar(255) | NO   |     | NULL    |
| `votes`         | int(6)       | NO   |     | NULL    |
| `img_abspath`   | varchar(255) | YES  | UNI | NULL    |
| `image_urlpath` | varchar(255) | YES  | UNI | NULL    |
| `created_at`    | datetime     | NO   |     | NULL    |
| `updated_at`    | datetime     | NO   |     | NULL    |
| `post_uuid`     | varchar(36)  | NO   | MUL | NULL    |



### `rescue`

|        Field        |     Type     | Null | Key | Default |
| :------------------ | :----------- | :--- | :-- | :------ |
| `rescue_uuid`       | varchar(36)  | NO   | PRI | NULL    |
| `rescue_body`       | text         | NO   |     | NULL    |
| `rescue_abspath`    | varchar(255) | YES  | UNI | NULL    |
| `rescue_imgurl`     | varchar(255) | YES  | UNI | NULL    |
| `date_submitted`    | datetime     | NO   |     | NULL    |
| `updated_on`        | datetime     | NO   |     | NULL    |
| `contactnum_sender` | int(11)      | NO   |     | NULL    |
| `email_sender`      | varchar(36)  | NO   |     | NULL    |
| `address_sender`    | varchar(236) | NO   |     | NULL    |
| `sender_Username`   | varchar(52)  | NO   | MUL | NULL    |


### `notifications`

|      Field      |     Type     | Null | Key | Default |
| :-------------- | :----------- | :--- | :-- | :------ |
| `notif_id`      | int(11)      | NO   | PRI | NULL    |
| `notif_for`     | varchar(36)  | NO   | MUL | NULL    |
| `notif_message` | varchar(255) | NO   |     | NULL    |
| `notif_url`     | varchar(255) | NO   |     | NULL    |
| `date_created`  | datetime     | NO   |     | NULL    |

## Developers
This web app is part of the PAD project of Batch o(ctal) in Young Software Engineers' Society (YSES) UPLB.
#### API
* Evangelista, Erlen Mae
* Sombaes, Kia Mei

##### Client
* Gotis, Ciara Mae
* Silaya, Ralph Lawrence
