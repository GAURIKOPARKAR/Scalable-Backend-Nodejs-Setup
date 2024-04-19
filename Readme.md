Steps taking to setup the backend Project in MERN Stack

1. npm init
2. Created the folder public/temp(This are empty folder), We generally keep images, videos, or files on third party server like aws, azure, cloudinary. and not in database.
For adding that on eg. cloudinary we first keep it at our server i.e backend and then push it to cloudinary. 
3. git dont track empty folders and push it on github, that why created a file called ".gitkeep" so after this git started detecting empty folders.
4. Created ".gitignore" file in our main folder(Backend-Practise-Nodejs)
 In .gitignore file we keep all the sensitive data files(environment variables) which we dont want to get expose on github.(You can generate this file content by searching .gitignore generator on google and by any site for nodejs and then can edit if you want)

''' Environment variables are variables that are set outside of your application's code and are used to configure various aspects of your application's behavior. They are often used to store sensitive information or configuration settings that might change between different environments, such as development, testing, and production.'''

5. Created ".env" file
6. Created 'src' folder