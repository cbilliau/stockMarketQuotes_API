# Stock Market Quotes App - jQuery & Ajax

jQuery app for searching company stock symbols and getting most recent stock quotes.
![screenshot](/public/assets/stock.png "screenshot")

## Overview

Stock Market Quotes is a simple frontend javascript app using jQuery and the Bootstrap UI to provide the user with quick results when searching for a company's stock symbol and then getting that company's most recent stock quote.


## Use Case

Simplicity. Most stock-type apps try to provide as much information as possible and be everything to everyone causing user distractions. This app was designed to provide the user with a simple, stripped down UI for the user who wants to only find a stock symbol and get it's most recent quote data.


## Design

This app intentionally uses stock Bootstrap CSS to provide a sense of familiarity and a level of professionalism most users would expect at a professional level. The simple design and small footprint all this app to easily scale as well as be plugged into a larger application.


## Tech notes


* The app is built using jQuery and Bootstrap.

* The app draws stock symbols and quote data from MarkitOnDemand.com (http://markitondemand.com).

* Data is pulled each time a company name is queried and when a symbol anchor is clicked.

* The API is accessed through jQuery's AJAX process.


## Development Roadmap

This is v1.0 of the app. Future enhancements are expected to include:

* The creation of user accounts and persistence by means of incorporating the MEAN stack to provide a server (Express) and database (MongoDB).


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


## Acknowledgments

* http://dev.markitondemand.com/MODApis/ - MarkitOnDemand.com is dedicated to the delivery and presentation of financial data, transforming complex information into elegant user experiences.
