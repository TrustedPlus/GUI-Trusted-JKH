import * as React from "react";
import { lang } from "../module/global_app";

interface ISetLogLevelProps {
  EncodingValue: string;
  handleChange: (encoding: string) => void;
}

class SetLogLevel extends React.Component<any, any> {
  static contextTypes = {
    locale: React.PropTypes.string,
    localize: React.PropTypes.func,
  };

  constructor(props: any) {
    super(props);
  }

  render() {
    const { text, second_text, new_class } = this.props;
    const name = new_class ? new_class : "";
    const { localize, locale } = this.context;
    
    $(document).ready(function() {
        $('select').material_select();
    });

    return (
      <div className="row">
        <div className="col l3 s6 format">
            <label className="label_settings_proxy">{localize("Settings.loglevel", locale)}</label>
        </div>
        <div className="col l3 s6">
        <div className="row">
          {/* <div className="input-field col s6"> */}
          <div>
            <select>
              <option value="" disabled selected>{localize("Settings.loglevel_choose", locale)}</option>
              <option value="1">{localize("Settings.OFF", locale)}</option>
              <option value="2">{localize("Settings.FATAL", locale)}</option>
              <option value="3">{localize("Settings.ERROR", locale)}</option>
              <option value="2">{localize("Settings.WARN", locale)}</option>
              <option value="3">{localize("Settings.INFO", locale)}</option>
              <option value="2">{localize("Settings.DEBUG", locale)}</option>
              <option value="3">{localize("Settings.TRACE", locale)}</option>
              <option value="3">{localize("Settings.ALL", locale)}</option>
            </select>
          </div>
        </div>   
        </div> 
        </div>
    );
  }
}

export default SetLogLevel;
