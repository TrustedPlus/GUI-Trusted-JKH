import * as React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
// import {
//   changeSignatureDetached, changeSignatureEncoding,
//   changeSignatureOutfolder, changeSignatureTimestamp,
// } from "../AC";
// import { BASE64, DER } from "../constants";
import { work_with_settings } from "../module/global_app";
//import CheckBoxWithLabel from "./CheckBoxWithLabel";
//import EncodingTypeSelector from "./EncodingTypeSelector";
import HeaderWorkspaceBlock from "./HeaderWorkspaceBlock";
import GetStatusBlock from "./GetStatusBlock";
import SetPortBlock from "./SetPortBlock";
import SelectFolder from "./SelectFolder";
import { proxy } from "../proxy";


const dialog = window.electron.remote.dialog;


class ProxyBlockForSettings extends React.Component<any, any> {
  static contextTypes = {
    locale: React.PropTypes.string,
    localize: React.PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    this.state = {
      serv_status: work_with_settings.get_setting("server_status"),
    }
  }


/*} addDirect() {
    const { changeSignatureOutfolder } = this.props;

    if (!window.framework_NW) {
      const directory = dialog.showOpenDialog({ properties: ["openDirectory"] });
      if (directory) {
        changeSignatureOutfolder(directory[0]);
      }
    } else {
      const clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent("click", true, true);
      document.querySelector("#choose-folder").dispatchEvent(clickEvent);
    }
  }

  handleDetachedClick = () => {
    const { changeSignatureDetached, settings } = this.props;
    changeSignatureDetached(!settings.detached);
  }

  handleTimestampClick = () => {
    const { changeSignatureTimestamp, settings } = this.props;
    changeSignatureTimestamp(!settings.timestamp);
  }

  handleOutfolderChange = ev => {
    ev.preventDefault();
    const { changeSignatureOutfolder } = this.props;
    changeSignatureOutfolder(ev.target.value);
  }

  handleEncodingChange = (encoding: string) => {
    const { changeSignatureEncoding } = this.props;
    changeSignatureEncoding(encoding);
  } */

  handleStatus(val: string, event: any){
    this.setState({serv_status: new String(val)});
    if(val === "onstart"){
      proxy.start();
    }
    else if( val === "onstop"){
      proxy.stop();
    }
    else if(val === "onrestart"){
      proxy.restart();
      this.setState({serv_status: "onstart"});
    }
  }

  render() {
    const { localize, locale } = this.context;
    const { settings } = this.props;
    const serverStatus = this.state.serv_status;
    
    return (
      <div id="sign-settings-content" className="content-wrapper">
        <HeaderWorkspaceBlock text={localize("Settings.proxy_block_title", locale)} />
        <div className="settings-content">
          <div className="row">
              <div className="col l3 s8">
                  <SetPortBlock 
                    text={localize("Settings.port", locale)} 
                    type="port"
                    //updateInfo={this.updateProxy.bind(this)} 
                  />
                  <SetPortBlock 
                    text={localize("Settings.ip_server", locale)} 
                    type="ip_server"
                    //updateInfo={this.updateProxy.bind(this)}
                  />
                  <SetPortBlock 
                    text={localize("Settings.port_server", locale)} 
                    type="port_server"
                    //updateInfo={this.updateProxy.bind(this)} 
                  />
                  <GetStatusBlock 
                    text={localize("Settings.status", locale)} 
                    icon={serverStatus} />
              </div>
              <div className="col l3 s4">
                <div className="r-iconbox-link iconpos_left">
                    <div className="r-iconbox-link start_small">
                      <div className="r-iconbox-icon">
                        <div className="start_smallbutton_icon" onClick={this.handleStatus.bind(this, "onstart")}></div>
                      </div>
                    </div>
                  </div>
                  <div className="r-iconbox-link iconpos_left">
                    <div className="r-iconbox-link stop_small" >
                      <div className="r-iconbox-icon">
                        <div className="stop_smallbutton_icon" onClick={this.handleStatus.bind(this, "onstop")}></div>
                      </div>
                    </div>
                  </div>
                  <div className="r-iconbox-link iconpos_left">
                    <div className="r-iconbox-link restart_small">
                      <div className="r-iconbox-icon">
                        <div className="restart_smallbutton_icon" onClick={this.handleStatus.bind(this, "onrestart")}></div>
                      </div>
                    </div>
                  </div>
              </div>
          </div>

        {/*  <EncodingTypeSelector EncodingValue={settings.encoding} handleChange={this.handleEncodingChange}/>
          <CheckBoxWithLabel onClickCheckBox={this.handleDetachedClick}
            isChecked={settings.detached}
            elementId="detached-sign"
            title={lang.get_resource.Sign.sign_detached} />
          <CheckBoxWithLabel onClickCheckBox={this.handleTimestampClick}
            isChecked={settings.timestamp}
            elementId="sign-time"
            title={lang.get_resource.Sign.sign_time} />
          <SelectFolder directory={settings.outfolder} viewDirect={this.handleOutfolderChange}
            openDirect={this.addDirect.bind(this)} />*/}
        </div>
      </div>
    );
  }
}

export default ProxyBlockForSettings;

// export default connect((state) => ({
//   settings: state.settings.sign,
// }), 
// { changeSignatureDetached, changeSignatureEncoding, 
//   changeSignatureOutfolder, changeSignatureTimestamp
// })(ProxyBlockForSettings);
