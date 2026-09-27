"use client";

import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";

type BatchQrCodeProps = {
  batchCode: string;
  size?: number;
};

export default function BatchQrCode({
  batchCode,
  size = 220,
}: BatchQrCodeProps) {
  const traceUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `/trace/${batchCode}`;
    }

    return `${window.location.origin}/trace/${encodeURIComponent(
      batchCode
    )}`;
  }, [batchCode]);

  return (
    <div className="inline-flex flex-col items-center bg-white p-4 text-black">
      <QRCodeSVG
        value={traceUrl}
        size={size}
        level="M"
        includeMargin
        bgColor="#ffffff"
        fgColor="#111111"
      />

      <p className="mt-3 font-mono text-xs font-semibold tracking-[0.12em]">
        {batchCode}
      </p>

      <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-black/45">
        Scan to trace this batch
      </p>
    </div>
  );
}