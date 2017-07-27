var api_key = 'ff56fc23c898727944c4ccce5862a4c0';

$(document).ready(function(){
  $.ajax({
    url: 'http://api.themoviedb.org/3/search/movie?api_key=' + api_key + '&query=when+harry+met+sally',
    dataType: 'jsonp',
    jsonpCallback: 'callback'
  }).done(function(response) {
    for (var i = 0; i < response.results.length; i++) {
      $('#tmdb_results').append('<li>' + response.results[i].title + '</li>');
    }
  });
});