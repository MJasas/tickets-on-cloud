/*********************************
Check ticket Service
*********************************/
angular.module('TicketsSupportApp')
    .service('ticketSrv', function() {
        
        var getTicket = function(id) {
            return "BAM! this is your ticket";
        }
        return {
            getTicket: getTicket
        };
    });