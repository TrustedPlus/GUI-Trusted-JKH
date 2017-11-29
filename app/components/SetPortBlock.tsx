import * as React from "react";
import { lang, work_with_settings } from "../module/global_app";
// import { connect } from "react-redux";

interface ISetPortBlockProps {
  text: string;
}

class SetPortBlock extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state={
      val: work_with_settings.get_setting(this.props.type)
    }
  }

  setPort(current_value: string){
    work_with_settings.set_setting(this.props.type, current_value);
    this.setState({val: current_value});
  }

  render() {
    const { text, second_text, new_class } = this.props;
    const name = new_class ? new_class : "";

    return (
      <div className="main_block_setting_proxy">
        <label className="label_settings_proxy">{text}</label>
        <input className="input_setting_port" id="port" type="text" value={this.state.val}  onChange={(evt) => this.setPort(evt.target.value)}></input>
      </div>
    );
  }
}

export default SetPortBlock;
