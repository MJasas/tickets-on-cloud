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
        $scope.sortReverse  = true;  // set the default sort order
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
            // start loading icon
            $scope.isLoading = true;
            $http({
            method : "GET",
            url : "/api/fetch/tickets"
        })
            .success(function(response) {
                $scope.allTickets = response;
                $scope.isLoading = false;
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

        $scope.submitAnswer = function(ticket){
            var lastMessage = ticket.data.answer.chat.length;
            // Push new answer to chat
            ticket.data.answer.chat.push({
                name : ticket.data.resolver,
                text : ticket.data.answer.newText
            });
            ticket.data.answer.newText = ''; // clear input
            //send ticket update req to server
            $http({
                method : "POST",
                url : "api/update/ticket/",
                data : ticket
            })
                .success(function (response){ // responds doc headers only with aditional timeStamp propery
                    // update ticket with response data
                    ticket.data.answer.chat[lastMessage].timeStamp = response.timeStamp;
                    ticket.data.lastUpdate = response.timeStamp;
                    ticket._rev = response.docRev;
                })
                .error(function(err){
                    console.log(err);
                });

        };
    });