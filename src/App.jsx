import { useEffect, useState } from "react";
import ClipboardJS from "clipboard";
import { getLimit, shortenURL } from "./lib";
import pattern from "./regexPattern";
import "./App.css";

/* 
initialize a new clipboard instance.
This will be used for the copy button after shortened link has been generated
*/
new ClipboardJS(".btn");

function App() {
  const [longurl, setlongurl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urlLongLocal, seturlLongLocal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [ApiLimit, setApiLimit] = useState(0);

  /*
  Store items in the local storage when the short url is generated
  */
  useEffect(() => {
    localStorage.setItem("shortURL", JSON.stringify(shortUrl));
    localStorage.setItem("longURL", JSON.stringify(longurl));
  }, [shortUrl]);
  /*

  Fetch items from the local storage and display results on page load
  */
  useEffect(() => {
    const resultshortURL = JSON.parse(localStorage.getItem("shortURL"));
    const resultlongURL = JSON.parse(localStorage.getItem("longURL"));
    if (resultshortURL && resultlongURL) {
      setShortUrl(resultshortURL);
      seturlLongLocal(resultlongURL);
    }
    checklimit();
  }, []);

  const handleChange = (e) => {
    setlongurl(e.target.value);
  };

  const checklimit = async () => {
    const limit = await getLimit();
    setApiLimit(limit);
  }; 

  /* If input validation is successful, a truthy value is returned, 
  otherwise an error is thrown 
  */
  const validateEntry = (val) => {
    if (pattern.test(val) === true) {
      setErrorMessage("")
      return true
    } else {
      setErrorMessage("Url entered is invalid")
      return false
    }
  };

  //function to handle short link generation upon submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (longurl.length < 1) {
      setErrorMessage("The URL is a required field")
      return;
    }
    if (ApiLimit < 1) {
      setErrorMessage("Requests limit exceeded, shortener will not work :(")
      return;
    }
    const validated = validateEntry(longurl);
    if (validated) {
      const { link } = await shortenURL(longurl);
      setShortUrl(link);
      seturlLongLocal(longurl);
    }
  };

  return (
    <>
      <h1>{`URL Shortener`}</h1>
      <p className="read-the-docs">
        {`URL should have http or https protocol to be valid`}
      </p>
      <div className="card">
        <div className="form">
          <input
            required={true}
            value={longurl}
            onChange={handleChange}
            className="input"
            name="url"
          />
          {errorMessage && <p style={{ color: "#ff480c" }}>{errorMessage}</p>}
          <button
            style={{ borderRadius: 8 }}
            type="submit"
            onClick={handleSubmit}
          >
            {`Shorten`}
          </button>
        </div>
      </div>
      <div className="card">
        {shortUrl && (
          <>
            <p className="read-the-docs">{`Your Shortened URL for ${urlLongLocal} is:`}</p>
            <div>
              <input readOnly={true} value={shortUrl} className="input" />
              <button className="btn" data-clipboard-text={shortUrl}>
                {`Copy`}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
