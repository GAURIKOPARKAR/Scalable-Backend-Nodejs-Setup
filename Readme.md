Steps taking to setup the backend Project in MERN Stack

1. npm init
2. Created the folder public/temp(This are empty folder), We generally keep images, videos, or files on third party server like aws, azure, cloudinary. and not in database.
For adding that on eg. cloudinary we first keep it at our server i.e backend and then push it to cloudinary. 
3. git dont track empty folders and push it on github, that why created a file called ".gitkeep" so after this git started detecting empty folders.
4. Created ".gitignore" file in our main folder(Backend-Practise-Nodejs)
 In .gitignore file we keep all the sensitive data files(environment variables) which we dont want to get expose on github.(You can generate this file content by searching .gitignore generator on google and by any site for nodejs and then can edit if you want)

''' Environment variables are variables that are set outside of your application's code and are used to configure various aspects of your application's behavior. They are often used to store sensitive information or configuration settings that might change between different environments, such as development, testing, and production.'''

5. Created ".env" file
6. Created 'src' folder and in that created index.js app.js constants.js
7. "type": "module" added in package.json
8. npm i -D nodemon
Install nodemon, which will keep restarting server if any change is introduced.(-D or -Dev dependency means development dependency)
9. Added "dev": "nodemon src/index.js" in package.json
10. Created folders in src "controllers db models utils middlewares routes"
11. Created account on MongoDB Atlas(cloud mongobd) and created a project there.
12. Set env files with variables like port and mongodb project url
13. Install mongoose, express and dotenv(application is going to load by environment variable, so this pkg is required)
14. Wrote variable value and export it in constants.js because we dont want to write variable value everywhere, will use variable name in other files so, in future if we need to change it we dont need to change it everywhere.
15. Always import and config dotenv package in the first statement of the first file where execution going to get started(index.js)
16. There two approach to connect to database either write everything directly in index.js(in IIFE) file or write db connection logic in db folder.

While connecting to database always use try,catch and always use async,await

17. If you change anything in .env file then you have to restart nodemon manually.
18. import express in app.js
19. install cookie-parser and cors and use it in app.js
app.use() is nothing but a middleware.
20. Some other configurations done in app.js like urlencoded json static
21. Created a higher order middlewear function file called asyncHandler.js in utils.
22. Created apiError.js in utiles to handle errors, by extending Nodejs class called Errors.