import { useEffect, useState } from "react";
import ClipboardJS from "clipboard";
import { shortenURL } from "./lib";
import urlPattern from "./regexPattern";
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

  /**
   * Store items in the local storage when the short url is generated
   *
   * If we want use localStorage as cache, we can use an object instead of  a string i.e.
   * { key1: value1, key2: value2, key3: value3 }, therefore, before making the API call
   * we can check if the key [ longurl ] exists in our cache [ localStorage ] and return it,
   * otherwise, fetch the value [shortUrl ] from the bitly
   *
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
  }, []);

  const handleChange = (e) => setlongurl(e.target.value);

  /** If input validation is successful, a truthy value is returned,
   * otherwise an error is thrown
   *
   * @josiah-review
   *  - Please use custom hooks to abstract this code, this can be easily hard
   *  to follow if we add more code
   *  - I am renaming some of variables in this function to self-document
   */
  const validateUrl = (val) =>
    urlPattern.test(val)
      ? setErrorMessage("")
      : setErrorMessage("Url entered is invalid");

  //function to handle short link generation upon submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    /**
     * @josiah-review
     * This is redundant, validateUrl is checking for empty string as well
     */

    /**
     * I checked the docs https://dev.bitly.com/api-reference/#createBitlink the rate limit can be captured using status 429
     * check the screenshot on feedback.md file
     * This approach will prevent the extra API call to check the limit
     */

    if (validateUrl(longurl)) {
      try {
        const { link } = await shortenURL(longurl);
        setShortUrl(link);
        seturlLongLocal(longurl);
      } catch (error) {
        // we can capture all the error messages here
        setErrorMessage(error.message);
      }
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
