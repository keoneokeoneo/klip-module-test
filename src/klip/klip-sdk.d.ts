declare module "klip-sdk" {
  interface BasePrepareRequest {
    bappName: string;
    successLink?: string;
    failLink?: string;
  }

  interface AuthRequest extends BasePrepareParams {}

  interface BaseTransactionRequest extends BasePrepareRequest {
    to: string;
    from?: string;
  }

  interface SendKlayParams extends BaseTransactionRequest {
    amount: string;
  }

  interface SendTokenParams extends BaseTransactionRequest {
    amount: string;
    contract: string;
  }

  interface SendCardParams extends BaseTransactionRequest {
    id: string;
    contract: string;
  }

  interface ExecuteContractParams extends BaseTransactionRequest {
    value: string;
    abi: string;
    params: string;
  }

  interface GetCardListParams {
    contract: string;
    eoa: string;
    cursor?: string;
  }

  interface BaseResponse {
    request_key: string;
    status: "prepared" | "requested" | "completed" | "canceled" | "error";
    expiration_time: number;
    // Error
    err?: string;
    code?: string;
  }

  interface PrepareResponse extends BaseResponse {}

  interface GetResultResponse extends BaseResponse {
    result: {
      // only for auth
      klaytn_address?: string;
      // otherwise
      tx_hash?: string;
      status?: "pending" | "success" | "fail";
    };
  }

  interface GetCardListResponse {
    created_at: number;
    updated_at: number;
    owner: string;
    sender: string;
    card_id: number;
    card_uri: string;
    transaction_hash: string;
  }

  export const prepare: {
    auth: (params: AuthParams) => Promise<PrepareResponse>;
    sendKLAY: (params: SendKlayParams) => Promise<PrepareResponse>;
    sendToken: (params: SendTokenParams) => Promise<PrepareResponse>;
    sendCard: (params: SendCardParams) => Promise<PrepareResponse>;
    executeContract: (
      params: ExecuteContractParams
    ) => Promise<PrepareResponse>;
  };
  export const request: (
    requestKey: string,
    onUnsupportedEnvironment?: () => void
  ) => void;
  export const getResult: (requestKey: string) => Promise<GetResultResponse>;
  export const getCardList: (
    params: GetCardListParams
  ) => Promise<Array<GetCardListResponse>>;
}
