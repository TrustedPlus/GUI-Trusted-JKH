const FileKeyInfo = require('ct-xml-crypto').FileKeyInfo;
const SignedXml = require('ct-xml-crypto').SignedXml;
const fs = require('fs');
const dom = require('xmldom').DOMParser;
const select = require('xpath.js');
const signs = require("./trusted/sign");


function GetSignedXML (xml, options) {
    let sig = new SignedXml();
    let xpath = options.xpath;
    let privateKey = options.privateKey;
    let cert = options.cert;

    sig.canonicalizationAlgorithm = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
    sig.signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411";
    sig.signingKey = privateKey
    sig.xades = {
        form : 'GIS',
        id : 'abcd',
	    certificate : cert,
    };

    sig.addReference(
        xpath,
        [
            "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
            "http://www.w3.org/2001/10/xml-exc-c14n#"
        ],
        'http://www.w3.org/2001/04/xmldsig-more#gostr3411'
    );
    try {
        sig.computeSignature(xml
                , options = {
                prefix : 'ds',
                attrs: {"Id" : "xmldsig-6a05ee40-6c68-479a-b980-769a4d8b6f39"},
                location: {
                    reference : xpath,
                    action : "prepend"
                }
            }
        );
    } catch (err) {
        alert ('Can\'t sign xml documet');
    }
    let signedXml = sig.getSignedXml();
    return signedXml;
}

function GetUnsignedXML (xml) {
    let doc = new dom().parseFromString(xml);
    let x509 = doc.getElementsByTagName('ds:X509Certificate')[0].textContent;

    let x509PEM = trusted.pki.Certificate.import(new Buffer(x509, 'base64')).export(trusted.DataFormat.PEM).toString();
    fs.writeFileSync("x509.pem", x509PEM);

    let signature = select(doc, "//*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0];
    let sig = new SignedXml();
    sig.xades = {form : "GIS"}; // указываем, что формат должен соответствовать требованиям ГИС ЖКХ
    sig.keyInfoProvider = new FileKeyInfo("x509.pem");
    sig.loadSignature(signature.toString())
    let isValid = sig.checkSignature(xml)
    if (!isValid) console.log(sig.validationErrors)
    else console.log("Verify is successful");
    
    let requestNode = signature.parentNode;
    requestNode.removeChild(signature);
    return doc.toString();
}

module.exports.GetSignedXML = GetSignedXML;
module.exports.GetUnsignedXML = GetUnsignedXML;