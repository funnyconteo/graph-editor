import axios from 'axios'
import router from '@/router/router'

const token = localStorage.getItem('id_token');

const url = 'http://10.10.0.222:';
const port = '8000';

// const url = 'http://opencode.su:';
// const port = '9031';

//for graph name
export const urlGraph = 'http://10.10.0.222:';
export const portGraph = '3030';


const ajax = () => {
  const axi = axios.create({
    baseURL: url + port,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  // if (localStorage.getItem('id_token') !== null) {
  //   axi.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  //   axi.interceptors.response.use(response => {
  //     return response
  //   }, error => {
  //     if (error.response.status === 401) {
  //       router.push({name: "signIn"})
  //     }
  //     return Promise.reject(error);
  //   })
  // }
  return axi
};

export default ajax

