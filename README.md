# Documentation

I've created tutorial videos going over how to set things up

How to set up mongodb:
https://www.loom.com/share/f6e94cac87594924bea3f2293b39bb6a?sid=a2557fa8-bcd4-45b3-b117-17616abff690

How to set up vercel & frontend:
https://www.loom.com/share/78623a371de4467aaf1349311d3d3806?sid=d27d31d2-a79a-4666-8696-7f00f5c74189

Gallerize Utils: https://github.com/kolberszymon/gallerizeUtils
Gallerize Project: https://github.com/kolberszymon/gallerizev2

In summary:

Mongodb:

1. Create an account on https://www.mongodb.com/
2. Create a cluster
3. Add 0.0.0.0 to allowed IP list (0.0.0.0 means that every IP address is able to access it, it still need password and login to do so, therefore it's secure enough)
4. Clone https://github.com/kolberszymon/gallerizeUtils repository
5. Run npx ts-node src/utils/moveInputFromCSVToMongo.ts command from terminal in main folder

Possible configuration & tweaks:

1. Connection URI which can be found in cluster settings on mongodb.com
2. Mongodb name which will dictate under which database will data be stored along with input and concept-info collections name, you can find which variables to set in env.example file

Vercel:

1. Create an account on vercel using github
2. Fork gallerize project from https://github.com/kolberszymon/gallerizev2 repo
3. Create a new project on vercel
4. Add env variables which can be found in .env.example file
5. You can also alter a few options in config.ts file
