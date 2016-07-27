/*********************************
Custom service to manage multipart form submission
*********************************/
angular.module('TicketsSupportApp')
    .service('formMultipartUploadSrv', ['$http', function($http){
        this.uploadToUrl = function(formData, url){
            var fd = new FormData;
            for (var key in formData) {
                if (formData.hasOwnProperty(key)) {
                    console.log(key + " -> " + formData[key]);
                    fd.append(key, formData[key]);
                }
            }
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