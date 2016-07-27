angular.module('TicketsSupportApp')
    .factory('flickrPhotos', function ($resource) {
        return $resource('', { format: 'xml' });
});