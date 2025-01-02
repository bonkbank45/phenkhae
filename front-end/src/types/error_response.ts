interface ErrorResponse {
  code: string;
  config: any;
  message: string;
  name: string;
  request: any;
  response: {
    data: {
      errors: {
        [key: string]: string[];
      };
      message: string;
    };
  };
  status: number;
}

export type { ErrorResponse };
