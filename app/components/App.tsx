import * as React from "react";
import { connect } from "react-redux";
import { hashHistory, IndexRoute, Route, Router } from "react-router";
import history from "../history";
import localize from "../i18n/localize";
import { AboutWindow } from "./AboutWindow";
import CertWindow from "./CertWindow";
import HelpWindow from "./HelpWindow";
import LicenseWindow from "./License/LicenseWindow";
import MainWindow from "./MainWindow";
import MenuBar from "./MenuBar";
import SettingsWindow from "./SettingsWindow";
import JournalWindow from "./JournalWindow";

class App extends React.Component<any, any> {
  static childContextTypes = {
    locale: React.PropTypes.string,
    localize: React.PropTypes.func,
  };

  constructor(props: any) {
    super(props);
  }

  getChildContext() {
    const { locale } = this.props;
    return {
      locale,
      localize,
    };
  }

  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={MenuBar}>
          <IndexRoute component={MainWindow} />
          <Route path="/setting" component={SettingsWindow} />
          <Route path="/journal" component={JournalWindow} />  
          <Route path="/certificate" component={CertWindow} />
          <Route path="/license" component={LicenseWindow} />
          <Route path="/about" component={AboutWindow} />
          <Route path="/help" component={HelpWindow} />
        </Route>
        {/* {this.routes} */}
      </Router>
    );
  }
}

export default connect((state) => ({
  locale: state.settings.locale,
}))(App);
