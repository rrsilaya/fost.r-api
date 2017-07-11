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
  Field      | Type         |Null| Key | Default | Extra  
  ---------- | ------------ |--- | --- | ------- | -----  
  Username   | varchar(36)  | NO | PRI |         |        
  firstname  | varchar(36)  | NO |     | NULL    |        
  lastname 	 | varchar(36)  | NO |     | NULL    |        
  birthday   | date         | NO |     | NULL    |        
  address    | varchar(236) | NO |     | NULL    |        
  contactnum | int(11)      | NO |     | NULL    |        
  email      | varchar(36)  | NO | PRI | NULL    |        
  password   | varchar(255) | NO |     | NULL    |        
  created_at | datetime     | NO |     | NULL    |        
  updated_at | datetime     | NO |     | NULL    |        

#### shelters
  Field      | Type         |Null| Key | Default | Extra  
  ---------- | ------------ | ---| --- | ------- | -----  
  Username   | varchar(36)  | NO | PRI |         |        
  shelter_name  | varchar(36)  | NO |     | NULL    |     
  address    | varchar(236) | NO |     | NULL    |       
  contactnum | int(11)      | NO |     | NULL    |        
  email      | varchar(36)  | NO | PRI | NULL    |        
  password   | varchar(255) | NO |     | NULL    |        
  created_at | datetime     | NO |     | NULL    |        
  updated_at | datetime     | NO |     | NULL    |        

#### pets_of_users
  Field           | Type                                  |Null| Key | Default | Extra                
  --------------- | ------------------------------------- |----| --- | ------- | -------------------  
  pet_id          | int (11)                              | NO | PRI | NULL    | auto_increment       
  name            | varchar(52)                           | NO |     | NULL    |                      
  kind   	        | enum('DOG', 'CAT', 'BIRD', 'OTHERS')  | NO |     | NULL    |                      
  breed           | varchar(36)                           | NO |     | NULL    |                      
  sex             | enum('MALE', 'FEMALE')                | NO |     | NULL    |                      
  birthday        | date                                  | NO |     | NULL    |                      
  created_at      | datetime                              | NO |     | NULL    |                      
  updated_at      | datetime                              | NO |     | NULL    |                      
  user_Username   | varchar(36)                           | NO | MUL | NULL    |                      

#### pets_of_shelters
  Field              | Type                                  |Null| Key | Default | Extra                
  ------------------ | ------------------------------------- | ---| --- | ------- | -------------------  
  pet_id             | int (11)                              | NO | PRI | NULL    | auto_increment       
  name               | varchar(52)                           | NO |     | NULL    |                      
  kind   	           | enum('DOG', 'CAT', 'BIRD', 'OTHERS')  | NO |     | NULL    |                      
  breed              | varchar(36)                           | NO |     | NULL    |                      
  sex                | enum('MALE', 'FEMALE')                | NO |     | NULL    |                      
  birthday           | date                                  | NO |     | NULL    |                      
  status             | enum("DATES", "ADOPT", "BOTH")        | NO |     | NULL    |
  created_at         | datetime                              | NO |     | NULL    |                      
  updated_at         | datetime                              | NO |     | NULL    |                      
  shelter_Username   | varchar(52)                           | NO | MUL | NULL    |                      

### App Routes
| Route             | Page            | Remarks                            |
| ----------------- | --------------- | ---------------------------------- |
| `/`               | index           | Redirects to `/adopt` if logged in |
| `/login`          | login           | Redirects to `/adopt` if logged in |
| `/login_user`     | login_user      | Redirects to `/adopt` if logged in |
| `/login_shelter`  | login_shelter   | Redirects to `/adopt` if logged in |
| `/signup`         | signup          | Redirects to `/adopt` if logged in |
| `/signup_user`    | sigunup_user    | Redirects to `/adopt` if logged in |
| `/signup_shelter` | sigunup_shelter | Redirects to `/adopt` if logged in |
| `/adopt`          | adopt           | Redirects to `/` if not logged in  |
| `/community`      | community       | Redirects to `/` if not logged in  |
| `/dates`          | dates           | Redirects to `/` if not logged in  |
| `/rescue`         | rescue          | Redirects to `/` if not logged in  |
| `/*`              | no-page         | Error 404 Page, redirects to `/` if not logged in |

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
