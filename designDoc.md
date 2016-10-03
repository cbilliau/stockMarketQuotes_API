Stock Market App

Overview: This app allows a user to type in a stock symbol or name and retrieve a list of possible company names and stock symbols. The user can click on a company symbol and receive the most recent stock quote for that symbol.The user may create or login into their account and add or remove the retrieved stock symbol name to their portfolio. The app will store their user account and stock symbol choices in a database.

Endpoints:
METHOD/PATH-Description

1. POST/users - Allow user to create an account
2. GET/users - User login
3. GET/users/id - Retrieve user portfolio
4. PUT/users/id - Add stock symbol to the user's portfolio
5. DELETE/users/id - Delete stock symbol from user's portfolio
