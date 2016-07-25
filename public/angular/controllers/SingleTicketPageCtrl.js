/*********************************
Single Ticket Page Controller
*********************************/
angular.module('TicketsSupportApp')
    .controller('SingleTicketPageCtrl', function($scope, $routeParams, $http, $location, ticketSrv){
        // Get id from path
        var id = $routeParams.ticketID;
        // start loading icon
        $scope.isLoading = true;
        // Call ticket service
        ticketSrv.getTicket(id)
            .then(function(data) {
                manageActiveTicket(data);
                $scope.isLoading = false;
            }, function (err) {
                console.log(err);
            });
        
        function manageActiveTicket(ticket) {
            $scope.activeTicket = ticket;
            var originalTicket = angular.copy($scope.activeTicket);
        }
        
        // Make an original copy of ticket details
        // var originalTicket = angular.copy();
        // Reset changes
        // $scope.resetchanges = function(){
        //     $scope.activeTicket = originalTicket;
        // }


        $scope.submitPost = function(ticket){
            var lastMessage = ticket.data.answer.chat.length;
            // Push new post to chat
            firstLastName = ticket.data.firstName + ' ' + ticket.data.lastName;
            ticket.data.answer.chat.push({ 
                name : firstLastName,
                text : ticket.data.answer.newText
            });
            ticket.data.answer.newText = ''; // clear input
            //send ticket update req to server
            $http({
                method : "PUT",
                url : "api/update/ticket/",
                data : ticket
            })
                .success(function (response){
                    // add response data
                    ticket.data.answer.chat[lastMessage].timeStamp = response.timeStamp;
                    ticket.data.lastUpdate = response.timeStamp;
                    ticket._rev = response.docRev;
                })
                .error(function(err){
                    console.log(err);
                });

        };

    });