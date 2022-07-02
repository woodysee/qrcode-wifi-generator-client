import QRCode from "qrcode";
import { useRef, useState } from "react";

import styles from "./App.module.scss";

enum Encryption {
  None = "nopass",
  WPA = "WPA",
  WEP = "WEP",
}

const generateDecodedQRCodeStringForWiFi = (options: {
  encryption: Encryption;
  ssid: string;
  password: string;
  hidden: boolean;
}) => {
  return `WIFI:T:${options.encryption};S:${options.ssid};P:${
    options.password
  };H:${options.hidden ? "true" : ""};`;
};

function App() {
  const canvasRef = useRef(null);
  const ssidInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const encryptionInputRef = useRef<HTMLSelectElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const scaleInputRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(5);

  return (
    <div className={styles.app}>
      <h1>Generate your own QR code to add WiFi!</h1>
      <form
        onSubmit={(formEvent) => {
          formEvent.preventDefault();
          const encryptionInputEl = encryptionInputRef.current;
          const ssidInputEl = ssidInputRef.current;
          const passwordInputEl = passwordInputRef.current;
          const hiddenInputEl = hiddenInputRef.current;
          const scaleInputEl = scaleInputRef.current;
          const a = {
            encryption: encryptionInputEl?.value as Encryption,
            ssid: ssidInputEl?.value,
            password: passwordInputEl?.value,
            hidden: hiddenInputEl?.checked,
          };
          console.log(a);

          if (
            encryptionInputEl == null ||
            hiddenInputEl === null ||
            ssidInputEl === null ||
            passwordInputEl === null ||
            scaleInputEl === null
          ) {
            return;
          }
          setSubmitted(true);
          QRCode.toCanvas(
            canvasRef.current,
            generateDecodedQRCodeStringForWiFi({
              encryption: encryptionInputEl.value as Encryption,
              ssid: ssidInputEl.value,
              password: passwordInputEl.value,
              hidden: hiddenInputEl.checked,
            }),
            {
              scale: parseInt(scaleInputEl.value),
            },
          );
        }}
      >
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="ssid">SSID</label>
              </td>
              <td>
                <input
                  name="ssid"
                  type="text"
                  placeholder=""
                  ref={ssidInputRef}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="password">Wi-Fi Password</label>
              </td>
              <td>
                <input name="password" type="password" ref={passwordInputRef} />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="hidden">Hidden?</label>
              </td>
              <td>
                <input name="hidden" type="checkbox" ref={hiddenInputRef} />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="encryption">Encryption</label>
              </td>
              <td>
                <select name="encryption" ref={encryptionInputRef}>
                  <option value={Encryption.None}>None</option>
                  <option value={Encryption.WPA}>WPA2/WPA3</option>
                  <option value={Encryption.WEP}>WEP</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="scale">Scale (1 - 20)</label>
              </td>
              <td>
                <input
                  ref={scaleInputRef}
                  type="range"
                  min="1"
                  max="20"
                  name="scale"
                  onChange={(e) => {
                    setScale(parseInt(e.target.value));
                  }}
                  defaultValue={scale}
                />
                <input readOnly name="scale" value={scale} />
              </td>
            </tr>
            <tr>
              <td>
                <button type="submit">Generate code</button>
              </td>
              <td>
                <button
                  type="reset"
                  onClick={() => {
                    setSubmitted(false);
                  }}
                >
                  Clear code
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <br />
      <hr />
      <br />
      <div style={{ display: submitted ? "block" : "none" }}>
        <canvas ref={canvasRef} />
      </div>
      {!submitted && <div>No fields yet</div>}
    </div>
  );
}

export default App;
