export interface IResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data?: any;
}

export class HttpResponse implements IResponse {
  status: number;
  success: boolean;

  data?: any;
  message?: string;
}

export class SqlTransactionResponse implements IResponse {
  success: boolean;
  data?: any;
  message?: string;
}
