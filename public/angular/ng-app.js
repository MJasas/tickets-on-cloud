/*********************************
TicketSupportApp
*********************************/

angular.module('TicketsSupportApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

// /*********************************
// Custom service for managing Ticket submit
// *********************************/
// angular.module('TicketsSupportApp').service('formSubmitService', ['$http', function($http){

//         this.uploadToUrl = function(fd, url){

//             $http({
//                 method : "POST",
//                 url : url,
//                 withCredentials: false,
//                 headers: {'Content-Type': undefined},
//                 transformRequest: angular.identity,
//                 params: { fd },

//             })

//             .success(function(response){
//                 alert(response);
//                 console.log(response);
//             })

//             .error(function(err){
//                 alert(err);
//             });
//         }
// }]);

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
