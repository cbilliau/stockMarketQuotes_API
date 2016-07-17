"use strict"

// cache object
var Data = {
    searchHistory: [],
    appUser: {
        id: null,
        username: '',
        stocks: []
    },
    currentStockViewed: ''
};
// api object
var modApi = {};

// view obj
var View = {};

var User = {};

$.ajax({
        method: 'get',
        url: '/users',
    })
    .success(function(res) {
        console.log(res);
    })

// User
// Assign current logged in user data to variables
User.appUser = function(results) {
    Data.appUser.id = results._id;
    Data.appUser.username = results.username;
    Data.appUser.stocks = results.stocks;
};

// Assign current stock being viewed to user variables
User.currentStockViewed = function(results) {
    Data.currentStockViewed = results.name;
};

User.addStockToUser = function(results) {
    var newStock = results.stocks;
    Data.appUser.stocks.push(newStock);
};


// api
modApi.getUser = function(userName, password) {
    var url = '/users/:name';
    var route = 'post';
    var user = {
        username: userName,
        password: password
    };
    var request = {
        method: route,
        url: url,
        data: {
            user
        }
    };
    console.log(request);
    return $ajax(request);
};

// create user
modApi.createUser = function(userName, password, stocks) {
    var url = '/users';
    var route = 'post';
    var newUser = {
        username: userName,
        password: password,
        stocks: stocks
    };
    var request = {
        method: route,
        url: url,
        data: {
            newUser
        }
    };
    console.log(request);
    return $ajax(request);
};

// add stock
modApi.addStock = function(symbol, userId) {
    var url = '/users/:id';
    var route = 'post';
    var stockAdd = {
        id: userId,
        stocks: symbol
    };
    var request = {
        method: route,
        url: url,
        data: {
            stockAdd
        }
    };
    console.log(request);
    return $ajax(request);
};

// remove stock
modApi.removeStock = function(symbol, userId) {
    var url = '/users/:id';
    var route = 'delete';
    var stockRemove = {
        id: userId,
        stocks: symbol
    };
    var request = {
        method: route,
        url: url,
        data: {
            stockRemove
        }
    };
    console.log(request);
    return $ajax(request);
};

// get ticker symbol
modApi.getTickerSymbol = function(name) {
    var url = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp"
    var request = {
        url: url,
        data: {
            input: name
        },
        callback: "my_function",
        dataType: "jsonp"
    }
    console.log(request);
    return $.ajax(request);

};

// get stock data
modApi.getStockData = function(stockSymbol) {
    var url = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp"
    var request = {
        url: url,
        data: {
            symbol: stockSymbol
        },
        callback: "my_function",
        dataType: "jsonp"
    }
    return $.ajax(url, request);
};

// generate views
// clear symbol area
View.clearArea = function(el) {
    el.innerHTML = "";
};

// fetch name from input
View.fetchUserQuery = function() {
    return $('input#companyName').val();
};

// post results from symbol api
View.postSymbolResults = function(results) {
    var el = document.getElementById('symbolArea');
    View.clearArea(el);
    $.each(results, function(i, item) {
        var data = View.genSymbolResultsHtml(item);
        $('ul#symbolArea').append(data);
    });
};

// generate symbol html
View.genSymbolResultsHtml = function(item) {
    var html = "";
    html += "<li><a class='stock'>" + item.Symbol + "</a>, " + item.Name + ", " + item.Exchange + "</li>";
    return html;
};

// post stock info
View.postStockResults = function(stockData) {
    var el = document.getElementById('stockInfoStart');
    View.clearArea(el);
    var html = "";
    for (var prop in stockData) {
        switch (prop) {
            case "Name":
            case "Symbol":
            case "LastPrice":
            case "Open":
            case "Change":
            case "Volume":
            case "Timestamp":
                var html = html + View.genStockResultsHtml(prop, stockData[prop]);
                break;
        }
    }
    el.innerHTML = html;
};

// generate stock html
View.genStockResultsHtml = function(i, data) {
    var html = "";
    html += "<p><b>" + i + "</b>: " + data + "</p>";
    return html;
}

View.displayUserData = function() {
    var username = Data.appUser.username;
    var stocks = Data.appUser.stocks;
    var el = document.getElementById('userName');
    var el1 = document.getElementById('userStockList');
    var html = el.innerHTML;
    html = html + username;
    var html1 = el1.innerHTML;
    html1 = html1 + stocks;
    View.clearArea(el);
    View.clearArea(el1);
    el.innerHTML = html;
    el1.innerHTML = html1;
}

// Doc Ready
$(function() {
    // get stock symbol
    $('form').submit(function(e) {
        e.preventDefault();
        // View.clearArea();
        var query = View.fetchUserQuery();
        var results = modApi.getTickerSymbol(query)
            .then(function(results) {
                View.postSymbolResults(results);
            });
    });
    //post stock results
    $('#symbol').on('click', '.stock', function(e) {
        e.preventDefault();
        var stock = $(this).text();
        var results = modApi.getStockData(stock)
            .then(function(results) {
                View.postStockResults(results);
                // Assign current stock to user variables
                User.currentStockViewed(results);
            });
    });
    //submit user button (needs test)
    $('button#submitUser').on('click', function(e) {
        e.preventDefault();
        var username = $('input#username').text();
        var password = $('input#password').text();
        var results = modApi.getUser(username, password)
            .then(function(results) {
                if (results = null) {
                    var results = modApi.createUser(username, password)
                        .then(function(results) {
                            View.displayUserData(results);
                            User.appUser(results);
                        });
                }
                // Assign user data to app variables
                User.appUser(results);
                View.displayUserData();
            });
    });
    // add stock
    $('a#addStock').on('click', function(e) {
        e.preventDefault();
        var stockToAdd = Data.currentStockViewed;
        var userId = Data.appUser.id;
        var results = modApi.addStock(stockToAdd, userId)
            .then(function(results) {
                User.addStockToUser(results);
                View.displayUserData();
            });
    });
    // delete stock
    $('a#deletestock').on('click', function(e) {
        e.preventDefault();
        var stockToRemove = Data.currentStockViewed;
        var userId = Data.appUser.id;
        var results = modApi.removeStock(stockToRemove, userId)
            .then(function(results) {
                User.removeStockFromUser(results);
                View.displayUserData();
            });
    })

});
