export class MessageBus {
    
    static listeners: Object[] = [];
    static dispatch(event: string, param1?: any, param2?:any): void {
         this.listeners
            .forEach((l) => {
               if (l["event"] === event) {
                   l["cb"](param1, param2);
               }
            });
    }

    static listen(event:string, cb: (any) => any):void {
        this.listeners.push({event: event, cb: cb});
    }
}