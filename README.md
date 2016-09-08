# Adding Auth0 to the Band List app

We're going to revisit your band list app from last week. You are going to add Auth0 to your front end so that your app will only display your band list when a user is logged in.

## Steps
#### Step 1: Fork and clone the homework repo 
- Just like always

#### Step 2: Check the main.js file to ensure you are using the correct url for your AJAX calls
- The starter code uses `http://localhost:3000/bands`. Be sure your API uses the same url. If not, edit main.js to match your url

#### Step 3: From the command line cd into your band-list-api directory and type 'nodemon' to start your server

#### Step 4: Open another command line tab and cd into band-list-frontend-auth0. 
- Run either `python -m SimpleHTTPServer 4000` or `serve . -p 4000` to run your app at `http://localhost:4000`

#### Step 5: Add Auth0 to your front end so a welcome page shows if not logged in and your app shows when logged in

## Tips
- Refer to the Auth0 documentation for help (https://auth0.com/docs/libraries/lock)
- Remember to edit your index.html file - add the Auth0 script, create divs to hide and/or show depending on if you're logged in or not, add buttons to login/logout

## Licensing
All content is licensed under a CC­BY­NC­SA 4.0 license.
All software code is licensed under GNU GPLv3. For commercial use or alternative licensing, please contact legal@ga.co.
