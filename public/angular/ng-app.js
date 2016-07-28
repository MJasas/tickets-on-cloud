/*********************************
TicketSupportApp
*********************************/

angular.module('TicketsSupportApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

/*********************************
Routing
*********************************/

angular.module('TicketsSupportApp').config(function($routeProvider) {
  $routeProvider.
   //Root
    when('/main', {
        templateUrl: 'angular/views/frontPage.html',
        controller: 'FrontPageCtrl'
    }).
    when('/ticket/id/:ticketID', {
        templateUrl: 'angular/views/singleTicketPage.html',
        controller: 'SingleTicketPageCtrl'
    }).
    when('/submit/new-ticket', {
        templateUrl: 'angular/views/submitForm.html',
        controller: 'SubmitNewTicketCtrl'
    }).
    when('/show/all-tickets', {
        templateUrl: 'angular/views/ticketsBoard.html',
        controller: 'TicketsBoardCtrl'
    }).
    otherwise({
        redirectTo: '/main'
    });
});
