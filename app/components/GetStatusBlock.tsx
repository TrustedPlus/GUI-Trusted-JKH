import * as React from "react";
import { lang } from "../module/global_app";

interface IGetStatusBlockProps {
  text: string;
}

class GetStatusBlock extends React.Component<any, any> {
  static contextTypes = {
    locale: React.PropTypes.string,
    localize: React.PropTypes.func,
  };

  constructor(props: any) {
    super(props);
  }

  render() {
    const { localize, locale } = this.context;

    const { text, second_text, new_class } = this.props;
    const name = new_class ? new_class : "";
    //
    const serv_stat = `server_${this.props.icon}_icon`;
  
    return (
      <div className="row">
        <div className="main_block_setting_status">
          <div className="col l3 s4 container_sattings_status">
            <label className="label_settings_status">{localize("Settings.status", locale)}</label>
          </div>
           <div className="col l3 s3">
              <div className={serv_stat}></div>
           </div>
        </div>
      </div>
    );
  }
}

export default GetStatusBlock;
