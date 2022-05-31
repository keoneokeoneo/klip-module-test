import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { getResult } from "klip-sdk";

import "./App.css";
import Klip from "./klip";
import { transactionA, transactionB } from "./constants";
import ConnectKlip from "./klip/ConnectKlip";

const App = () => {
  const [klip] = useState(new Klip("Kronos DAO"));
  const [address, setAddress] = useState("");
  const [requestKey, setRequestKey] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  /* For testing transaction status */
  const [data, setData] = useState<{
    txHash: string;
    status: "pending" | "success" | "fail";
    key: string;
  } | null>(null);

  const handleAuth = async () => {
    try {
      const result = await klip.auth();

      if (result) {
        setRequestKey(result.requestKey);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStake = async () => {
    setData(null);

    try {
      const result = await klip.executeContract({
        abi: transactionA.abi,
        to: transactionA.to,
        value: "0",
        params: JSON.stringify([transactionA.input, address]),
      });

      if (result) {
        setRequestKey(result.requestKey);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnStake = async () => {
    setData(null);

    try {
      const result = await klip.executeContract({
        abi: transactionB.abi,
        to: transactionB.to,
        value: "0",
        params: JSON.stringify([transactionB.input, true]),
      });

      if (result) {
        setRequestKey(result.requestKey);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const initState = () => {
    console.log("init");
    setVisible(false);
    setRequestKey(null);
  };

  const pollingResult = async (requestKey: string) => {
    try {
      const result = await klip.getResult(requestKey);

      // Handling for auth
      if (result.address) setAddress(result.address);

      // Handling for otherwise
      if (result.txHash && result.status) {
        setData({
          txHash: result.txHash,
          status: result.status,
          key: requestKey,
        });
      }
    } catch (e) {
      console.error(e);
    }
    initState();
  };

  useEffect(() => {
    let pollingTransaction: any = null;

    if (data) {
      pollingTransaction = setInterval(async () => {
        try {
          const { result } = await getResult(data.key);

          if (result.status && result.status !== "pending") {
            setData({
              key: data.key,
              status: result.status,
              txHash: data.txHash,
            });
            clearInterval(pollingTransaction);
          }
        } catch (e) {
          console.error(e);
        }
      }, 1000);
    }

    return () => clearInterval(pollingTransaction);
  });

  useEffect(() => {
    if (requestKey) {
      // Handle Request
      if (isMobile) {
        klip.request(requestKey);
      } else {
        setVisible(true);
      }

      // Handle Polling Result
      pollingResult(requestKey);
    }
  }, [requestKey]);

  return (
    <div className="container">
      {!address && !requestKey && (
        <button onClick={handleAuth}>Connect to Klip</button>
      )}

      {!!address && (
        <div className="section">
          <p>{`Address : ${address}`}</p>
          <div className="button-wrapper">
            <button onClick={handleStake}>Stake</button>
            <button onClick={handleUnStake}>Unstake</button>
          </div>
        </div>
      )}

      {visible && requestKey && (
        <div className="section">
          <ConnectKlip
            klip={klip}
            requestKey={requestKey}
            onClose={initState}
          />
        </div>
      )}

      {data && (
        <div className="section">
          <p>{`txHash : ${data.txHash}`}</p>
          <p>{`Status : ${data.status}`}</p>
        </div>
      )}
    </div>
  );
};

export default App;
