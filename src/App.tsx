import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

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

  const [encryption, setEncryption] = useState<Encryption | undefined>(
    undefined,
  );
  const [hidden, setHidden] = useState<boolean>(false);
  const [ssid, setSSID] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (
      typeof encryption !== "undefined" &&
      typeof ssid !== "undefined" &&
      typeof password !== "undefined"
    ) {
      QRCode.toCanvas(
        canvasRef.current,
        generateDecodedQRCodeStringForWiFi({
          encryption,
          ssid,
          password,
          hidden,
        }),
        (error) => {
          if (error) console.error(error);
          console.log("success!");
        },
      );
    }
  }, [encryption, hidden, password, ssid]);

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
          if (encryptionInputEl !== null) {
            setEncryption(encryptionInputEl.value as Encryption);
          }
          if (hiddenInputEl !== null) {
            setHidden(hiddenInputEl.checked);
          }
          if (ssidInputEl !== null) {
            setSSID(ssidInputEl.value);
          }
          if (passwordInputEl !== null) {
            setPassword(passwordInputEl.value);
          }
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
                <input name="hidden" type="checkbox" />
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
                <button type="submit">Generate code</button>
              </td>
              <td>
                <button
                  onClick={() => {
                    setSSID(undefined);
                    setPassword(undefined);
                    setEncryption(undefined);
                    setHidden(false);
                    if (ssidInputRef.current) {
                      ssidInputRef.current.value = "";
                    }
                    if (passwordInputRef.current) {
                      passwordInputRef.current.value = "";
                    }
                    if (encryptionInputRef.current) {
                      encryptionInputRef.current.value = "" as Encryption;
                    }
                    if (hiddenInputRef.current) {
                      hiddenInputRef.current.checked = false;
                    }
                  }}
                  type="button"
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
      {typeof ssid !== "undefined" && typeof password !== "undefined" ? (
        <canvas ref={canvasRef}></canvas>
      ) : (
        <div>No fields yet</div>
      )}
    </div>
  );
}

export default App;
