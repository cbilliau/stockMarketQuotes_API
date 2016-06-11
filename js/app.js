"use strict"

// cache object
var Data = {
	searchHistory: [],
};
// api object
var modApi = {};
// view obj
var View = {};

// get ticker symbol
modApi.getTickerSymbol = function(name) {
	var url = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp"
	var request = {
		input: name,
		callback: "my_function"
	}
		console.log(request);
	return $.getJSON(url, request);
};

// API test
// var test = modApi.getTickerSymbol("netflix");
// console.log(test);

// get stock data
modApi.getStockData = function(stockSymbol)	{
	var url = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp"
	var request = {
		symbol: stockSymbol,
		callback: symbolResults
	}

	return $.getJSON(url, request);
};

// generate views
// clear symbol area
View.clearSymbolArea = function()	{
	$('div#symbolArea').html('');
};

// fetch name from input
View.fetchUserQuery = function()	{
	return $('input#companyName').val();
};

// post results from symbol api
View.postSymbolResults = function(results)	{
	$.each(results, function(i,item)	{
		var data = View.genSymbolResultsHtml(item);
		$('div#symbolArea').append(data);
	});
};

// generate symbol html
View.genSymbolResultsHtml = function(item) {
	var html = "";
	html += "<ul><li>" + item.Symbol + ", " + item.Name + ", " + item.Exchange + "</li></ul";
	return html;
};

// get query from input
$(function() {
	$('form').submit(function(e)	{
		e.preventDefault();
		View.clearSymbolArea();
		var query = View.fetchUserQuery();
		modApi.getTickerSymbol(query)
		.then(function(results) {
			View.postSymbolResults(results);
		});
	});
});
