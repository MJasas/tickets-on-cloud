/*********************************
Tickets Board Controller
*********************************/

angular.module('TicketsSupportApp')
    .controller('TicketsBoardCtrl', function($scope, $http, $location){
        //initialization
        var ticketsCount = 0;
        var last = 0;
        $scope.answState = [];

        angular.element(document).ready(function() {
            $http({
            method : "GET",
            url : "/api/fetch/tickets"
        })
            .success(function(response) {
                $scope.allTickets = response;
                ticketsCount = $scope.allTickets.length;
                    if (ticketsCount) {
                        $scope.tickets = [$scope.allTickets[0]];
                        for (var i = 0; i < ticketsCount; i++) {
                            if ($scope.allTickets[i].data.answer.text != "") {
                                $scope.answState.push(true);
                            } else {
                                $scope.answState.push(false);
                            }
                        }
                    } else {
                        console.log('There is no tickets in the db.')
                    }
            })
            .error(function(err) {
                console.log(err);
            });
        });

        //show more on scroll
        $scope.loadMore = function(){
            if (last < ticketsCount) {
                last = $scope.tickets.length;
                for(var i = 1; i<= 1; i++) {
                    $scope.tickets.push($scope.allTickets[last]);
                }
            }
        };
        $scope.showScope = function(e) {
            console.log(angular.element(e.srcElement).scope());
        };

        $scope.submitAnswer = function(index, newText){
            //copy and make modification
            var ticket = angular.copy($scope.allTickets[index]);
            ticket.data.answer.text = newText;
            ticket.data.answer.newText = '';
            //send ticket update req to server
            $http({
                method : "PUT",
                url : "api/update/ticket/",
                data : ticket
            })
                .success(function (response){
                    //show answer
                    console.log("response: ", response);
                    $scope.answState[index] = true;
                    $scope.allTickets[index].data.answer.text = newText;
                    $scope.allTickets[index].data.answer.newText = '';
                    $scope.allTickets[index]._rev = response;
                })
                .error(function(err){
                    console.log(err);
                });

        };
    });