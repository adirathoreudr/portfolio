import { ImageResponse } from "next/og";

export const alt = "ADITYA RATHORE — The Developer Issue";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#7a0e12",
          padding: "56px 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#f4f1ea",
            fontSize: 22,
            letterSpacing: 8,
          }}
        >
          <span>THE DEVELOPER ISSUE</span>
          <span>№ 001</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 150,
              fontWeight: 900,
              color: "#0a0a09",
              letterSpacing: -4,
              lineHeight: 0.9,
            }}
          >
            ADITYA
          </div>
          <div
            style={{
              fontSize: 150,
              fontWeight: 900,
              color: "#f4f1ea",
              letterSpacing: -4,
              lineHeight: 0.9,
            }}
          >
            RATHORE
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "4px solid #0a0a09",
            paddingTop: 24,
            color: "#0a0a09",
            fontSize: 26,
            letterSpacing: 4,
          }}
        >
          <span>FULL STACK</span>
          <span>WEB3</span>
          <span>DEVOPS</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
