import React, { useEffect, useState, useCallback } from "react";
import QRCode from "react-qr-code";

import Klip from "./index";

interface Props {
  klip: Klip;
  requestKey: string;
  onClose: () => void;
  expirationTime?: number;
}

const ConnectKlip = ({ klip, requestKey, onClose, expirationTime }: Props) => {
  const [restSec, setRestSec] = useState<number | null>(null);

  const toPadStart = useCallback((input: number) => {
    return input.toString().padStart(2, "0");
  }, []);

  useEffect(() => {
    const getExpirationTime = async () => {
      const _expirationTime = await klip.getExpirationTimeByRequest(requestKey);

      if (!_expirationTime) return;

      const currentTime = new Date(Date.now()).getTime();
      const targetTime = new Date(_expirationTime * 1000).getTime();

      const difference = Math.floor((targetTime - currentTime) / 1000);

      setRestSec(
        expirationTime ? Math.min(difference, expirationTime) : difference
      );
    };

    getExpirationTime();
  }, [requestKey, klip, expirationTime]);

  useEffect(() => {
    let timerFunction: any = null;

    if (restSec === null) return;

    if (restSec <= 0) {
      onClose();
    }

    timerFunction = setInterval(() => {
      setRestSec((prev) => (prev ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(timerFunction);
  }, [restSec, onClose]);

  return (
    <>
      <QRCode value={klip.getQrUrl(requestKey)} size={240} level="H" />
      <p>{`${toPadStart(Math.floor((restSec ?? 0) / 60))} : ${toPadStart(
        (restSec ?? 0) % 60
      )}`}</p>
    </>
  );
};

export default ConnectKlip;
