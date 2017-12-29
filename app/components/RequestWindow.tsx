import * as React from "react";

export default class RequestWindow extends React.Component<any, any> {
    constructor(props: any) {
      super(props);
    }
  
  
    render(): any {
      return (
        <div className="main">
            <div>1) Запрос на импорт данных в ГИС ЖКХ;</div><br/>
            <div>2)Запрос на экспорт данных из ГИС ЖКХ;</div><br/>
            <div>3)Запрос статуса обработки запроса в ГИС ЖКХ (для асинхронного взаимодействия).</div>
        </div>
      );
    }
  }