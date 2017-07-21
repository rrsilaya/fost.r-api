## Temporary note: (haha)
Start program with `npm run devstart` so you no longer have to restart (similar to React).

# fost.r ![octal](https://img.shields.io/badge/Batch_o%28ctal%29-fost.r-blue.svg?style=flat-square?colorA=000000)
![status](https://img.shields.io/badge/status-development-yellow.svg)
![yarn](https://img.shields.io/badge/yarn-v0.24.5-green.svg)
![react](https://img.shields.io/badge/react-v15.5.4-green.svg)

fost.r aims to raise awareness about the animals that are not able to have a home because of neglect or abuse. It will also serve people who needs to have companion or friend.

### Installing
1. Install the latest version of [yarn](http://www.yarnpkg.com/).
2. Install all the dependencies using `yarn install`.
3. Start the react app with `yarn start`.

It is assumed that you are using [yarn](http://www.yarnpkg.com/) as your package manager. To use [npm](https://www.npmjs.com/), do:
```
$ npm install && npm start
```

## fost.r-backend

### Database

#### users

  Field       | Type         | Null | Key | Default | Extra |
 -------------|--------------|------|-----|---------|-------|
  Username    | varchar(36)  | NO   | PRI | NULL    |       |
  firstname   | varchar(36)  | NO   |     | NULL    |       |
  lastname    | varchar(36)  | NO   |     | NULL    |       |
  birthday    | varchar(36)  | NO   |     | NULL    |       |
  address     | varchar(236) | NO   |     | NULL    |       |
  contactnum  | int(11)      | NO   |     | NULL    |       |
  email       | varchar(36)  | NO   | PRI | NULL    |       |
  password    | varchar(255) | NO   |     | NULL    |       |
  icon_url    | varchar(255) | YES  |     | NULL    |       |
  icon_width  | varchar(36)  | YES  |     | NULL    |       |
  icon_height | varchar(36)  | YES  |     | NULL    |       |
  created_at  | datetime     | NO   |     | NULL    |       |
  updated_at  | datetime     | NO   |     | NULL    |       |



#### shelters
  Field      | Type         |Null| Key | Default | Extra  
  ---------- | ------------ | ---| --- | ------- | -----  
  Username   | varchar(36)  | NO | PRI |         |        
  shelter_name  | varchar(52)  | NO |     | NULL    |        
  address    | varchar(236) | NO |     | NULL    |        
  contactnum | int(11)      | NO |     | NULL    |        
  email      | varchar(36)  | NO | UNI | NULL    |        
  password   | varchar(255) | NO |     | NULL    |
  icon_url   | varchar(255) | YES|     | NULL    |
  icon_width | varchar(36)  | YES|     | NULL    |
  icon_height| varchar(36)  | YES|     | NULL    | 
  file_path  |varchar(255)  | NO |     | NULL    |       
  created_at | datetime     | NO |     | NULL    |        
  updated_at | datetime     | NO |     | NULL    |   

                  

#### pets_of_users
  Field      | Type                                  |Null| Key | Default | Extra                
  ---------- | ------------------------------------- |----| --- | ------- | -------------------   
  name       | varchar(52)                           | NO |     | NULL    |                      
  kind   	   | enum("DOG", "CAT", "BIRD", "OTHERS")  | NO |     | NULL    |                      
  breed      | varchar(36)                           | NO |     | NULL    |                      
  sex        | enum("MALE", "FEMALE")                | NO |     | NULL    |                      
  birthday   | date                                  | NO |     | NULL    |                      
  user_Username   | varchar(36)                           | NO | MUL | NULL    |                      
  created_at | datetime                              | NO |     | NULL    |                      
  updated_at | datetime                              | NO |     | NULL    |
  uuid       | varchar(36)                           | NO | PRI | NULL    |
  url        | varchar(255)                          | NO |     | NULL    |
  width      | varchar(36)                           | NO |     | NULL    | 
  height     | varchar(36)                           | NO |     | NULL    |                        

#### pets_of_shelters

  Field      | Type                                  |Null| Key | Default | Extra                
  ---------- | ------------------------------------- | ---| --- | ------- | -------------------
  name       | varchar(52)                           | NO |     | NULL    |                      
  kind   	   | enum("DOG", "CAT", "BIRD", "OTHERS")  | NO |     | NULL    |                      
  breed      | varchar(36)                           | NO |     | NULL    |                      
  sex        | enum("MALE", "FEMALE")                | NO |     | NULL    |                      
  birthday   | date                                  | NO |     | NULL    |
  status     | enum("DATES", "ADOPT", "BOTH")        | YES|     | NULL    |                      
  shelter_Username   | varchar(52)                           | NO | MUL | NULL    |                      
  created_at | datetime                              | NO |     | NULL    |                      
  updated_at | datetime                              | NO |     | NULL    |                      
  uuid       | varchar(36)                           | NO | PRI | NULL    |
  url        | varchar(255)                          | NO |     | NULL    |
  width      | varchar(36)                           | NO |     | NULL    | 
  height     | varchar(36)                           | NO |     | NULL    |

### posts

  Field         | Type                                  |Null| Key | Default | Extra                
  --------------| ------------------------------------- | ---| --- | ------- | -------------------
  Posted_by     | varchar(52)                           | NO | MUL | NULL    |                      
  post_title    | varchar(255)                          | NO |     | NULL    |                      
  text_post     | TEXT                                  | NO |     | NULL    |                      
  image_urlpath | varchar(255)                          | YES| UNI | NULL    |                      
  post_uuid     | varchar(36)                           | NO | PRI | NULL    |                      
  created_at    | datetime                              | NO |     | NULL    |                      
  updated_at    | datetime                              | NO |     | NULL    |                      

### comments_on_posts
  Field         | Type         | Null | Key | Default | Extra |
  --------------|--------------|------|-----|---------|-------|
  comment_uuid  | varchar(36)  | NO   | PRI | NULL    |       |
  commented_by  | varchar(52)  | NO   |     | NULL    |       |
  comment_body  | varchar(255) | NO   |     | NULL    |       |
  image_urlpath | varchar(255) | YES  | UNI | NULL    |       |
  created_at    | datetime     | NO   |     | NULL    |       |
  updated_at    | datetime     | NO   |     | NULL    |       |
  post_uuid     | varchar(36)  | NO   | MUL | NULL    |       |

##### Access API through localhost:3000/api/replace-with-route


| Routes                              | Remarks 
| ----------------------------------- | ----------------------------------------------------------------------|
| `/`                                 | Displays message(temp)                                                |
| `/login/user`                       | Redirects to `/feed` if logged in                                     |
| `/login/shelter`                    | Redirects to `/feed` if logged in                                     |
| `/logout`                           | Redirects to `/` after user logged out                                |
| `/signup/user`                      | Redirects to `/feed` if logged in                                     |
| `/signup/shelter`                   | Redirects to `/feed` if logged in                                     |
| `/feed `                            | Displays message (temp)                                               |
| `/accounts/viewShelters`            | View all shelter accounts                                             |
| `/accounts/viewUsers`               | View all user accounts                                                |
| `/accounts/updateShelterInfo`       | Update info (shelter)                                                 |
| `/accounts/updateUserInfo`          | Update info (user)                                                    |
| `/accounts/deleteShelterAccount`    | Delete account (shelter)                                              |
| `/accounts/deleteUserAccount`       | Delete account (user)                                                 |   
| `/pets/`                            | Display message                                                       |
| `/pets/viewShelterPets `            | View pets owned by the shelter                                        |
| `/pets/viewUserPets`                | View pets owned by the user                                           |
| `/pets/:owner/viewShelterPets`      | View pets of owner                                                    |
| `/pets/:owner/viewUserPets`         | View pets of owner                                                    |
| `/pets/:owner/deleteAllUserPets`    | Delete all pets of a given user                                       |
| `/pets/:owner/deleteAllShelter`     | Delete all pets of a given shelter                                    |
| `/pets/addShelterPet`               | Add a pet to db (for shelters)                                        |
| `/pets/addUserPet`                  | Add a pet to db (for users)                                           |
| `/pets/:pet_uuid/viewSpecificPetUser`| View a pet of user                                                   |
| `/pets/:pet_uuid/viewSpecificPetShelter`| View a pet of shelter                                             |
| `/pets/:pet_uuid/updateUserPets`    | Update info of a pet (for users)                                      |
| `/pets/:pet_uuid/updateShelterPets` | Update info of a pet (for shelters; could be used for ADOPT and DATES, set status to ADOPT, DATES, OR BOTH)                                   |
| `/pets/:pet_uuid/deleteUserPet`     | Delete a single pet given the pet_uuid (for users)                    |
| `/pets/:pet_uuid/deleteShelterPet`  | Delete a single pet given the pet_uuid (for shelters)                 |
| `/community/ `                      | Displays all posts sorted by date                                     |
| `/community/:post_uuid/viewPost`    | View a post given its uuid                                            |  
| `/community/:user/viewPosts`        | View all posts of a user                                              |
| `/community/:post_uuid/deletePost ` | Delete a post given its uuid (iff post is posted by the user itself)  |
| `/community/deleteAllMyPosts`       | Delete all posts of user                                              |
| `/community/addPost`                | Add post                                                              |
| `/community/:post_uuid/addComment   | Add a comment                                                         |
| `/community/:post_uuid/viewAllComments`| View all comments in the post                                      |
| `/:post_uuid/:comment_uuid/deleteComment` | Delete a comment                                                |
| `/*`                                | Redirects to `/feed` if logged in, otherwise redirect to `/`          |

### Installing and Starting
1. Install [NodeJS](https://nodejs.org/en/download/) and [MySQL](https://dev.mysql.com/downloads/installer/).
2. Install dependencies with `npm install`.
3. Configure database by editing **\database\db.js** and **\database\connection.js**. Replace with your MySQL password.
4. Create database with `cd database && node config.js`.
5. Start using `cd .. && npm start`.


### Developers

##### Backend
* Evangelista, Erlen Mae
* Somabes, Kia Mei



##### Frontend
* Gotis, Ciara Mae
* Silaya, Ralph Lawrence
