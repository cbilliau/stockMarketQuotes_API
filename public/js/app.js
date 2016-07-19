"use strict"

// cache object
var Data = {
    appUser: {
      _id: null,
      username: '',
      stocks: []
    },
    currentStockViewed: ''
};
// api object
var modApi = {};

// view obj
var View = {};

// user obj
var User = {};

// $.ajax({
//         method: 'get',
//         url: '/users',
//     })
//     .success(function(res) {
//         console.log(res);
//     })

// User
User.pushStockToArray = function(stockToAdd) {
  if (!Array.isArray(Data.appUser.stocks)) {
    Data.appUser.stocks = [];
    Data.appUser.stocks.push(stockToAdd);
    return Data.appUser.stocks;
  }
  Data.appUser.stocks.push(stockToAdd);
  return Data.appUser.stocks;
}

// Api
modApi.getUser = function(userName, passWord) {
    var request = {
        url: '/users/' + userName,
        method: 'get',
        dataType: 'json',
        data: {
            username: userName,
            password: passWord
        }
    }
    return $.ajax(request);
}

// create user
modApi.createUser = function(userName, passWord) {
    var request = {
        url: '/users',
        method: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: '{  "username": userName, "password": passWord   }'
    }
    console.log(request);
    return $.ajax(request);
}

// update user stock array in db
modApi.updateStock = function(stockArr, userId)  {
    console.log(stockArr);
    var request = {
        url: '/users/' + userId,
        type: 'put',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ stocks: stockArr}),
        success: function (msg) {
            alert('Success');
          },
        error: function (err){
            alert('Error');
          }
    }
    console.log(request);
    $.ajax(request);
}

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
        // console.log(request);
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
        console.log(stock);
        Data.currentStockViewed = stock; // Assign current stock to user variables
        var results = modApi.getStockData(stock)
            .then(function(results) {
                View.postStockResults(results);
            });
    });
    //submit user button (needs test)
    $('button#submitUser').on('click', function(e) {
        e.preventDefault();
        var username = $('input#userName').val();
        var password = $('input#password').val();
        var results = modApi.getUser(username, password) //look up sending username/password basic auth through jquery
            .then(function(results) {
                if (results == null) {
                    var newUser = modApi.createUser(username, password)
                        .then(function(newUser) {
                            console.log(newUser);
                        });
                } else {
                  Data.appUser = results; // Assign results to Data.appUser
                  console.log(Data.appUser);
                }
            });
    });
    // add stock
    $('a#addStock').on('click', function(e) {
        e.preventDefault();
        var stockToAdd = Data.currentStockViewed;
        console.log(stockToAdd);
        var stockArr = User.pushStockToArray(stockToAdd);
        console.log(stockArr);
        var userId = Data.appUser._id;
        var results = modApi.updateStock(stockArr, userId)
            .then(function(results) {
              console.log(results);
            });

    });
});
// delete stock
$('a#deletestock').on('click', function(e) {
    e.preventDefault();
    var stockToRemove = Data.currentStockViewed;
    var userId = Data.appUser._id;
    var results = modApi.removeStock(stockToRemove, userId)
        .then(function(results) {

        });
});

// });
