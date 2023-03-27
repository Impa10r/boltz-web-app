import QRCode from "qrcode";
import { setNotification, setNotificationType } from "./signals";
import { api_url } from "./config";

export const btc_divider = 100000000;

export const startInterval = (cb, interval) => {
  cb();
  return setInterval(cb, interval);
};


export const clipboard = (text, message) => {
  navigator.clipboard.writeText(text);
  setNotificationType("success")
  setNotification(message);
};


export const focus = () => {
  document.getElementById("sendAmount").focus();
};

export const fetcher = (url, cb, params = null) => {
  let opts = {};
  if (params) {
    params.referralId = "dni";
    opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    };
  }
  fetch(api_url + url, opts)
    .then((response) => {
      if (!response.ok) {
          return Promise.reject(response);
      }
      return response.json();
    })
    .then(cb)
    .catch((error) => {
        setNotificationType("error")
        if (typeof error.json === "function") {
            error.json().then(jsonError => {
                setNotification(jsonError.error);
            }).catch(genericError => {
                setNotification(error.statusText);
            });
        } else {
            setNotification(error.message);
        }
    });
};

export const downloadRefundFile = (swap) => {
  let json = {
    id: swap.id,
    currency: "BTC",
    redeemScript: swap.redeemScript,
    privateKey: swap.privateKey,
    timeoutBlockHeight: swap.timeoutBlockHeight,
  };
  let hiddenElement = document.createElement("a");
  hiddenElement.href =
    "data:application/json;charset=utf-8," + encodeURI(JSON.stringify(json));
  hiddenElement.target = "_blank";
  hiddenElement.download = "boltz-refund-" + swap.id + ".json";
  hiddenElement.click();
};

export const qr = (data, cb) => {
  if (!data) return cb(null);
  QRCode.toDataURL(data, { version: 13, width: 400 })
    .then(cb)
    .catch((err) => {
        console.error("qr code generation error", err);
        setNotificationType("error")
        setNotification(err.message);
    });
};

export async function detectWebLNProvider(timeoutParam) {
  const timeout = timeoutParam ?? 3000;
  const interval = 100;
  let handled = false;

  return new Promise((resolve) => {
    if (window.webln) {
      handleWebLN();
    } else {
      document.addEventListener("webln:ready", handleWebLN, { once: true });

      let i = 0;
      const checkInterval = setInterval(function() {
        if (window.webln || i >= timeout/interval) {
          handleWebLN();
          clearInterval(checkInterval);
        }
        i++;
      }, interval);
    }

    function handleWebLN() {
      if (handled) {
        return;
      }
      handled = true;

      document.removeEventListener("webln:ready", handleWebLN);

      if (window.webln) {
        resolve(window.webln);
      } else {
        resolve(null);
      }
    }
  });
};


export default fetcher;