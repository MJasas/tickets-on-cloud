/*********************************
TicketSupportApp
*********************************/

angular.module('TicketsSupportApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

/*********************************
Custom directive for inputs
*********************************/
angular.module('TicketsSupportApp').directive('myDirective', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, SubmitNewTicketController) {
            function myLetterCase(value) {
                firstLetter = value.slice(0, 1);
                if (firstLetter == firstLetter.toUpperCase()){
                    SubmitNewTicketController.$setValidity('firstCapital', true);
                } else {
                    SubmitNewTicketController.$setValidity('firstCapital', false);
                }
                return value;
            }
            SubmitNewTicketController.$parsers.push(myLetterCase);
        }
    };
});

/*********************************
Custom directive for file handling
*********************************/
angular.module('TicketsSupportApp').directive('fileModel', ['$parse', function ($parse) {
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
angular.module('TicketsSupportApp').service('formSubmitService', ['$http', function($http){

        this.uploadToUrl = function(fd, url){

            $http({
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


var changeLocation = function(url, forceReload) {
  $scope = $scope || angular.element(document).scope();
  if(forceReload || $scope.$$phase) {
    $window.location = url;
  }
  else {
    //only use this if you want to replace the history stack
    //$location.path(url).replace();

    //this this if you want to change the URL and add it to the history stack
    $location.path(url);
    $scope.$apply();
  }
};

var redirectLocation = function(url, forceReload) {
  $scope = $scope || angular.element(document).scope();
  if(forceReload || $scope.$$phase) {
    $window.location = url;
  }
  else {
    //only use this if you want to replace the history stack
    //$location.path(url).replace();

    //this this if you want to change the URL and add it to the history stack
    $location.path(url);
    $location.replace();
  }
};



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
