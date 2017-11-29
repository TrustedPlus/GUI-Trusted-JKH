import * as React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { lang } from "../module/global_app";
import * as native from "../native";
import HeaderWorkspaceBlock from "./HeaderWorkspaceBlock";
import SetLogLevel from "./SetLogLevel";

const fs = require("fs");

const dialog = window.electron.remote.dialog;

class Log4ForSettings extends React.Component<any, any> {
  static contextTypes = {
    locale: React.PropTypes.string,
    localize: React.PropTypes.func,
  };

  constructor(props: any) {
    super(props);
  }

  removeJournal(){
      //const JOURNAL_PATH = './app/resources/log/test.txt';
      const JOURNAL_PATH = native.path.join(native.DEFAULT_PATH, "log", "gis-proxy.log");
      //native.fs.unlinkSync(JOURNAL_PATH);
      native.fs.writeFileSync(JOURNAL_PATH, '');
  }

  render() {
    const { localize, locale } = this.context;

    //const { settings } = this.props;
    return (
      <div id="journal-settings-content" className="content-wrapper">
        <HeaderWorkspaceBlock text={localize("Settings.log_block_title", locale)} />
        <div>
            <SetLogLevel text={localize("Settings.loglevel", locale)} />
        </div>
        <div className="row align-center">
          <button onClick={this.removeJournal.bind(this)} className="waves-effect waves-light btn-large add-cert-btn">{localize("Settings.clear_journal", locale)}</button>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
  settings: state.settings.sign,
  locale: state.settings.locale,
}), {})(Log4ForSettings);
