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
/src/controllers/users.js

/src/models/user.js

/src/repositories/user.js

/src/validation/users.js

/src/routes.js

### Optional
/infra/schemas.js

package.json


## Client
### Necessary
/src/index.js -> router

/src/components/sections/Users.jsx

/src/components/sections/UserForm.jsx

/src/components/structure/Navigator.jsx

/src/services/users.js

/src/static/userResource.json

### Optional
package.json


The other files generated are general, being part of the boilerplate.