
/*********************************
Main page Controller
*********************************/
angular.module('TicketsSupportApp')
    .controller('FrontPageCtrl', function($scope, $http, $location, ticketSrv) {
        $scope.searchAnswer = function(text) {
            $http.get('/api/watson/answers/'+text)
                .success(function (response){
                    $scope.allAnswers = response;
                })
                .error(function(err){
                    console.log(err);
                });
        };

        $scope.checkTicket = function(id) {
            // check existence
            console.log(id);
            // let's say it is OK
            $location.path('/ticket/id/'+id);
            console.log(JSON.stringify($location.path()));

        }; 
    });

