/*********************************
Custom directive for input validation
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
    .controller('SubmitNewTicketCtrl', ['$scope', '$http', '$location', '$route', '$uibModal', 'formMultipartUploadSrv', function($scope, $http, $location, $route, $uibModal, formMultipartUploadSrv){
        // Reset fields
        $scope.resetForm = function(){
            $scope.newTicket = {};
        };
        // Submit new ticket via service
        $scope.submitForm = function(){
            var formData = {
                type : $scope.newTicket.ticketType,
                priority : $scope.newTicket.ticketPriority,
                application : $scope.newTicket.application,
                region : $scope.newTicket.region,
                firstName : $scope.newTicket.firstName,
                lastName : $scope.newTicket.lastName,
                email : $scope.newTicket.email,
                question : $scope.newTicket.question,
                file : $scope.newTicketFile
            };
  
            var uploadUrl = "/api/new-ticket/submit";
            formMultipartUploadSrv.uploadToUrl(formData, uploadUrl)
                .then(function(msg) {
                    $scope.showMessage(msg);
                }, function(err) {
                    $scope.showMessage(err)
                });
        };

        $scope.test = function(msg) {
            $scope.showMessage(msg);
        }

        $scope.showMessage = function(msg) {
            var popUp = $uibModal.open({
                animation: true,
                templateUrl: 'angular/templates/infoTmpl.html',
                controller: 'ModalInstanceCtrl0',
                resolve: {
                    message: function() {
                        return msg;
                    }
                }
                });
        
            popUp.result.then(function(){
                // redirect to main
                $location.path('/main');
            }, function() {
                // refresh page
                $route.reload();
            });
        };
}]);

/*********************************
Dedicated popUp Controller
*********************************/
angular.module('TicketsSupportApp')
    .controller('ModalInstanceCtrl0', function($scope, $uibModalInstance, message) {
        $scope.message = message;

        $scope.ok = function() {
            $uibModalInstance.close();
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };
});