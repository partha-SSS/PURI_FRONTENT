
export class ShowMessage {
  public Show: boolean;
  public Type: MessageType;
  public Message: string;
}

export enum MessageType {
  Sucess,
  Warning,
  Info,
  Error
}
