export interface IMessageBus {
    dispatch: (eventName: string, param1?: any, param2?: any) => void;
    listen: (eventName: string, callback: Function) => void;
}