<template>
    <div>
        <div class="row mb-3">
            <div class="col-sm-10">
                <h4 class="font-weight-light">Lista de Tarefas</h4>
            </div>
            <div class="col-sm-2">
                <button 
                    class="btn btn-primary float-right"
                    @click="showForm">
                    <i class="fa fa-plus mr-2"></i>
                    <span>Criar</span>
                </button>
            </div>
        </div>
        <ul class="list-group" v-if="tarefasOrdenadas.length > 0">
            <TarefasListaIten
                v-for="tarefa in tarefasOrdenadas"
                :key="tarefa.id"
                :tarefa="tarefa"
                @editar="selecionarTarefaEdicao"
                @deletar="deletarTarefa"
                @concluir="editarTarefa" />
        </ul>
        <p v-else-if="!mensagemErro">Nenhuma tarefa criada.</p>
        <div class="alert alert-danger" v-else>{{ mensagemErro }}</div>

        <TarefaSalvar 
            v-if="exibirFormulario"
            @criar="criarTarefa"
            @editar="editarTarefa"
            :tarefa="tarefaSelecionada"/>

    </div>
</template>

<script>

import TarefaSalvar from './TarefaSalvar.vue'
import TarefasListaIten from './TarefasListaIten.vue'

// import env from './../env/env';
// import axios from 'axios';
import axios from './../axios';


export default {
    components: {
        TarefaSalvar,
        TarefasListaIten
    },
    data() {
        return {
            tarefas: [],
            exibirFormulario: false,
            tarefaSelecionada: undefined,
            mensagemErro: undefined
        }
    },
    created() {
        // ${env.apiURL} - remvida deantes da barra
        axios.get(`tarefas`).then((response) => {
            console.log(' GET :::: ', response.data);
            this.tarefas = response.data;
        }
        // , e => {
        //     if (e.response) {
        //         this.mensagemErro = `Erro do servidor ${e.message} - ${e.response.status}`;
        //     } else if (e.request) {
        //         this.mensagemErro = `Erro ao tentar se comunicar com o servidor: ${e.message} - ${e.response.status}`;                
        //     }
        //     return Promise.reject(e);
        // }
        ).catch(e => {
            if (e.response) {
                this.mensagemErro = `Erro do servidor ${e.message} - ${e.response.status}`;
            } else if (e.request) {
                this.mensagemErro = `Erro ao tentar se comunicar com o servidor: ${e.message} - ${e.response.status}`;                
            } else {
                this.mensagemErro = `Erro ao tentar se comunicar...`;
            }
        })
    },
    computed: {
        tarefasOrdenadas() {
            return this.tarefas.sort((t1, t2) => {
                if (t1.concluido === t2.concluido) {
                    return (t1.titulo < t2.titulo) 
                            ? -1 : (t1.titulo > t2.titulo ? 1 : 0)
                }
                return t1.concluido - t2.concluido;
            });
        }
    },
    methods: {
        criarTarefa(tarefa) {
            // axios.post(`${env.apiURL}/tarefas`, tarefa).then((response) => {
            //     console.log(' POST :::: ', response.data);
            //     this.tarefas.push(response.data);
            //     this.resetar();
            // });

            axios.request({
                method: 'post',
                baseURL: env.apiURL, 
                url: '/tarefas',
                data: tarefa
            }).then((response) => {
                console.log(' POST :::: ', response.data);
                this.tarefas.push(response.data);
                this.resetar();
            });
        },
        selecionarTarefaEdicao(tarefa) {
            this.tarefaSelecionada = tarefa;
            this.exibirFormulario = true;
        },
        editarTarefa(tar) {
            console.log('PUT ::: ', tar);   
            axios.put(`/tarefas/${tar.id}`, tar).then((response) => {
                console.log(' PUT :::: ', response.data);
                // this.tarefas.push(response);
                const indice = this.tarefas.findIndex(x => x.id === tar.id);
                this.tarefas.splice(indice, 1, tar);
                this.resetar();
            });         
        },
        resetar() {
            this.tarefaSelecionada = undefined;
            this.exibirFormulario = false;
        },
        async deletarTarefa(tar) {
            const confirmar = window.confirm(`Deseja deletar a Tarefa ${tar.titulo}`);
            if (confirmar) {
                // axios.delete(`/tarefas/${tar.id}`, tar).then(response => {
                //     console.log(' DELETE :::: ');
                //     const indice = this.tarefas.findIndex(x => x.id === tar.id);
                //     this.tarefas.splice(indice, 1);
                // });

                // para tratar erro usar try-catch
                try {
                    const response = await axios.delete(`/tarefas/${tar.id}`, tar);
                    const indice = this.tarefas.findIndex(x => x.id === tar.id);
                    this.tarefas.splice(indice, 1);                    
                } catch (e) {
                    console.log(' data error ', e);
                } finally {
                    console.log(' final .... ');
                }
            }
        },
        showForm(event) {
            if (this.tarefaSelecionada) {
                this.tarefaSelecionada = undefined;
                return;
            }
            this.exibirFormulario = !this.exibirFormulario;
        }
    }
}
</script>
