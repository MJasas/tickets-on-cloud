/*********************************
Custom directive for inputs
*********************************/
angular.module('TicketsSupportApp')
    .directive('myDirective', function() {
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
angular.module('TicketsSupportApp')
    .directive('fileModel', ['$parse', function ($parse) {
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

            $scope.testSubmit = function(){
                
            }
        };
    });