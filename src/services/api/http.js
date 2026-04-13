import axios from "axios";

const http = axios.create({
  timeout: 12000,
});

export default http;
