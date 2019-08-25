<template>
  <div id="app">
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-4">Requisições HTTP com AXIOS</h1>
        <p class="lead">Usando bibliotéca Axios para fazer chamadas Ajax à uma API REST.</p>
      </div>
    </div>
    <div class="container">
      <TarefasLista />

      <button class="btn btn-primary mt-4 mb-2" @click="downloader">Baixar Imagem</button>
      <div class="progress">
        <div 
          class="progress-bar"
          role="progressbar"
          :style="{ width: progresso + '%'}"
          aria-valuenow="progresso"
          aria-valuemin="0"
          aria-valuemax="100">
          {{ progresso }} %
        </div>
      </div>

      <div class="mb-5" v-if="img">
        <img :src="img" alt="img" style="max-width: 100%">
      </div>

    </div>
  </div>
</template>

<script>

import axios from 'axios';
import env from './env/env';

import TarefasLista from './components/TarefasLista';

export default {
  components: {
    TarefasLista
  },
  data() {
    return {
      progresso: 0,
      img: undefined
    }
  },
  // async created() {
  //   // axios.all([
  //   //   axios.get(`${env.apiURL}/tarefas/1`),
  //   //   axios.get(`${env.apiURL}/tarefas/2`)
  //   // ]).then(axios.spread((t1, t2) => {
  //   //   console.log(' request simultanea');
  //   //   console.log(' request t1 : ', t1);
  //   //   console.log(' request t2 : ', t2);
  //   // })).catch(e => console.log(' data erro ', e));

  //  axios.all([
  //     axios.get(`${env.apiURL}/tarefas/1`),
  //     axios.get(`${env.apiURL}/tarefas/3`)
  //   ]).then(response => {
  //     // desestruturação
  //     const [t1, t3] = response;
  //     console.log(' request t1 : ', t1);
  //     console.log(' request t2 : ', t2);
  //   });

  //   // const t1 = await axios.get(`${env.apiURL}/tarefas/1`);
  //   // const t1 = await axios.get(`${env.apiURL}/tarefas/3`);

  // },
  methods: {
    downloader(event) {
      axios.get(
        'https://img.ibxk.com.br/2018/02/15/15150719526284.jpg?w=1120&h=420&mode=crop&scale=both',
        {
          responseType: 'blob',
          onDownloadProgress: (pge) => {
            console.log(' downloader ', pge);
            this.progresso = (pge.loaded / pge.total * 100).toFixed(0);
          }
        }
      ).then(response => {
        console.log( response);

        // convertende tudo para base64
        const reader = new window.FileReader();
        reader.readAsDataURL(response.data);
        reader.onload = () => {
          this.img = reader.result;
        }
      })
    }
  }
}
</script>