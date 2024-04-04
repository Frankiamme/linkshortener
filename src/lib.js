import axios from "axios";

const token = import.meta.env.VITE_BITLY_TOKEN;
const biturl = import.meta.env.VITE_BITLY_URL;

const processURL = async (params) => {
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
