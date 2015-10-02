/*
 * Este es el módulo que se encarga de controlar las subidas de archivos
 * @author Joel Márquez
 * */
'use strict';

// requires
var aws = require('aws-sdk');
var uuid = require('node-uuid');
var logger = require('../../config/logger');
var config = require('../../config');

// Obtiene una url firmada de Amazon válida para subir un archivo
module.exports.getAmazonSignedURL = function (req, res) {

  process.nextTick(function () {
    req.assert('file_type', 'Tipo de archivo válido requerido').isString();

    // Validamos errores
    if (req.validationErrors()) {
      logger.warn('Validation errors: ' + JSON.stringify(req.validationErrors()));
      return res.status(400).send({ errors: req.validationErrors() });
    }

    aws.config.update({ accessKeyId: config.AWS_ACCESS_KEY_ID, secretAccessKey: config.AWS_SECRET_ACCESS_KEY });
    aws.config.update({region: config.AWS_BUCKET, signatureVersion: 'v4' });

    var imageId = uuid.v4();
    var options = {
      Bucket: config.AWS_BUCKET,
      Key: imageId,
      Expires: 60,
      ContentType: req.query.file_type,
      ACL: 'public-read'
    };

    var s3 = new aws.S3();
    s3.getSignedUrl('putObject', options, function(err, data) {
      if (err) {
        logger.error('There was an error trying to get signed URL from Amazon: ' + err);
        return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar subir la foto' }] });
      }
      else {
        var url = 'https://' + config.AWS_BUCKET + '.s3.amazonaws.com/' + imageId;
        logger.info('Amazon Image URL: ' + url);

        return res.send({
          signed_request: data,
          url: url
        });
      }
    });
  });
};