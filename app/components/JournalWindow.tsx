import * as React from "react";
import { lang, LangApp } from "../module/global_app";
import ViewTextFile from "./ViewTextFile";
import LogList from "./LogList";
import LogBack from "./LogBack";
//declare const $: any;

export default class JournalWindow extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }


  render(): any {
    return (
      <div className="main">
        <LogBack />
        <LogList />
      </div>
    );
  }
}
