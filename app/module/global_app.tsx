import { EventEmitter } from "events";
import * as native from "../native";
import { HOME_DIR, RESOURCES_PATH } from "../constants";

export let SETTINGS_JSON = native.path.join(HOME_DIR, ".Trusted", "Trusted JKH", "settings.json");

export let get_Certificates = function (operation: string) {
    let certCollection: trusted.pki.CertificateCollection = window.TRUSTEDCERTIFICATECOLLECTION;
    let certs: any = [];
    let certList: any = [];
    if (operation === "sign") {
        certList = window.PKIITEMS.filter(function (item: trusted.pkistore.PkiItem) {
            return item.type === "CERTIFICATE" && item.category === "MY";
        });
    } else if (operation === "encrypt") {
        certList = window.PKIITEMS.filter(function (item: trusted.pkistore.PkiItem) {
            return item.type === "CERTIFICATE" && (item.category === "MY" || item.category === "AddressBook");
        });
    } else {
        certList = window.PKIITEMS.filter(function (item: trusted.pkistore.PkiItem) {
            return item.type === "CERTIFICATE";
        });
    }
    for (let i = 0; i < 4; i++) {
        certs.push({
            format: certList[i].format,
            type: certList[i].type,
            category: certList[i].category,
            provider: certList[i].provider,
            uri: certList[i].uri,
            hash: certList[i].hash,
            serial: certList[i].serial,
            notAfter: certList[i].notAfter,
            notBefore: certList[i].notBefore,
            fullSubjectName: certList[i].subjectName,
            fullIssuerName: certList[i].issuerName,
            name: certList[i].subjectFriendlyName,
            issuerName: certList[i].issuerFriendlyName,
            organization: certList[i].organizationName,
            status: certVerify(certList[i], certCollection),
            algSign: certList[i].signatureAlgorithm,
            privateKey: certList[i].key.length > 0,
            active: false,
            key: i,
        });
    }
    if (operation === "sign") {
        let cert = sign.get_sign_certificate;
        if (cert) {
            certs[cert.key].active = true;
        }
    }
    if (operation === "encrypt") {
        let cert = encrypt.get_certificates_for_encrypt;
        if (cert) {
            if (cert.length > 0) {
                for (let i = 0; i < cert.length; i++) {
                    certs[cert[i].key].active = true;
                }
            }
        }
    }
    return certs;
};

export let certVerify = function (certItem: IX509Certificate, certCollection: trusted.pki.CertificateCollection): boolean {
    let chain: trusted.pki.Chain;
    let chainForVerify: trusted.pki.CertificateCollection;

    // if (certItem.status !== undefined) {
    //      return certItem.status;
    // }

    let cert = window.PKISTORE.getPkiObject(certItem);

    try {
        chain = new trusted.pki.Chain();
        chainForVerify = chain.buildChain(cert, certCollection);
       // certItem.status = chain.verifyChain(chainForVerify, null);
        return  chain.verifyChain(chainForVerify, null);
    } catch (e) {
        return false;
    }

    // let crl = STORE.getCrlLocal(cert);
    // if (crl && CRLS.checkCrlTime(crl)) {
    //     crls.push(crl);
    //     return CHAIN.verifyChain(chainForVerify, crls);
    // } else {
    //     STORE.downloadCRL(cert, function cb(err: any, res: any) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             crl = res;
    //             if (crl && CRLS.checkCrlTime(crl)) {
    //                 crls.push(crl);
    //                 return CHAIN.verifyChain(chainForVerify, crls);
    //             } else {
    //                 return 0;
    //             }
    //         }
    //     });
    // }

    //return certItem.status;
};
export function get_settings_from_json(operation: string, settings_name: string) {
    try {
        let data = native.fs.readFileSync(SETTINGS_JSON, "utf8");
        data = JSON.parse(data);
        return data[operation][settings_name];
    } catch (e) {
        if (operation === "settings") {
            if (settings_name === "locale") {
                return "RU";
            } else if (settings_name === "proxy") {
                return {
                    port: 8080,
                    server_status: "onstop",
                    ip_server: "217.107.108.147",
                    port_server: 10081
                }
            } else if (settings_name === "sign") {
                return {
                    directory: "",
                    add_time: false,
                    encoding: "BASE-64",
                    detached: false,
                }
            } else if (settings_name === "encrypt") {
                return {
                    directory: "",
                    archive_files: false,
                    encoding: "BASE-64",
                    delete_files: false,
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
};

class WorkWithSettings{
    get_setting(setting_name: string){
        return get_settings_from_json("settings", "proxy")[setting_name];
    }

    set_setting(setting_name: string, param: string|number){
        let data;
        try{
            data = native.fs.readFileSync(SETTINGS_JSON, "utf8");
            data = JSON.parse(data);
            data.settings["proxy"][setting_name] = param;
        }catch(err){
            if(!native.fs.existsSync(native.path.join(HOME_DIR, ".Trusted", "Trusted JKH")))
                native.fs.mkdirSync(native.path.join(HOME_DIR, ".Trusted", "Trusted JKH"));
            data = {"settings":
                {
                    "encrypt":{"archive":false,"delete":false,"encoding":"BASE-64","outfolder":""},
                    "locale":"RU",
                    "sign":{"detached":false,"encoding":"BASE-64","outfolder":"","timestamp":false},
                    "proxy":{"port":8080,"server_status":"onstop","ip_server":"217.107.108.147","port_server":10081}
                }
            };
        }
        data = JSON.stringify(data);
        native.fs.writeFileSync(SETTINGS_JSON, data, "utf8");
    }
}
export var work_with_settings = new WorkWithSettings();

export interface IX509Certificate {
    format: string;
    type: string;
    category: string;
    provider: string;
    uri: string;
    version: string;
    hash: string;
    serial: string;
    serialNumber: string;
    notAfter: Date;
    notBefore: string;
    subjectName: string;
    issuerName: string;
    subjectFriendlyName: string;
    issuerFriendlyName: string;
    organizationName: string;
    status: boolean;
    signatureAlgorithm: string;
    privateKey: boolean;
    active: boolean;
    key: string;
}
/**функция чтения строковых ресурсов */
let get_string_resources = function (lang: string) {
    try {
        let RESOURCES_JSON: string;
        if (window.framework_NW) {
            RESOURCES_JSON = RESOURCES_PATH + "/Trusted_JKH/language/" + lang + ".json";
        } else {
            RESOURCES_JSON = RESOURCES_PATH + "/language/" + lang + ".json";
        }
        let data = native.fs.readFileSync(RESOURCES_JSON, "utf8");
        data = JSON.parse(data);
        return data;
    } catch (e) {
    }
};
export class LangApp extends EventEmitter {
    // protected lang = "EN"; // get_settings_from_json("MAIN", "lang");
    // protected resource = get_string_resources(this.lang);
    // static SETTINGS = "lang_change";
    lang = get_settings_from_json("settings", "locale");
    resource = get_string_resources(this.lang);
    SETTINGS = "lang_change";
    get get_lang() {
        return this.lang;
    }
    set set_lang(lang: string) {
        this.lang = lang;
        this.resource = get_string_resources(lang);
        this.emit(LangApp.SETTINGS, lang);
    }
    get get_resource() {
        return this.resource;
    }
    set set_resource(resource: any) {
        this.resource = resource;
        this.emit(LangApp.SETTINGS, resource);
    }
}
export let lang = new LangApp().setMaxListeners(0);
interface DialogOptions {
    title: string;
    message: string;
    open: boolean;
    code: boolean;
    cb: (code: boolean) => void;
}
export class DialogBox extends EventEmitter {
    static SETTINGS = "dialog_change";
    /*protected */dialog: DialogOptions = {
        title: "",
        message: "",
        open: false,
        code: false,
        cb: (code) => { },
    };
    ShowDialog(title: string, message: string, cb: (code: boolean) => void) {
        let dig: DialogOptions = { title: title, message: message, open: true, code: false, cb: cb };
        this.set_dlg_all = dig;
    }
    set set_dlg_all(dig: DialogOptions) {
        this.dialog = dig;
        this.emit(DialogBox.SETTINGS, dig);
    }
    get get_dlg_open() {
        return this.dialog.open;
    }
    get get_dlg_title() {
        return this.dialog.title;
    }
    get get_dlg_message() {
        return this.dialog.message;
    }
    get get_dlg() {
        return this.dialog;
    }
    CloseDialog(button_code: boolean) {
        this.dialog.cb(button_code);
        let dig: DialogOptions = {
            title: "",
            message: "",
            open: false,
            code: button_code,
            cb: (code) => { },
        };
        this.set_dlg_all = dig;
    }
}
export let dlg = new DialogBox();
export let checkFiles = function (operation: string) {
    let files = operation === "sign" || operation === "verify" ? sign.get_files : encrypt.get_files;
    let files_for_operation: any = [];
    let count: any = [];
    for (let i = 0; i < files.length; i++) {
        if (!native.fs.existsSync(files[i].path)) {
            count.push(i);
        }
    }
    for (let i = count.length - 1; i > -1; i--) {
        files.splice(count[i], 1);
    }
    for (let j = 0; j < files.length; j++) {
        files[j].key = j;
        if (files[j].active === true) {
            files_for_operation.push(files[j]);
        }
    }
    operation === "sign" || operation === "verify" ? sign.set_files = files : encrypt.set_files = files;
    operation === "sign" || operation === "verify" ? sign.set_files_for_sign = files_for_operation : encrypt.set_files_for_encrypt = files_for_operation;
    if (files_for_operation.length === 0) {
        $(".toast-files_not_found").remove();
        Materialize.toast(lang.get_resource.Common.files_not_found, 3000, "toast-files_not_found");
        return false;
    }
    return true;
};
import { certs_app } from "./certificates_app";
import { encrypt } from "./encrypt_app";
import { sign } from "./sign_app";
