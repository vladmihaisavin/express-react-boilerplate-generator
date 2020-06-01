# express-react-boilerplate-generator

# How to use
## CLI
1. Go to a directory where you want to start a project;
2. Run `create-express-react-app` in your terminal or command prompt;
3. Type a project name when your are prompted;
4. Add the connection details to the database, when prompted (optional);
5. Open the directory with that project name
6. Follow the instructions from the README file
7. Happy coding!

# Files to be customly generated:

## Server
### Necessary
/server/src/controllers/users.js

/server/src/models/user.json

/server/src/repositories/user.js

/server/src/validation/users.js

/server/src/routes.js

### Optional
/server/infra/schemas.js

/server/package.json


## Client
### Necessary
/server/src/index.js -> router

/server/src/components/sections/Users.jsx

/server/src/components/sections/UserForm.jsx

/server/src/components/structure/Navigator.jsx

/server/src/services/users.js

/server/src/static/userResource.json

### Optional
/server/package.json


The other files generated are general, being part of the boilerplate.