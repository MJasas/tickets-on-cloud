/*********************************
Custom service to manage multipart form submission
*********************************/
angular.module('TicketsSupportApp')
    .service('formMultipartUploadSrv', ['$http', function($http){
        this.uploadToUrl = function(file, url){
            var fd = new FormData();
            fd.append('file', file);
            $http({
                method: "PUT",
                url: url,
                data: fd,
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
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