"use strict"

// cache object
var Data = {
    searchHistory: [],
};
// api object
var modApi = {};

// view obj
var View = {};


$.ajax({
  method: 'get',
  url: '/users',
  })
  .success(function(res){
    console.log(res);
  })

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
    // get query from input
$(function() {
    $('form').submit(function(e) {
        e.preventDefault();
        // View.clearArea();
        var query = View.fetchUserQuery();
        var results = modApi.getTickerSymbol(query)
            .then(function(results) {
                View.postSymbolResults(results);
            });
    });
    $('#symbol').on('click', '.stock', function(e) {
        e.preventDefault();
        var stock = $(this).text();
        var results = modApi.getStockData(stock)
            .then(function(results) {
                View.postStockResults(results);
            });
    });
});
