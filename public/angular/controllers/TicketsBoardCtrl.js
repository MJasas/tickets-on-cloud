/*********************************
Tickets Board Controller
*********************************/

angular.module('TicketsSupportApp')
    .controller('TicketsBoardCtrl', function($scope, $http, $location){
        // Tickets Sorting
        $scope.sortButtons = ['id', 'status', 'type', 'priority', 'severity', 'application', 'region', 'inquier', 'resolver', 'creationTime', 'resolutionTime', 'lastUpdate'];
        // Resolvers
        $scope.allResolvers = ['Resolver1', 'Resolver2', 'Resolver3'];
        // Ticket Search 
        $scope.sortType     = 'data.lastUpdate'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.searchTicket   = '';     // set the default search/filter term
        // Change sorting type
        $scope.sortBy = function(sortType) {
            $scope.sortType = 'data.'+sortType;
            $scope.sortReverse = !$scope.sortReverse;
        };

        //initialization for fetching
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
        $scope.trigerMe = function(who){
            console.log(who);
        }


        $scope.submitAnswer = function(index, newText){
            //copy and make modification
            var ticket = angular.copy($scope.allTickets[index]);
            console.log(JSON.stringify(ticket));
            var lastMessage = ticket.data.answer.chat.length;
            ticket
            // Push new answer to chat
            ticket.data.answer.chat.push({
                name : ticket.data.resolver,
                text : newText
            });
            ticket.data.answer.newText = ''; // clear input
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
                    // update the copy
                    ticket.data.answer.chat[lastMessage].timeStamp = response.timeStamp;
                    ticket.data.lastUpdate = response.timeStamp;
                    ticket._rev = response.docRev;
                    // point to copy
                    $scope.allTickets[index] = ticket;
                })
                .error(function(err){
                    console.log(err);
                });

        };
    });