/*********************************
Submit New Quastion & Answer Controller
*********************************/
angular.module('TicketsSupportApp')
    .controller('SubmitNewQnACtrl', function($scope, $routeParams, $http, $location, ticketSrv){
        // Get id from path
        var id = $routeParams.ticketID;

        console.log('ticketID', id);

        // Call ticket service
        $scope.isLoading = true;
        ticketSrv.getTicket(id)
            .then(function(response) {
                console.log('response', response);
                var data = response.data;
                $scope.ticket = data;
                var collectedAnswer = '';
                data.answer.chat.forEach(function(element) {
                    collectedAnswer += element.name + ' | ' + element.text + '\n';
                }, this);
                console.log('chat', data.answer.chat);
                if (data.answer.newText) {
                    collectedAnswer += data.answer.newText;
                }
                $scope.newQnA = {
                    question: data.question,
                    answer: collectedAnswer,
                    application: data.application
                };
                console.log('question', $scope.newQnA.question);
                console.log('answer', $scope.newQnA.answer);
                console.log('application', $scope.newQnA.application);
                $scope.isLoading = false;
            }, function(err) {
                console.log(err);
            });

         // Submit new ticket via service
        $scope.submitForm = function(){
            console.log('question', $scope.newQnA.question);
            console.log('answer', $scope.newQnA.answer);
            console.log('application', $scope.newQnA.application);
            var url = '/api/watson/add';
            var data = {
                question : $scope.newQnA.question,
                answer : $scope.newQnA.answer,
                application : $scope.newQnA.application                
            };
            $http({
                method : "POST",
                url : url,
                data : data
            }).success(function (response){
                console.log('response', response);
                $location.path('main');
            }).error(function(err){
                console.log('err', err);
            });
        };

        // Reset fields
        $scope.resetForm = function(){
            $scope.newQnA = {};
        };
     });