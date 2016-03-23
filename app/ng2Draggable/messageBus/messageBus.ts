export class MessageBus {
    
    static listeners: Object[] = [];
    static dispatch(event: string, info?: any): void {
         this.listeners
            .forEach((l) => {
               if (l["event"] === event) {
                   l["cb"](info);
               }
            });
    }

    static listen(event:string, cb: (any) => any):void {
        this.listeners.push({event: event, cb: cb});
    }
}