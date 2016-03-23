export interface IMessageBus {
    dispatch: (eventName: string, info?: any) => void;
    listen: (eventName: string, callback: Function) => void;
}