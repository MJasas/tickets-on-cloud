
/*********************************
Main page Controller
*********************************/
angular.module('TicketsSupportApp')
    .controller('FrontPageCtrl', function($scope, $location, ticketSrv) {
        
        $scope.searchAnswer = function() {
            console.log("GO");
        };

        $scope.checkTicket = function(id) {
            // check existence
            console.log(id);
            // let's say it is OK
            $location.path('/ticket/id/'+id);
            console.log(JSON.stringify($location.path()));

        }; 
    });

