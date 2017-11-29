const http = require('http');
const https = require('https');
const fs = require('fs');
const native = require("./native");
const GetSignedXML = require('./sign-xml.js').GetSignedXML;
const GetUnsignedXML = require('./sign-xml.js').GetUnsignedXML;
const dom = require('xmldom').DOMParser;
const work_with_settings = require('./module/global_app').work_with_settings;

log4js.configure({
  appenders : {
    file : {
      type : 'file',
      filename : native.path.join(native.DEFAULT_PATH, "log", "gis-proxy.log"),
      //filename: 'gis-proxy',
      maxLogSize : 1024 * 1024, // = 1 MB
      numBackups : 3,
      compress : true,
      encoding : 'utf-8',
    }
  },
  categories : {
    default : {
      appenders : ['file'],
      level : 'all'
    }
  }
});
const logger = log4js.getLogger('gis-proxy');

/**
 * Load certificate from Buffer either DER or PEM format
 * @param {Buffer} certBuffer 
 * @return {Certificate} trusted.pki.Certificate
 */
function LoadCert(certBuffer) {
  let cert;
  try {
    cert = trusted.pki.Certificate.import(certBuffer);
  } catch (err) {
    try {
      cert = trusted.pki.Certificate.import(certBuffer, trusted.DataFormat.PEM);
    } catch (err) {
      cert = null;
    }
  }
  return cert;
}

/**
 * Get private key by the certificate
 * @param {Certificate} cert trusetd.pki.Certificate
 * @return {Buffer} 
 */
function GetPrivateKey(cert) {
  // let providerMicrosoft = new trusted.pkistore.ProviderMicrosoft();
  // let key;
  // try {
  //   key = providerMicrosoft.getKey(cert);
  //   //console.log(key.write);
  // } catch (err) {
  //   alert('Ошибка ' + err.name + ":" + err.message + "\n" + err.stack); 
  //   logger.error('Error get access to private key', err);
  //   alert ('Can\'t get access to private key');
  // }
  
  // key.writePublicKey('./app/publicKey.pem', trusted.DataFormat.PEM);
  // TODO nofile
  //key.writePrivateKey('./tmp.pem', trusted.DataFormat.PEM, '');
  return fs.readFileSync('./config/tmp.pem');
}

/**
 * Create object with all options for inner proxy operations
 * @param {String} certFile Name of file with certificate
 * @return {Object}
 */
//const ConfigureServer = (certFile) => {
function ConfigureServer(certFile) {

  let certBuffer = '';
  try {
    certBuffer = fs.readFileSync(certFile);
  } catch (err) {
    logger.error('Error while open cert file', err);
    alert('Can\'t open file with certificate');
  }

  let cert = LoadCert(certBuffer);
  let certDER = cert.export();
  let certPEM = cert.export(trusted.DataFormat.PEM);
  let privateKey = GetPrivateKey(cert);
  let client_port = Number(work_with_settings.get_setting("port")) || 8080;
  let server_ip = work_with_settings.get_setting("ip_server") || "217.107.108.147";
  let server_port = Number(work_with_settings.get_setting("port_server")) || 10081;
  //console.log(client_port + " " + server_ip + " " + server_port);
  //fs.writeFileSync('certder.cer', certPEM);

  let options = {
    https : {
      //hostname: "217.107.108.147", // ip address of GIS ZHKH server
      hostname: server_ip, // ip address of GIS ZHKH server
      //port: 10081,
      port: server_port,
      auth :'sit:xw{p&&Ee3b9r8?amJv*]',
      key : privateKey,
      cert: certPEM,
      ciphers: 'aGOST01',
      rejectUnauthorized: true,
      ca: [fs.readFileSync('./config/CA-SIT.pem')],
      checkServerIdentity: function (host, cert) { // костыль для модуля "https" нужен при авторизации
        return undefined;
      }
    },
    proxy : {
      //port: 8080,
      port: client_port,
    },
    sign : {
      xpath : '//*[@Id="toSigning"]',
      cert : certDER,
      privateKey : privateKey,
    },
    cert : cert,
  }
  //alert(server_ip);
  return options;
}

/**
 * Get current time in RFC3339 format
 * example
 * 2000-00-00T10:20:30.40+03:00
 */
function getTimeRFC3339() {
  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }
  let currentDate = new Date();
  let offsetInMinutes = - currentDate.getTimezoneOffset();
  return currentDate.getFullYear() +
    '-' + pad(currentDate.getMonth() + 1) +
    '-' + pad(currentDate.getDate()) +
    'T' + pad(currentDate.getHours()) +
    ':' + pad(currentDate.getMinutes()) +
    ':' + pad(currentDate.getSeconds()) +
    '.' + pad(Math.floor(currentDate.getMilliseconds() / 10)) +
    (offsetInMinutes < 0 ? '-' : '+') + pad(Math.abs(offsetInMinutes) / 60) +
    ':' + pad(Math.abs(offsetInMinutes) % 60);
}

/**
 * Get GUID
 */
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

/**
 * Get OGRN from qualified certificate
 * @param {Certificate} cert trusted.pki.Certificate
 * @return {String} OGRN from certificate
 */
function getOGRN (cert) {
  let subject = cert.subjectName;
  let position = subject.search(/\/1\.2\.643\.100\.1=[0-9]{13}/);
  if (position == -1) {
    return null;
  }
  let startOGRN = position + 15;
  let endOGRN = startOGRN + 13;
  return subject.slice(startOGRN, endOGRN);
}

/**
 * Form test SOAP-request about the organization specified in the certificate
 * @param {Certificate} cert trusted.pki.Certificate
 * @return {String} SOAP-request
 */
// TODO У физических лиц в квалифицированном сертификате для ГИС ЖКХ нет ОГРН
// небходимо делать запрос по СНИЛС
function getTestXml (cert) {
  let dateOfSend = getTimeRFC3339();
  let MessageGUID = guid();
  const OGRN = getOGRN(cert);

  let testXml = 
  '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:base="http://dom.gosuslugi.ru/schema/integration/base/" xmlns:org="http://dom.gosuslugi.ru/schema/integration/organizations-registry-common/" xmlns:xd="http://www.w3.org/2000/09/xmldsig#" xmlns:org1="http://dom.gosuslugi.ru/schema/integration/organizations-base/" xmlns:org2="http://dom.gosuslugi.ru/schema/integration/organizations-registry-base/">' +
  '<soapenv:Header>' +
    '<base:ISRequestHeader>' +
        '<base:Date>' + dateOfSend + '</base:Date>' +
        '<base:MessageGUID>' + MessageGUID + '</base:MessageGUID>' +
    '</base:ISRequestHeader>' +
  '</soapenv:Header>' +
  '<soapenv:Body>' +
    '<org:exportOrgRegistryRequest Id="toSigning" base:version="10.0.2.1">' +
    '<org:SearchCriteria>' +
      '<org1:OGRN>'+ OGRN +'</org1:OGRN>' +
    '</org:SearchCriteria>' +
    '</org:exportOrgRegistryRequest>' +
  '</soapenv:Body>' +
  '</soapenv:Envelope>';
  return testXml;
}

/**
 * Get information from test response and show it electron app
 * @param {string} resultXml Xml with response from GIS ZHKH
 */
function CheckTestResponse(resultXml) {
  logger.trace("check test responce");
  let doc = new dom().parseFromString(resultXml.toString());
  let resultNode = doc.getElementsByTagName("ns13:exportOrgRegistryResult");
  if (resultNode.length != 1) {
    alert("Can't get information about organisation from xml");
    return false;
  } else {
    // let organizationName = doc.getElementsByTagName("ns9:FullName")[0].textContent;
    // let ogrn = doc.getElementsByTagName("ns10:OGRN")[0].textContent;
    // let inn = doc.getElementsByTagName("ns10:INN")[0].textContent;
    // let registrationDate = doc.getElementsByTagName("ns9:StateRegistrationDate")[0].textContent;
    // let roleName = doc.getElementsByTagName("ns7:Name")[0].textContent;
    // let timeOfReceive = doc.getElementsByTagName("ns4:Date")[0].textContent;
    // timeOfReceive = timeOfReceive.replace("T", " в ");
    // let infoNode = document.getElementById('test-info');
    // infoNode.innerHTML = "От ГИС ЖКХ получена информация о зарегистрированной организации <br>" + 
    //     "<table>" +
    //       "<tr><td>Полное название</td><td>" + organizationName + "</td></tr>" +
    //       "<tr><td>ОГРН</td><td>" + ogrn + "</td></tr>" +
    //       "<tr><td>ИНН</td><td>" + inn + "</td></tr>" +
    //       "<tr><td>Дата регистрации</td><td>" + registrationDate + "</td></tr>" +
    //       "<tr><td>Роль на ГИС ЖКХ</td><td>" + roleName + "</td></tr>" +
    //       "<tr><td>Время получения отвера</td><td>" + timeOfReceive + "</td></tr>" +
    //     "</table>";
    // infoNode.style.backgroundColor = "lightgreen";
    return true;
  }
}

/**
 * Send test request to GIS. Request ask information about the organization 
 * specified in the certificate
 * @param {Certificate} cert trusted.pki.Certificate
 */
function SendTestRequest (cert) {
  logger.trace('form test request');
  let testXml = getTestXml(cert);
  let client_port = work_with_settings.get_setting("port") || "8080";
  const clientOptions = {
      hostname: '127.0.0.1',
      port: client_port,
      path: '/ext-bus-org-registry-common-service/services/OrgRegistryCommon',
      method: 'POST',
      headers: {
        'SOAPAction':'urn:exportOrgRegistry'
      }
  };

  var req = http.request(clientOptions, (res) => {
      let result = "";
      res.on('data', function (chunk) {
        result += chunk;
      });
      res.on('end', () => {
        logger.trace('receive test response');
        CheckTestResponse(result);
      })
  });
  logger.trace('send tes request');
  req.write(testXml);
  req.end();
}

function createServer(certFile){
  logger.trace('Create server');
  // setting up proxy server options
  this.options = ConfigureServer(certFile);
  let httpsOptions = this.options.https;
  let signOptions = this.options.sign;
  logger.trace('server was configured with options:\n', this.options);
  // create server
  this.server = http.createServer(function (request, response) {
    logger.trace('get request to URL:', request.url);
    httpsOptions.headers = request.headers;
    httpsOptions.method = request.method;
    httpsOptions.path = request.url;
    {
      logger.trace('try connect to server :', httpsOptions.hostname);
      let proxy_request = https.request(httpsOptions, (proxy_response) => {
        logger.trace('use protocol:', proxy_request.connection.getProtocol());
        // logger.trace('Proxy connections to Server is', proxy_request.connection.authorized ? 'authorized' : 'unauthorized');
        let responseXml = '';
        
        proxy_response.on('data', chunk => {
          logger.trace('get Server response chunk with size =', chunk.length);
          responseXml += chunk; // accumulate whole xml from server
        });
        proxy_response.on('end', () => {
          logger.trace('get Server response end');
          logger.trace(responseXml);
          let unsignedXml = GetUnsignedXML(responseXml);
          response.write(unsignedXml);
          response.end();
        });
        
        response.writeHead(proxy_response.statusCode, proxy_response.headers);
      });

      let requestXml= "";
      request.on('data', chunk => {
        logger.trace('get Client request chunk with size =', chunk.length);
        requestXml = requestXml + chunk; // accumulate whole xml from client
      });
      request.on('end', () => {
        logger.trace("get Client request end.");
        logger.trace('try sign request xml');
        let signedXml = GetSignedXML(requestXml, signOptions);
        logger.trace('send signed xml to server');
        logger.trace(signedXml);
        proxy_request.write(signedXml);
        proxy_request.end();
      });
    }
  })

  return this.server;
}

/**
 * Class with proxy server to GIS 
 */
class Proxy {
  /**
   * Create and configured Proxy-server
   * @param {String} certFile Name of file with certificate
   */
  constructor(certFile) {
    this.options;
    this.server;
    this.certFile = certFile;
  }

  start() {
    try {
      this.options = ConfigureServer(this.certFile);
      this.server = createServer(this.certFile);
      this.server.listen(this.options.proxy.port);
      work_with_settings.set_setting('server_status', "onstart");
      logger.trace('Start server');
    } catch (err) { 
      alert('Ошибка ' + err.name + ":" + err.message + "\n" + err.stack); 
      logger.error('Error while start server:\n', err);
      alert('Error while start server');
    }
  }

  stop(){
    work_with_settings.set_setting('server_status', "onstop");
    this.server.close();
    logger.trace('Stop server');
  }

  restart(){
    work_with_settings.set_setting('server_status', "onrestart");
    logger.trace('Restart server');
    this.stop();
    this.start();
  }

  test() {
    logger.trace('Test server');
    SendTestRequest(this.options.cert);
  }
}

module.exports.proxy = new Proxy("./config/certificate.cer");