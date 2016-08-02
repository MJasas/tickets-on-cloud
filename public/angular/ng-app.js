/*********************************
TicketSupportApp
*********************************/

angular.module('TicketsSupportApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

// angular.module('TicketsSupportApp')
//     .config(function($httpProvider) {
//         $httpProvider.defaults.useXDomain = true;
//         delete $httpProvider.defaults.headers.common['X-Requested-With'];
//     });

/*********************************
Routing
*********************************/

angular.module('TicketsSupportApp').config(function($routeProvider) {
  $routeProvider.
   //Root
    when('/main', {
        templateUrl: 'angular/views/frontPage.html',
        controller: 'FrontPageCtrl',
        css: 'styles/front-page.css'
    }).
    when('/ticket/id/:ticketID', {
        templateUrl: 'angular/views/singleTicketPage.html',
        controller: 'SingleTicketPageCtrl'
    }).
    when('/submit/new-ticket', {
        templateUrl: 'angular/views/submitForm.html',
        controller: 'SubmitNewTicketCtrl',
        css: 'styles/submit-form.css'
    }).
    when('/show/all-tickets', {
        templateUrl: 'angular/views/ticketsBoard.html',
        controller: 'TicketsBoardCtrl'
    }).
    otherwise({
        redirectTo: '/main'
    });
});
