import { useEffect, useState } from "react";
import ClipboardJS from "clipboard";
import * as Yup from "Yup";
import processURL from "./lib";
import "./App.css";

new ClipboardJS(".btn");

const group_guid = import.meta.env.VITE_BITLY_GUID;
const domain = import.meta.env.VITE_BITLY_DOMAIN;

let pattern =
  /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/;

const urlSchema = Yup.string()
  .required("Enter a URL to shorten")
  .matches(pattern, "The url is invalid. Add http protocol if missing");

function App() {
  const [longurl, setlongurl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const params = {
    group_guid,
    domain,
    long_url: longurl,
  };

  const handleChange = (e) => {
    setlongurl(e.target.value);
  };

  const validateEntry = async (val) => {
    try {
      await urlSchema.validate(val);
      setErrorMessage("");
      return true;
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validated = await validateEntry(longurl);
    console.log(params);
    if (validated) {
      const { link } = await processURL(params);
      setShortUrl(link);
    }
  };

  return (
    <>
      <h1>URL Shortener</h1>
      <div className="card">
        <div className="form">
          <input
            value={longurl}
            onChange={handleChange}
            className="input"
            name="url"
          />
          {errorMessage && <p style={{ color: "#ff480c" }}>{errorMessage}</p>}
          <button style={{borderRadius: 8}} type="submit" onClick={handleSubmit}>
            Shorten
          </button>
        </div>
      </div>
      <div className="card">
        <p className="read-the-docs">Your Shortened URL is:</p>
        {shortUrl && (
          <input readOnly="true" value={shortUrl} className="input" />
        )}
        {shortUrl?.length > 0 ? (
          <button className="btn" data-clipboard-text={shortUrl}>
            Copy
          </button>
        ) : null}
      </div>
    </>
  );
}

export default App;
