import * as React from "react";
import { connect } from "react-redux";
import { loadLicense } from "../AC";
import { SETTINGS_JSON } from "../module/global_app";
import LocaleSelect from "./LocaleSelect";
import * as native from "../native";
import SideMenu from "./SideMenu";

const remote = window.electron.remote;
if (remote.getGlobal("sharedObject").logcrypto) {
  window.logger = trusted.utils.Logger.start(path.join(os.homedir(), ".Trusted", "trusted-crypto.log"));
}

class MenuBar extends React.Component<any, any> {
  static contextTypes = {
    locale: React.PropTypes.string,
    localize: React.PropTypes.func,
  };

  constructor(props: any) {
    super(props);
  }

  minimizeWindow() {
    mainWindow.minimize();
  }

  closeWindow() {
    const { localize, locale } = this.context;
    const { encSettings, signSettings } = this.props;

    let proxySettings = {"port":8080,"server_status":"onstop","ip_server":"217.107.108.147","port_server":10081}

    const state = ({
      settings: 
      {
        encrypt: encSettings,
        locale,
        sign: signSettings,
        proxy: proxySettings,
      },
    });

    const sstate = JSON.stringify(state, null, 4);

    native.fs.writeFile(SETTINGS_JSON, sstate, (err: any) => {
      if (err) {
        console.log(localize("Settings.write_file_failed", locale));
      }
      console.log(localize("Settings.write_file_ok", locale));
      mainWindow.close();
    });
  }

  getTitle() {
    const { localize, locale } = this.context;
    const pathname = this.props.location.pathname;
    let title: string;
    if (pathname === "/setting")
      title = localize("Settings.settings", locale);
    else if (pathname === "/journal")
      title = localize("Journal.journal", locale);
    else if (pathname === "/certificate")
      title = localize("Certificate.certs", locale);
    else if (pathname === "/about")
      title = localize("About.about", locale);
    else if (pathname === "/license")
      title = localize("License.license", locale);
    else if (pathname === "/help")
      title = localize("Help.help", locale);
    else if (pathname === "/request")
      title = localize("Requests.requests", locale);
    else
      title = localize("About.product_NAME", locale);

    return title;
  }

  componentDidMount() {
    const { loadLicense, loadedLicense, loadingLicense } = this.props;

    if (!loadedLicense && !loadingLicense) {
      loadLicense();
    }

    $(".menu-btn").sideNav({
      closeOnClick: true,
    });
  }

  render() {
    return (
      <div className="main">
        <nav className="app-bar">
          <div className="col s6 m6 l6 app-bar-wrapper">
            <ul className="app-bar-items">
              <li>
                <a data-activates="slide-out" className="menu-btn waves-effect waves-light">
                  <i className="material-icons">menu</i>
                </a>
              </li>
              <li className="app-bar-text">{this.getTitle()}</li>
              <li>
                <ul>
                  <li>
                    <LocaleSelect />
                  </li>
                  <li>
                    <a className="minimize-window-btn waves-effect waves-light" onClick={this.minimizeWindow.bind(this)}>
                      <i className="material-icons">remove</i>
                    </a>
                  </li>
                  <li>
                    <a className="close-window-btn waves-effect waves-light" onClick={this.closeWindow.bind(this)}>
                      <i className="material-icons">close</i>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <ul id="slide-out" className="side-nav">
            <SideMenu />
          </ul>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

export default connect((state) => {
  return {
    encSettings: state.settings.encrypt,
    loadedLicense: state.license.loaded,
    loadingLicense: state.license.loading,
    signSettings: state.settings.sign,
  };
}, {loadLicense})(MenuBar);
