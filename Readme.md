My code is a website for purchasing electronics. To run it, you need to download the node modules, run npm i in the terminal, open XAMPP Control Panel and press "Start" for Apache and MySQL. After that run npm start in the terminal.
The server will be available at: http://localhost:3000


You can log in to the site as a user or an admin.username for admin is: admin@myshop.local, 
password: 123
The admin can add, edit, and delete products.

Technologies used:
bcryptjs, dotenv, ejs, express, express-session, mysql2, sequelize, swagger-ui-express

User roles:

Regular User:
Can view products, Has read-only access

Administrator:
Can add products, Can edit products, Can delete products
