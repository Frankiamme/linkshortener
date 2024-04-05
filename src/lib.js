import axios from "axios";
const token = import.meta.env.VITE_BITLY_TOKEN;
const biturl = import.meta.env.VITE_BITLY_URL;
const group_guid = import.meta.env.VITE_BITLY_GUID;
const domain = import.meta.env.VITE_BITLY_DOMAIN;

const processURL = async (longurl) => {

const params = {
  group_guid,
  domain,
  long_url: longurl,
};
    
  try {
    const { data } = await axios.post(biturl, params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return error.message;
  }
};

export default processURL;
