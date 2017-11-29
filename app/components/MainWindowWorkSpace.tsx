import * as React from "react";
import { connect } from "react-redux";
import MainWindow from "./MainWindow";
import MainWindowOperation from "./MainWindowOperation";
import { proxy } from "../proxy";
import { work_with_settings } from "../module/global_app";

class MainWindowWorkSpace extends React.Component<any, any> {
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
    const { serv_status } = this.state;

    let serv_stat;
    if(serv_status == "onstop"){
      serv_stat = localize("Common.serverStop", locale);
    }else if(serv_status == "onstart"){
      serv_stat = localize("Common.serverStart", locale);
    }else if(serv_status == "onrestart"){
      serv_stat = localize("Common.serverRestart", locale);
    }

    return (
      <div>
        <div className="header image">
          <div className="row">
            <div className="col s3">
              <i className="logo"></i>
            </div>
            <div className="col s8">
              <div className="white-text cryptobanner">
                <p>{localize("About.info_about_product", locale)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="maincontent">
        <div className="row">
          <div className="col l3 s8">
            <div className="appfunction">
              <div className="row">
                <MainWindowOperation
                  info={localize("About.info_about_setting", locale)}
                  title_pre={localize("Settings.Settings", locale)}
                  title_post=''
                  operation="setting"
                />
              </div>
              <div className="row">
                <MainWindowOperation
                  info={localize("About.info_about_journal", locale)}
                  title_pre={localize("Journal.Journal", locale)}
                  title_post=''
                  operation="journal"
                />
              </div>

            </div>
          </div>
          <div className="col l3 s4 polygonArea">
              <div className="polygon">
               <div className="white-text server">
                 {/* Смена статуса сервера */}
                    {serv_stat}
                </div>
                <div className="r-iconbox-icon server">
                   <div className="server_icon">   
                    </div>
                </div>
                  <div className="r-iconbox-link iconpos_left">
                    <div className="r-iconbox-link start" onClick={this.handleStatus.bind(this, "onstart")}>
                      <div className="r-iconbox-icon">
                        <div className="start_roundbutton_icon tooltipped" data-position="left" data-delay="50" data-tooltip={localize("Common.tooltip_start", locale)}></div>
                      </div>
                    </div>
                  </div>
                  <div className="r-iconbox-link iconpos_left">
                    <div className="r-iconbox-link stop" onClick={this.handleStatus.bind(this, "onstop")}>
                      <div className="r-iconbox-icon">
                        <div className="stop_roundbutton_icon tooltipped" data-position="left" data-delay="50" data-tooltip={localize("Common.tooltip_stop", locale)}></div>
                      </div>
                    </div>
                  </div>
                  <div className="r-iconbox-link iconpos_left">
                    <div className="r-iconbox-link restart" onClick={this.handleStatus.bind(this, "onrestart")}>
                      <div className="r-iconbox-icon">
                        <div className="restart_roundbutton_icon tooltipped" data-position="left" data-delay="50" data-tooltip={localize("Common.tooltip_restart", locale)}></div>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default MainWindowWorkSpace;
