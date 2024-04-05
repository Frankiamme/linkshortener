import { string } from "Yup";
import pattern from "./regexPattern";

/* 
Yup has been used for url checking.
The input is tested for validity using a regex decalred in regexPattern.js and 
a custom message returned incase of errors
*/
const URLvalidator = string()
  .required("Enter a URL to shorten")
  .matches(pattern, "The url is invalid. Try again");
  
export default URLvalidator;
