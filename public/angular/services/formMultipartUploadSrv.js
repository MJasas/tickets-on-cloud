/*********************************
Custom service to manage multipart form submission
*********************************/
angular.module('TicketsSupportApp')
    .service('formMultipartUploadSrv', ['$http', function($http){
        this.uploadToUrl = function(fd, url){

            $http({
                method : "PUT",
                url : url,
                withCredentials: false,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                params: { fd }
            })
            .success(function(response){
                alert(response);
                console.log(response);
            })

            .error(function(err){
                alert(err);
            });
        }
}]);