import * as React from 'react';
import * as native from "../native";
import InfiniteScroll from '../../node_modules/react-infinite-scroller';

class LogList extends React.Component<any, any> {
  constructor(props: any){
    super(props);

    this.state = {
      items: [],
      logs: []
    };
  
  }

  componentWillMount(){
    try{
      //const JOURNAL_PATH = native.path.join(native.DEFAULT_PATH, "log", "gis-proxy.log");
      const JOURNAL_PATH = native.path.join(native.HOME_DIR, ".Trusted", "Trusted JKH", "gis-proxy.log");
      let data: string = native.fs.readFileSync(JOURNAL_PATH);
      let start_log_array = new String(data).split('\n');
      this.setState({logs: start_log_array});
      if(start_log_array.length >= 100){
        start_log_array = start_log_array.slice(0, 100);
      }
      this.setState({items: start_log_array});
    }catch(e){

    }
  }

  loadItems() {
    let items = this.state.items;
    if(items.length === this.state.logs.length){
      return;
    }

    for(let i = 0; i < 100; i++){
      if(items.length < this.state.logs.length){
        items.push(this.state.logs[items.length]);
      }
    }
    this.setState({items: this.state.items});
  }

  render() {
    const items = this.state.items.map((elem: any, index: number) =>{
      return <div key={index}>
        {elem}
      </div>;
    });

    return <div className="app-loglist-text">
      <InfiniteScroll
        loadMore={this.loadItems.bind(this)}
        hasMore={true}
        useWindow={false}
      >
        {items} 
      </InfiniteScroll>
    </div>;
  }
}

export default LogList;

