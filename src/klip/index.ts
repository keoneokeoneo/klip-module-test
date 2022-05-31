import { prepare, getResult, request } from "klip-sdk";

import {
  ExecuteContractParams,
  GetResultResponse,
  SendCardParams,
  SendKlayParams,
  SendTokenParams,
} from "./types";

class Klip {
  private bappName: string;

  constructor(bappName: string) {
    this.bappName = bappName;
  }

  public getQrUrl = (requestKey: string) => {
    return `https://klipwallet.com/?target=/a2a?request_key=${requestKey}`;
  };

  public auth = async (successLink?: string, failLink?: string) => {
    try {
      const result = await prepare.auth({
        bappName: this.bappName,
        successLink,
        failLink,
      });

      if (result.err) {
        throw new Error(result.err);
      }

      return {
        requestKey: result.request_key,
      };
    } catch (error) {
      console.error(error);
    }

    return null;
  };

  public sendKlay = async ({
    amount,
    to,
    failLink,
    from,
    successLink,
  }: SendKlayParams) => {
    try {
      const result = await prepare.sendKLAY({
        bappName: this.bappName,
        amount,
        to,
        from,
        successLink,
        failLink,
      });

      if (result.err) {
        throw new Error(result.err);
      }

      return {
        requestKey: result.request_key,
      };
    } catch (error) {
      console.error(error);
    }

    return null;
  };

  public sendCard = async ({
    id,
    contract,
    to,
    failLink,
    from,
    successLink,
  }: SendCardParams) => {
    try {
      const result = await prepare.sendCard({
        bappName: this.bappName,
        contract,
        id,
        to,
        from,
        successLink,
        failLink,
      });

      if (result.err) {
        throw new Error(result.err);
      }

      return {
        requestKey: result.request_key,
      };
    } catch (error) {
      console.error(error);
    }

    return null;
  };

  public sendToken = async ({
    amount,
    contract,
    to,
    failLink,
    from,
    successLink,
  }: SendTokenParams) => {
    try {
      const result = await prepare.sendToken({
        bappName: this.bappName,
        amount,
        contract,
        to,
        from,
        successLink,
        failLink,
      });

      if (result.err) {
        throw new Error(result.err);
      }

      return {
        requestKey: result.request_key,
      };
    } catch (error) {
      console.error(error);
    }

    return null;
  };

  public executeContract = async ({
    abi,
    params,
    to,
    value,
    from,
    successLink,
    failLink,
  }: ExecuteContractParams) => {
    try {
      const result = await prepare.executeContract({
        bappName: this.bappName,
        to,
        value,
        abi,
        params,
        from,
        successLink,
        failLink,
      });

      if (result.err) {
        throw new Error(result.err);
      }

      return {
        requestKey: result.request_key,
      };
    } catch (error) {
      console.error(error);
    }

    return null;
  };

  public request = (
    requestKey: string,
    onUnsupportedEnvironment?: () => void
  ) => {
    request(requestKey, onUnsupportedEnvironment);
  };

  public getExpirationTimeByRequest = async (requestKey: string) => {
    try {
      const result = await getResult(requestKey);

      if (result.err) {
        throw new Error(result.err);
      }

      return result.expiration_time;
    } catch (error) {
      console.error(error);
    }

    return null;
  };

  public getResult = async (requestKey: string, fetchPeriod?: number) => {
    const expirationTime =
      (await this.getExpirationTimeByRequest(requestKey)) ?? 0;

    return new Promise<GetResultResponse>((resolve, reject) => {
      const checkFunction = setInterval(async () => {
        try {
          const { result, status, err } = await getResult(requestKey);

          if (err) {
            throw new Error(err);
          }

          if (status === "canceled") {
            throw new Error("User canceled this request");
          }

          if (status === "completed") {
            resolve({
              address: result.klaytn_address,
              txHash: result.tx_hash,
              status: result.status,
            });
            clearInterval(checkFunction);
          }
        } catch (error) {
          reject(error);
          clearInterval(checkFunction);
        }
      }, fetchPeriod ?? 1000);

      setTimeout(() => {
        reject("This request has expired");
        clearInterval(checkFunction);
      }, 1000 * expirationTime);
    });
  };

  public getCardList = async () => {
    try {
    } catch (error) {
      console.error(error);
    }
  };
}

export default Klip;
