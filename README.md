# express-react-boilerplate-generator

# Contents
1. Express API<br>
1.1. ExpressJS<br>
1.2. Authentication: PassportJS with JWT<br>
1.3. Testing: Mocha and Chai<br>
1.4. Data persistence - MySQL<br>
1.5. Validation: Joi<br>
1.6. Documentation: Swagger
2. React Client APP<br>
2.1. React app created with create-react-app<br>
2.2. Material UI theme<br>
2.3. Authentication with JWT token<br>
2.4. AJAX calls via axios.js<br>
2.5. Proxy for local development

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
/server/src/controllers/users.js<br>
/server/src/models/user.json<br>
/server/src/repositories/user.js<br>
/server/src/repositories/index.js<br>
/server/src/validation/users.js<br>
/server/src/routes.js<br>
/server/src/app.js<br>
/server/index.js<br>

### Optional
/server/infra/schemas.json<br>
/server/package.json


## Client
### Necessary
/client/src/index.js -> router<br>
/client/src/components/sections/Users.jsx<br>
/client/src/components/sections/UserForm.jsx<br>
/client/src/components/structure/Header.jsx<br>
/client/src/components/structure/Navigator.jsx<br>
/client/src/services/users.js<br>
/client/src/static/userResource.json

### Optional
/client/package.json


The other files generated are general, being part of the boilerplate.