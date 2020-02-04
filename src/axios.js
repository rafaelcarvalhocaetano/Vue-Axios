import axios from 'axios';
import env from './env/env';

/** --- tanto uma quanto outra funcionam perfeitamente --- **/

// axios.defaults.baseURL = env.apiURL;
// export default axios;

// export default axios.create({
//     baseURL: env.apiURL
// });


const instance = axios.create({});

instance.defaults.baseURL = env.apiURL;

// interceptador
instance.interceptors.request.use(config => {
    console.log(' interceptando request', config);
    config.data = {
        ...config.data,
        curso: 'Vue'
    };

    // enviando para Geral
    config.headers.common['Authorization'] = `Bearer ${window.localStorage.data}`;
    // expecífica
    config.headers.put['Meu-Cabecalho'] = 'Vue';

    return config;
    // return Promise((resolve, reject) => {
    //     // espera
    // });
}, e => {
    console.log(' erro na request ');
});

// instance.interceptors.response.use(resp => {
//     if (Array.isArray(resp.data)) {
//         // resp.data = resp.data.slice(1, 3);
//     }
//     return resp;
// }, e => {
//     console.log(' erro na resposta');
//     return Promise.reject(e);
// });

export default instance;