![screensh](./readme_img/MyBest11.gif)

    Create your Own Best11!
    Next.js + MongoDB + Typescript + Google OAuth2.0

Comment&Repply
![screensh](./readme_img/comment&repply.PNG)

Best Boards(Boards get more than three like. you can change best Boads line)
![screensh](/readme_img/best.PNG)

Pagination
![screensh](/readme_img/pagination.PNG)

<br/>
Like&Dislike

![screensh](/readme_img/like.PNG)
![screensh](/readme_img/like2.PNG)
#
[1] setting Google OAuth2.0
#
I used Google OAuth2.0 for login&logout system.
<br/>
If Google Oauth Setting is success, when click the login button

![screensh](./readme_img/login.PNG)

you can see google account list
![screensh](./readme_img/login2.PNG)

and logout button<br/>
![screensh](./readme_img/login3.PNG)

#
[2] create and setting next.config.js in root folder.  
#

if you run this project locally, Setting 
<br/><br/>
SERVER_URL: "http://localhost:3000"
<br/>
images: {
<br/>
    domains: ['localhost:3000', 'i.esdrop.com']
}
<br/>
  env: {
      <br/>
      MONGO_URI: 'mongodb://localhost:27017/[putYourDBName]?
      <br/>
      readPreference=primary&appname=MongoDB%20Compass&ssl=false',
      <br/>
      GOOGLE_ID: '[putYourGoogleOauthId]',
      <br/>
      GOOGLE_PW: '[putYourGoogleOauthPW]',
      <br/>
      SERVER_URL: "http://localhost:3000"
      <br/>
  }


![screensh](./readme_img/nextconfig.PNG)

put your mongodb_url, google oauth2.0's id and password. like below.
I used essdrop for club flag img.

if you wanna run this project heroku or aws or vercel... and so on...
change SERVER_URL, images domains, mongodb_uri.

#
[3] unzip public/players.zip and add players collections(players.json) in ur database.
#

![screensh](./readme_img/unzip.PNG)

I got players info(name, img) from https://www.kaggle.com/bryanb/fifa-player-stats-database

If you wanna add additional players or team, add player's info to players collection!
