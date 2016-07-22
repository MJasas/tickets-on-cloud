/*********************************
New Ticket Submit Controller
*********************************/
angular.module('TicketsSupportApp')
    .controller('SubmitNewTicketCtrl', function($scope, $http, $location){
        // Reset fields
        $scope.resetForm = function(){
            $scope.newTicket = {};
        }

        // Submit new ticket
        $scope.submitForm = function(){
            var form = document.getElementsByName('newTicketForm').item(0); 
            // submit form via Angular custom service
            var fd = new FormData(form);
            // formSubmitService.uploadToUrl(fd, 'api/new-ticket/submit');

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

        function redirect(){
            console.log(JSON.stringify($location.path()));
            $location.path('#/main').replace();
        };

    });