/*********************************
TicketSupportApp
*********************************/
var app = angular.module('TicketsSupportApp', ['ngRoute']);

/*********************************
Custom directive for file handling
*********************************/
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

/*********************************
Custom service for managing Ticket submit
*********************************/
app.service('formSubmitService', ['$http', function($http){

        this.uploadToUrl = function(fd, url){

            $http.post({
                method : "POST",
                url : url,
                withCredentials: false,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                params: { fd },

            })

            .success(function(response){
                alert(response);
                console.log(response);
            })

            .error(function(err){
                alert(err);
            });
        }
}]);
/*********************************
Ticket Submit Controller
*********************************/

app.controller('SubmitNewTicketController', function($scope, $http, $location, formSubmitService){
    // Reset fields
    $scope.resetForm = function(){
      $scope.newTicket = {};
    }

    // Submit new ticket
    $scope.submitForm = function(){
        var form = document.getElementsByName('submitNewTicketForm').item(0); 
        // submit form via Angular custom service
        var fd = new FormData(form);
        formSubmitService.uploadToUrl(fd, 'api/new-ticket/submit');
        
        // submit form data via ajax 
        // sendForm(formData);
    };

    // test server
    $scope.testServer = function(){
       $http({
           method : "GET",
           url : "/api/test/server"
       }).then(function mySuccses(response){
           console.log('Response status: ' + response);
       }, function myError(response) {
           console.log(response)
       });
    };

});

/*********************************
Tickets Board Controller
*********************************/

app.controller('TicketsBoardController', function($scope, $http, $location){
    
});

/*********************************
Routing
*********************************/

app.config(function($routeProvider) {
  $routeProvider.
    //Root
    when('/', {
        templateUrl: 'angular/views/SubmitForm.html',
        controller: 'SubmitNewTicketController'
    }).
    when('/ticketsBoard', {
        templateUrl: 'angular/views/ticketsBoard.html',
        controller: 'ticketsBoardController'
    });
    // otherwise({
    //     redirectTo: '/'
    // });
});