interface BasePrepareParams {
  to: string;
  from?: string;
  successLink?: string;
  failLink?: string;
}

export interface ExecuteContractParams extends BasePrepareParams {
  value: string;
  abi: string;
  params: string;
}

export interface SendKlayParams extends BasePrepareParams {
  amount: string;
}

export interface SendTokenParams extends BasePrepareParams {
  contract: string;
  amount: string;
}

export interface SendCardParams extends BasePrepareParams {
  contract: string;
  id: string;
}

export interface GetResultResponse {
  address?: string;
  txHash?: string;
  status?: "pending" | "success" | "fail";
}
