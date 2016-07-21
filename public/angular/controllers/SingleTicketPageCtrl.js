/*********************************
Single Ticket Page Controller
*********************************/
angular.module('TicketsSupportApp')
    .controller('SingleTicketPageCtrl', function($scope, $routeParams, $http, $location, ticketSrv){
        // Get id from path
        var id = $routeParams.ticketID;
        // Get ticket via service
        $scope.activeTicket = ticketSrv.getTicket(id);
        // Make an original copy of ticket details
        // var originalTicket = angular.copy();
        // Reset changes
        // $scope.resetchanges = function(){
        //     $scope.activeTicket = originalTicket;
        // }


        // Submit new ticket
        $scope.submitForm = function(){
            // Submit form data
            var formData = {
                type : $scope.newTicket.ticketType,
                priority : $scope.newTicket.ticketPriority,
                application : $scope.newTicket.application,
                region : $scope.newTicket.region,
                firstName : $scope.newTicket.firstName,
                lastName : $scope.newTicket.lastName,
                email : $scope.newTicket.email,
                question : $scope.newTicket.question,
                fileAttachment : []
            };
            // Send 
            $http({
                method : "POST",
                url : "api/new-ticket/submit",
                data : formData
            })
                .success(function (response){
                    $location.path('#/main').replace();
                })
                .error(function(err){
                    console.log(err);
                });
        };

        // test
        $scope.redirect = function(){
            console.log(JSON.stringify($location.path()));
            $location.path('#/main').replace();
        };

    });