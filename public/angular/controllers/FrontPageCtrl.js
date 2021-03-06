
/*********************************
Main page Controller
*********************************/
angular.module('TicketsSupportApp')
    .controller('FrontPageCtrl', function($scope, $http, $location, ticketSrv) {
       /* $scope.searchAnswer = function(text) {
            $http.get('/api/watson/answers/'+text)
                .success(function (response){
                    $scope.allAnswers = response;
                })
                .error(function(err){
                    console.log(err);
                });
        };

        $scope.checkTicket = function(id) {
            // check existence
            var intId = parseInt(id);
            console.log(id);
            // let's say it is OK
            $location.path('/ticket/id/'+id);
            console.log(JSON.stringify($location.path()));
        };

        */


            $scope.search = function(text){
                if(isNaN(text)){
                        $http.get('/api/watson/answers/'+text)
                            .success(function (response){
                                $scope.allAnswers = response;
                                $scope.allQuestions = response;

                            })
                            .error(function(err){
                                console.log(err);
                         });
                } else {
                     // check existence
                    console.log(id);
                    // let's say it is OK
                    $location.path('/ticket/id/'+id);
                    console.log(JSON.stringify($location.path()));
                }
            };
           
    })
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                        scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                        });
                        
                        event.preventDefault();
                }
            });
        };
});

