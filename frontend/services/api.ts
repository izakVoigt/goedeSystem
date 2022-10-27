import axios from "axios";
import axiosConfig from "../config/axios";

export const api = axios.create(axiosConfig);
