import * as React from "react";
import { lang, LangApp } from "../module/global_app";
import ViewTextFile from "./ViewTextFile";
//declare const $: any;

class JournalWindow extends React.Component<any, any> {
  static contextTypes = {
    locale: React.PropTypes.string,
    localize: React.PropTypes.func,
  };
  
  constructor(props: any) {
    super(props);
  }


  render(): any{
    const { localize, locale } = this.context;

    return (
      <div className="app-loglist-back">
        <div>
          <a className="waves-effect waves-light btn-large add-cert-btn back-btn-log" href="#">{localize("Common.Back", locale)}</a>
        </div>
      </div>
    );
  }
}

export default JournalWindow;