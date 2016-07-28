/*********************************
Custom service to manage multipart form submission
*********************************/
angular.module('TicketsSupportApp')
    .service('formMultipartUploadSrv', ['$http', function($http){
        return {
            uploadToUrl: function(formData, url){
                var fd = new FormData;
                for (var key in formData) {
                    if (formData.hasOwnProperty(key)) {
                        fd.append(key, formData[key]);
                    }
                };
                return $http({
                    method: "PUT",
                    url: url,
                    data: fd,
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(response){
                    return response.data; // returns a message from server
                })

                .error(function(err){
                    return err.data; // returns an error from server
                });
            }
        }
    }]);