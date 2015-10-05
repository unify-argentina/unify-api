/*
 * Este es el módulo que se encarga de controlar las subidas de archivos
 * @author Joel Márquez
 * */
'use strict';

// requires
var aws = require('aws-sdk');
var fs = require('fs');
var moment = require('moment');
var logger = require('../../config/logger');
var config = require('../../config');

aws.config.update({ accessKeyId: config.AWS_ACCESS_KEY_ID, secretAccessKey: config.AWS_SECRET_ACCESS_KEY });
aws.config.update({ region: config.AWS_REGION, signatureVersion: 'v4' });
var s3 = new aws.S3();

// Sube los archivos a Amazon S3 y devuelve error o la url pública del archivo
module.exports.uploadFile = function (req, res) {

  process.nextTick(function () {

    var userId = req.user_id;
    var date = moment().unix();
    var originalname = req.file.originalname;
    var fileName = userId + '_' + date + '_' + originalname;

    var options = {
      Bucket: config.AWS_BUCKET,
      Key: fileName,
      ContentType: 'application/octet-stream',
      Body: fs.createReadStream(req.file.path),
      ACL: 'public-read'
    };

    s3.upload(options).send(function (err, data) {
      if (err) {
        logger.error('There was an error trying to upload to Amazon: ' + err);
        return res.status(400).send({ errors: [{ msg: 'Hubo un error al intentar subir la foto' }] });
      }
      else {
        logger.info('Uploaded successfully an image to Amazon: ' + data.Location);

        return res.send({ url: data.Location });
      }
    });
  });
};