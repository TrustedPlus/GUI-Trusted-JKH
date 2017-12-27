import * as React from "react";
import { lang, LangApp } from "../module/global_app";
import ViewTextFile from "./ViewTextFile";
//declare const $: any;

export default class JournalWindow extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }


  render(): any {
    return (
      <div className="app-loglist-back">
        <div>
          <a className="waves-effect waves-light btn-large add-cert-btn" href="#">{lang.get_resource.Common.Back}</a>
        </div>
      </div>
    );
  }
}