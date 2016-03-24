export class MessageBus {
    
    static listeners: Object[] = [];
    static dispatchEndCallBack: Function;
    static dispatch(event: string, param1?: any, param2?:any): void {
         this.listeners
            .forEach((l) => {
               if (l["event"] === event) {
                   l["cb"](param1, param2);
               }
            });
         this.dispatchEndCallBack(event , param1);
    }

    static listen(event:string, cb: (any) => any):void {
        this.listeners.push({event: event, cb: cb});
    }

    static registerDispatchEndCallBack( cb : (any) => any) :void{
    this.dispatchEndCallBack = cb;
    }
}