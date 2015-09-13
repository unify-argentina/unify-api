/*
 * Este módulo maneja todas las rutas de mails de Unify
 * @author Joel Márquez
 * */
'use strict';

// requires
var emailRoutes = require('express').Router();
var emailController = require('./email.controller');

// TODO ver si validamos o no
emailRoutes.param('email_id', function(req, res, next, emailId) {
  next();
});

/**
 * @api {get} /api/user/:user_id/email/inbox Obtener bandeja de entrada
 * @apiGroup Email
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 *
 * @apiSuccess {Object} emails Emails
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *         "emails": {
 *             "count": 1,
 *             "list": [
 *                 {
 *                     "id": "14f298e6505cbe03",
 *                     "threadId": "14f2987f9e86cee0",
 *                     "snippet": "Hola que tal, Les envío este correo con el fin de participar del Premio Jóvenes Emprendedores 2015.",
 *                     "provider": "google",
 *                     "date": 1439511241,
 *                     "from": "\"Joel Márquez\" <90joelmarquez@gmail.com>",
 *                     "to": [ 
 *                         "universidades@santanderrio.com.ar"
 *                     ],
 *                     "cc": [
 *                         "\"Alejo García\" <aleagb.rclm@gmail.com>",
 *                         "Cristian Mastronardi <cristian.1078@gmail.com>",
 *                         "Juan Cistaro <juan.cistaro@gmail.com>",
 *                         "Nicolas Brahim <nicolasbrahim@gmail.com>"
 *                     ],
 *                     "cco": [
 *                     ],
 *                     "subject": "Proyecto Universitario",
 *                     "text": "SG9sYSBxdWUgdGFsLA0KDQoNCg0KTGVzIGVudsOtbyBlc3RlIGNvcnJlbyBjb24gZWwgZmluIGRlIHBhcnRpY2lwYXIgZGVsIFByZW1pbyBKw7N2ZW5lcyAgDQpFbXByZW5kZWRvcmVzIDIwMTUuIEVzdGFtb3MgZW4gZWwgw7psdGltbyBhw7FvIGRlIGxhIGNhcnJlcmEgZGUgSW5nZW5pZXLDrWEgZW4gIA0KSW5mb3Jtw6F0aWNhIGVuIGxhIFVuaXZlcnNpZGFkIE5hY2lvbmFsIGRlIExhIE1hdGFuemEsIHkgbnVlc3RybyBwcm95ZWN0byBzZSAgDQpsbGFtYSBVbmlmeS4NCg0KDQoNCkxlcyBhZGp1bnRhbW9zIHVuIGRvY3VtZW50byBlbiBlbCBjdWFsIGVzdMOhIGJpZW4gZXhwbGljYWRvIGVuIHF1w6kgY29uc2lzdGUgIA0KZWwgcHJveWVjdG8geSBjdcOhbGVzIHNvbiBsb3Mgb2JqZXRpdm9zIGRlbCBtaXNtby4NCg0KDQoNCk11Y2hhcyBncmFjaWFzIHkgc2FsdWRvcywNCg0KDQoNCkpvZWwgTcOhcnF1ZXoNCmlPUyBEZXYNCg0KDQoNCi0tDQoNCg0KSm9lbCBNw6FycXVleg0KaU9TIERldg0K",
 *                     "html": "PGRpdiBkaXI9Imx0ciI-SG9sYSBxdWUgdGFsLDxkaXY-PGJyPjwvZGl2PjxkaXY-TGVzIGVudsOtbyBlc3RlIGNvcnJlbyBjb24gZWwgZmluIGRlIHBhcnRpY2lwYXIgZGVsIFByZW1pbyBKw7N2ZW5lcyBFbXByZW5kZWRvcmVzIDIwMTUuIEVzdGFtb3MgZW4gZWwgw7psdGltbyBhw7FvIGRlIGxhIGNhcnJlcmEgZGUgSW5nZW5pZXLDrWEgZW4gSW5mb3Jtw6F0aWNhIGVuIGxhIFVuaXZlcnNpZGFkIE5hY2lvbmFsIGRlIExhIE1hdGFuemEsIHkgbnVlc3RybyBwcm95ZWN0byBzZSBsbGFtYSBVbmlmeS7CoDwvZGl2PjxkaXY-PGJyPjwvZGl2PjxkaXY-TGVzIGFkanVudGFtb3MgdW4gZG9jdW1lbnRvIGVuIGVsIGN1YWwgZXN0w6EgYmllbiBleHBsaWNhZG8gZW4gcXXDqSBjb25zaXN0ZSBlbCBwcm95ZWN0byB5IGN1w6FsZXMgc29uIGxvcyBvYmpldGl2b3MgZGVsIG1pc21vLjwvZGl2PjxkaXY-PGJyPjwvZGl2PjxkaXY-TXVjaGFzIGdyYWNpYXMgeSBzYWx1ZG9zLDwvZGl2PjxkaXY-PGJyPjxkaXYgY2xhc3M9IkdtU2lnbiI-PGRpdiBkaXI9Imx0ciI-PGRpdj48ZGl2IGRpcj0ibHRyIj48ZGl2PjxkaXYgZGlyPSJsdHIiPjxkaXYgZGlyPSJsdHIiPjxkaXYgZGlyPSJsdHIiPjxzcGFuIHN0eWxlPSJmb250LXNpemU6MTIuODAwMDAwMTkwNzM0OXB4Ij5Kb2VsIE3DoXJxdWV6PC9zcGFuPjxkaXYgc3R5bGU9ImZvbnQtc2l6ZToxMi44MDAwMDAxOTA3MzQ5cHgiPmlPUyBEZXY8L2Rpdj48L2Rpdj48ZGl2IGRpcj0ibHRyIj48YnI-PC9kaXY-PGRpdiBkaXI9Imx0ciI-PGltZyBzcmM9Imh0dHBzOi8vY2kzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9wcm94eS9pcExVdEdLalFic1Ntbm1oQmtRb2JKSlNVN3VjNXVGVWlQR1VMTXFTbnN2YjdmaXFmc0xidXgwU3Z6Mm9zZjQzNXZzaHRxc2htS3ZEMDVpZk43VTJxX3c4bzdBM1Bib2ltTGVDcWFYbzBiQTZPa0l6NHQzMjk1Z19nOE85d1Rocj1zMC1kLWUxLWZ0I2h0dHBzOi8vZG9jcy5nb29nbGUuY29tL3VjP2lkPTBCM2pSQkUzeldqNkhNVXRwZURsUWNHTk1PVUUmYW1wO2V4cG9ydD1kb3dubG9hZCIgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2Ij48YnI-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PGRpdiBkaXI9Imx0ciI-LS0gPGJyPjwvZGl2PjxkaXYgZGlyPSJsdHIiPkpvZWwgTcOhcnF1ZXo8YnI-aU9TIERldjwvZGl2Pg=="
 *                 }
 *             ]
 *         },
 *         "errors": {
 *         }
 *     }
 */
emailRoutes.get('/inbox', emailController.listInbox);

/**
 * @api {get} /api/user/:user_id/email/sent Obtener enviados
 * @apiGroup Email
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 *
 * @apiSuccess {Object} emails Emails
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *         "emails": {
 *             "count": 1,
 *             "list": [
 *                 {
 *                     "id": "14f298e6505cbe03",
 *                     "threadId": "14f2987f9e86cee0",
 *                     "snippet": "Hola que tal, Les envío este correo con el fin de participar del Premio Jóvenes Emprendedores 2015.",
 *                     "provider": "google",
 *                     "date": 1439511241,
 *                     "from": "\"Joel Márquez\" <90joelmarquez@gmail.com>",
 *                     "to": [
 *                         "universidades@santanderrio.com.ar"
 *                     ],
 *                     "cc": [
 *                         "\"Alejo García\" <aleagb.rclm@gmail.com>",
 *                         "Cristian Mastronardi <cristian.1078@gmail.com>",
 *                         "Juan Cistaro <juan.cistaro@gmail.com>",
 *                         "Nicolas Brahim <nicolasbrahim@gmail.com>"
 *                     ],
 *                     "cco": [
 *                     ],
 *                     "subject": "Proyecto Universitario",
 *                     "text": "SG9sYSBxdWUgdGFsLA0KDQoNCg0KTGVzIGVudsOtbyBlc3RlIGNvcnJlbyBjb24gZWwgZmluIGRlIHBhcnRpY2lwYXIgZGVsIFByZW1pbyBKw7N2ZW5lcyAgDQpFbXByZW5kZWRvcmVzIDIwMTUuIEVzdGFtb3MgZW4gZWwgw7psdGltbyBhw7FvIGRlIGxhIGNhcnJlcmEgZGUgSW5nZW5pZXLDrWEgZW4gIA0KSW5mb3Jtw6F0aWNhIGVuIGxhIFVuaXZlcnNpZGFkIE5hY2lvbmFsIGRlIExhIE1hdGFuemEsIHkgbnVlc3RybyBwcm95ZWN0byBzZSAgDQpsbGFtYSBVbmlmeS4NCg0KDQoNCkxlcyBhZGp1bnRhbW9zIHVuIGRvY3VtZW50byBlbiBlbCBjdWFsIGVzdMOhIGJpZW4gZXhwbGljYWRvIGVuIHF1w6kgY29uc2lzdGUgIA0KZWwgcHJveWVjdG8geSBjdcOhbGVzIHNvbiBsb3Mgb2JqZXRpdm9zIGRlbCBtaXNtby4NCg0KDQoNCk11Y2hhcyBncmFjaWFzIHkgc2FsdWRvcywNCg0KDQoNCkpvZWwgTcOhcnF1ZXoNCmlPUyBEZXYNCg0KDQoNCi0tDQoNCg0KSm9lbCBNw6FycXVleg0KaU9TIERldg0K",
 *                     "html": "PGRpdiBkaXI9Imx0ciI-SG9sYSBxdWUgdGFsLDxkaXY-PGJyPjwvZGl2PjxkaXY-TGVzIGVudsOtbyBlc3RlIGNvcnJlbyBjb24gZWwgZmluIGRlIHBhcnRpY2lwYXIgZGVsIFByZW1pbyBKw7N2ZW5lcyBFbXByZW5kZWRvcmVzIDIwMTUuIEVzdGFtb3MgZW4gZWwgw7psdGltbyBhw7FvIGRlIGxhIGNhcnJlcmEgZGUgSW5nZW5pZXLDrWEgZW4gSW5mb3Jtw6F0aWNhIGVuIGxhIFVuaXZlcnNpZGFkIE5hY2lvbmFsIGRlIExhIE1hdGFuemEsIHkgbnVlc3RybyBwcm95ZWN0byBzZSBsbGFtYSBVbmlmeS7CoDwvZGl2PjxkaXY-PGJyPjwvZGl2PjxkaXY-TGVzIGFkanVudGFtb3MgdW4gZG9jdW1lbnRvIGVuIGVsIGN1YWwgZXN0w6EgYmllbiBleHBsaWNhZG8gZW4gcXXDqSBjb25zaXN0ZSBlbCBwcm95ZWN0byB5IGN1w6FsZXMgc29uIGxvcyBvYmpldGl2b3MgZGVsIG1pc21vLjwvZGl2PjxkaXY-PGJyPjwvZGl2PjxkaXY-TXVjaGFzIGdyYWNpYXMgeSBzYWx1ZG9zLDwvZGl2PjxkaXY-PGJyPjxkaXYgY2xhc3M9IkdtU2lnbiI-PGRpdiBkaXI9Imx0ciI-PGRpdj48ZGl2IGRpcj0ibHRyIj48ZGl2PjxkaXYgZGlyPSJsdHIiPjxkaXYgZGlyPSJsdHIiPjxkaXYgZGlyPSJsdHIiPjxzcGFuIHN0eWxlPSJmb250LXNpemU6MTIuODAwMDAwMTkwNzM0OXB4Ij5Kb2VsIE3DoXJxdWV6PC9zcGFuPjxkaXYgc3R5bGU9ImZvbnQtc2l6ZToxMi44MDAwMDAxOTA3MzQ5cHgiPmlPUyBEZXY8L2Rpdj48L2Rpdj48ZGl2IGRpcj0ibHRyIj48YnI-PC9kaXY-PGRpdiBkaXI9Imx0ciI-PGltZyBzcmM9Imh0dHBzOi8vY2kzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9wcm94eS9pcExVdEdLalFic1Ntbm1oQmtRb2JKSlNVN3VjNXVGVWlQR1VMTXFTbnN2YjdmaXFmc0xidXgwU3Z6Mm9zZjQzNXZzaHRxc2htS3ZEMDVpZk43VTJxX3c4bzdBM1Bib2ltTGVDcWFYbzBiQTZPa0l6NHQzMjk1Z19nOE85d1Rocj1zMC1kLWUxLWZ0I2h0dHBzOi8vZG9jcy5nb29nbGUuY29tL3VjP2lkPTBCM2pSQkUzeldqNkhNVXRwZURsUWNHTk1PVUUmYW1wO2V4cG9ydD1kb3dubG9hZCIgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2Ij48YnI-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PGRpdiBkaXI9Imx0ciI-LS0gPGJyPjwvZGl2PjxkaXYgZGlyPSJsdHIiPkpvZWwgTcOhcnF1ZXo8YnI-aU9TIERldjwvZGl2Pg=="
 *                 }
 *             ]
 *         },
 *         "errors": {
 *         }
 *     }
 */
emailRoutes.get('/sent', emailController.listSent);

/**
 * @api {get} /api/user/:user_id/email/draft Obtener borradores
 * @apiGroup Email
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 *
 * @apiSuccess {Object} emails Emails
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *         "emails": {
 *             "count": 1,
 *             "list": [
 *                 {
 *                     "id": "14f298e6505cbe03",
 *                     "threadId": "14f2987f9e86cee0",
 *                     "snippet": "Hola que tal, Les envío este correo con el fin de participar del Premio Jóvenes Emprendedores 2015.",
 *                     "provider": "google",
 *                     "date": 1439511241,
 *                     "from": "\"Joel Márquez\" <90joelmarquez@gmail.com>",
 *                     "to": [
 *                         "universidades@santanderrio.com.ar"
 *                     ],
 *                     "cc": [
 *                         "\"Alejo García\" <aleagb.rclm@gmail.com>",
 *                         "Cristian Mastronardi <cristian.1078@gmail.com>",
 *                         "Juan Cistaro <juan.cistaro@gmail.com>",
 *                         "Nicolas Brahim <nicolasbrahim@gmail.com>"
 *                     ],
 *                     "cco": [
 *                     ],
 *                     "subject": "Proyecto Universitario",
 *                     "text": "SG9sYSBxdWUgdGFsLA0KDQoNCg0KTGVzIGVudsOtbyBlc3RlIGNvcnJlbyBjb24gZWwgZmluIGRlIHBhcnRpY2lwYXIgZGVsIFByZW1pbyBKw7N2ZW5lcyAgDQpFbXByZW5kZWRvcmVzIDIwMTUuIEVzdGFtb3MgZW4gZWwgw7psdGltbyBhw7FvIGRlIGxhIGNhcnJlcmEgZGUgSW5nZW5pZXLDrWEgZW4gIA0KSW5mb3Jtw6F0aWNhIGVuIGxhIFVuaXZlcnNpZGFkIE5hY2lvbmFsIGRlIExhIE1hdGFuemEsIHkgbnVlc3RybyBwcm95ZWN0byBzZSAgDQpsbGFtYSBVbmlmeS4NCg0KDQoNCkxlcyBhZGp1bnRhbW9zIHVuIGRvY3VtZW50byBlbiBlbCBjdWFsIGVzdMOhIGJpZW4gZXhwbGljYWRvIGVuIHF1w6kgY29uc2lzdGUgIA0KZWwgcHJveWVjdG8geSBjdcOhbGVzIHNvbiBsb3Mgb2JqZXRpdm9zIGRlbCBtaXNtby4NCg0KDQoNCk11Y2hhcyBncmFjaWFzIHkgc2FsdWRvcywNCg0KDQoNCkpvZWwgTcOhcnF1ZXoNCmlPUyBEZXYNCg0KDQoNCi0tDQoNCg0KSm9lbCBNw6FycXVleg0KaU9TIERldg0K",
 *                     "html": "PGRpdiBkaXI9Imx0ciI-SG9sYSBxdWUgdGFsLDxkaXY-PGJyPjwvZGl2PjxkaXY-TGVzIGVudsOtbyBlc3RlIGNvcnJlbyBjb24gZWwgZmluIGRlIHBhcnRpY2lwYXIgZGVsIFByZW1pbyBKw7N2ZW5lcyBFbXByZW5kZWRvcmVzIDIwMTUuIEVzdGFtb3MgZW4gZWwgw7psdGltbyBhw7FvIGRlIGxhIGNhcnJlcmEgZGUgSW5nZW5pZXLDrWEgZW4gSW5mb3Jtw6F0aWNhIGVuIGxhIFVuaXZlcnNpZGFkIE5hY2lvbmFsIGRlIExhIE1hdGFuemEsIHkgbnVlc3RybyBwcm95ZWN0byBzZSBsbGFtYSBVbmlmeS7CoDwvZGl2PjxkaXY-PGJyPjwvZGl2PjxkaXY-TGVzIGFkanVudGFtb3MgdW4gZG9jdW1lbnRvIGVuIGVsIGN1YWwgZXN0w6EgYmllbiBleHBsaWNhZG8gZW4gcXXDqSBjb25zaXN0ZSBlbCBwcm95ZWN0byB5IGN1w6FsZXMgc29uIGxvcyBvYmpldGl2b3MgZGVsIG1pc21vLjwvZGl2PjxkaXY-PGJyPjwvZGl2PjxkaXY-TXVjaGFzIGdyYWNpYXMgeSBzYWx1ZG9zLDwvZGl2PjxkaXY-PGJyPjxkaXYgY2xhc3M9IkdtU2lnbiI-PGRpdiBkaXI9Imx0ciI-PGRpdj48ZGl2IGRpcj0ibHRyIj48ZGl2PjxkaXYgZGlyPSJsdHIiPjxkaXYgZGlyPSJsdHIiPjxkaXYgZGlyPSJsdHIiPjxzcGFuIHN0eWxlPSJmb250LXNpemU6MTIuODAwMDAwMTkwNzM0OXB4Ij5Kb2VsIE3DoXJxdWV6PC9zcGFuPjxkaXYgc3R5bGU9ImZvbnQtc2l6ZToxMi44MDAwMDAxOTA3MzQ5cHgiPmlPUyBEZXY8L2Rpdj48L2Rpdj48ZGl2IGRpcj0ibHRyIj48YnI-PC9kaXY-PGRpdiBkaXI9Imx0ciI-PGltZyBzcmM9Imh0dHBzOi8vY2kzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9wcm94eS9pcExVdEdLalFic1Ntbm1oQmtRb2JKSlNVN3VjNXVGVWlQR1VMTXFTbnN2YjdmaXFmc0xidXgwU3Z6Mm9zZjQzNXZzaHRxc2htS3ZEMDVpZk43VTJxX3c4bzdBM1Bib2ltTGVDcWFYbzBiQTZPa0l6NHQzMjk1Z19nOE85d1Rocj1zMC1kLWUxLWZ0I2h0dHBzOi8vZG9jcy5nb29nbGUuY29tL3VjP2lkPTBCM2pSQkUzeldqNkhNVXRwZURsUWNHTk1PVUUmYW1wO2V4cG9ydD1kb3dubG9hZCIgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2Ij48YnI-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PGRpdiBkaXI9Imx0ciI-LS0gPGJyPjwvZGl2PjxkaXYgZGlyPSJsdHIiPkpvZWwgTcOhcnF1ZXo8YnI-aU9TIERldjwvZGl2Pg=="
 *                 }
 *             ]
 *         },
 *         "errors": {
 *         }
 *     }
 */
emailRoutes.get('/draft', emailController.listDraft);

/**
 * @api {get} /api/user/:user_id/email/trash Obtener papelera de reciclaje
 * @apiGroup Email
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 *
 * @apiSuccess {Object} emails Emails
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 *     {
 *         "emails": {
 *             "count": 1,
 *             "list": [
 *                 {
 *                     "id": "14f298e6505cbe03",
 *                     "threadId": "14f2987f9e86cee0",
 *                     "snippet": "Hola que tal, Les envío este correo con el fin de participar del Premio Jóvenes Emprendedores 2015.",
 *                     "provider": "google",
 *                     "date": 1439511241,
 *                     "from": "\"Joel Márquez\" <90joelmarquez@gmail.com>",
 *                     "to": [
 *                         "universidades@santanderrio.com.ar"
 *                     ],
 *                     "cc": [
 *                         "\"Alejo García\" <aleagb.rclm@gmail.com>",
 *                         "Cristian Mastronardi <cristian.1078@gmail.com>",
 *                         "Juan Cistaro <juan.cistaro@gmail.com>",
 *                         "Nicolas Brahim <nicolasbrahim@gmail.com>"
 *                     ],
 *                     "cco": [
 *                     ],
 *                     "subject": "Proyecto Universitario",
 *                     "text": "SG9sYSBxdWUgdGFsLA0KDQoNCg0KTGVzIGVudsOtbyBlc3RlIGNvcnJlbyBjb24gZWwgZmluIGRlIHBhcnRpY2lwYXIgZGVsIFByZW1pbyBKw7N2ZW5lcyAgDQpFbXByZW5kZWRvcmVzIDIwMTUuIEVzdGFtb3MgZW4gZWwgw7psdGltbyBhw7FvIGRlIGxhIGNhcnJlcmEgZGUgSW5nZW5pZXLDrWEgZW4gIA0KSW5mb3Jtw6F0aWNhIGVuIGxhIFVuaXZlcnNpZGFkIE5hY2lvbmFsIGRlIExhIE1hdGFuemEsIHkgbnVlc3RybyBwcm95ZWN0byBzZSAgDQpsbGFtYSBVbmlmeS4NCg0KDQoNCkxlcyBhZGp1bnRhbW9zIHVuIGRvY3VtZW50byBlbiBlbCBjdWFsIGVzdMOhIGJpZW4gZXhwbGljYWRvIGVuIHF1w6kgY29uc2lzdGUgIA0KZWwgcHJveWVjdG8geSBjdcOhbGVzIHNvbiBsb3Mgb2JqZXRpdm9zIGRlbCBtaXNtby4NCg0KDQoNCk11Y2hhcyBncmFjaWFzIHkgc2FsdWRvcywNCg0KDQoNCkpvZWwgTcOhcnF1ZXoNCmlPUyBEZXYNCg0KDQoNCi0tDQoNCg0KSm9lbCBNw6FycXVleg0KaU9TIERldg0K",
 *                     "html": "PGRpdiBkaXI9Imx0ciI-SG9sYSBxdWUgdGFsLDxkaXY-PGJyPjwvZGl2PjxkaXY-TGVzIGVudsOtbyBlc3RlIGNvcnJlbyBjb24gZWwgZmluIGRlIHBhcnRpY2lwYXIgZGVsIFByZW1pbyBKw7N2ZW5lcyBFbXByZW5kZWRvcmVzIDIwMTUuIEVzdGFtb3MgZW4gZWwgw7psdGltbyBhw7FvIGRlIGxhIGNhcnJlcmEgZGUgSW5nZW5pZXLDrWEgZW4gSW5mb3Jtw6F0aWNhIGVuIGxhIFVuaXZlcnNpZGFkIE5hY2lvbmFsIGRlIExhIE1hdGFuemEsIHkgbnVlc3RybyBwcm95ZWN0byBzZSBsbGFtYSBVbmlmeS7CoDwvZGl2PjxkaXY-PGJyPjwvZGl2PjxkaXY-TGVzIGFkanVudGFtb3MgdW4gZG9jdW1lbnRvIGVuIGVsIGN1YWwgZXN0w6EgYmllbiBleHBsaWNhZG8gZW4gcXXDqSBjb25zaXN0ZSBlbCBwcm95ZWN0byB5IGN1w6FsZXMgc29uIGxvcyBvYmpldGl2b3MgZGVsIG1pc21vLjwvZGl2PjxkaXY-PGJyPjwvZGl2PjxkaXY-TXVjaGFzIGdyYWNpYXMgeSBzYWx1ZG9zLDwvZGl2PjxkaXY-PGJyPjxkaXYgY2xhc3M9IkdtU2lnbiI-PGRpdiBkaXI9Imx0ciI-PGRpdj48ZGl2IGRpcj0ibHRyIj48ZGl2PjxkaXYgZGlyPSJsdHIiPjxkaXYgZGlyPSJsdHIiPjxkaXYgZGlyPSJsdHIiPjxzcGFuIHN0eWxlPSJmb250LXNpemU6MTIuODAwMDAwMTkwNzM0OXB4Ij5Kb2VsIE3DoXJxdWV6PC9zcGFuPjxkaXYgc3R5bGU9ImZvbnQtc2l6ZToxMi44MDAwMDAxOTA3MzQ5cHgiPmlPUyBEZXY8L2Rpdj48L2Rpdj48ZGl2IGRpcj0ibHRyIj48YnI-PC9kaXY-PGRpdiBkaXI9Imx0ciI-PGltZyBzcmM9Imh0dHBzOi8vY2kzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9wcm94eS9pcExVdEdLalFic1Ntbm1oQmtRb2JKSlNVN3VjNXVGVWlQR1VMTXFTbnN2YjdmaXFmc0xidXgwU3Z6Mm9zZjQzNXZzaHRxc2htS3ZEMDVpZk43VTJxX3c4bzdBM1Bib2ltTGVDcWFYbzBiQTZPa0l6NHQzMjk1Z19nOE85d1Rocj1zMC1kLWUxLWZ0I2h0dHBzOi8vZG9jcy5nb29nbGUuY29tL3VjP2lkPTBCM2pSQkUzeldqNkhNVXRwZURsUWNHTk1PVUUmYW1wO2V4cG9ydD1kb3dubG9hZCIgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2Ij48YnI-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PC9kaXY-PGRpdiBkaXI9Imx0ciI-LS0gPGJyPjwvZGl2PjxkaXYgZGlyPSJsdHIiPkpvZWwgTcOhcnF1ZXo8YnI-aU9TIERldjwvZGl2Pg=="
 *                 }
 *             ]
 *         },
 *         "errors": {
 *         }
 *     }
 */
emailRoutes.get('/trash', emailController.listTrash);

/**
 * @api {post} /api/user/:user_id/email Enviar un email
 * @apiGroup Email
 *
 * @apiHeader {String} Authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0"
 *     }
 *
 * @apiParam {String} user_id Id del usuario
 * @apiParam {Array} to Lista de emails válidos a enviar el email
 * @apiParam [{Array}] cc Lista de emails válidos a enviar como cc el email
 * @apiParam [{Array}] cco Lista de emails válidos a enviar como cco el email
 * @apiParam {String} subject Asunto del email
 * @apiParam {String} text Cuerpo del email
 *
 * @apiParamExample {json} Ejemplo de request
 *     {
 *       "to":["unify.argentina@gmail.com"],
 *       "cc":["aleagb.rclm@gmail.com"],
 *       "cco":["juan.cistaro@gmail.com"],
 *       "subject":"Hola querido",
 *       "text":"Todo bien?"
 *     }
 *
 * @apiSuccessExample Respuesta valida
 *     HTTP/1.1 200 OK
 */
emailRoutes.post('/', emailController.create);

emailRoutes.delete('/:email_id', emailController.delete);

module.exports = emailRoutes;