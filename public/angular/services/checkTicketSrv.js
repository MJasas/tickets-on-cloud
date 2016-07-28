/*********************************
Check ticket Service
*********************************/
angular.module('TicketsSupportApp')
    .service('ticketSrv', function($http, $q) {
        this.getTicket = function(id) {  
                var url = "api/get/ticket/"+id;
                return $http.get(url)
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                            return response.data;
                        } else {
                            return $q.reject(response.data);
                        }  
                    }, function(response) {
                        return $q.reject(response.data);
                    });
            }
    }); // end service