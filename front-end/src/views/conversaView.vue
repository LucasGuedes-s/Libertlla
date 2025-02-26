<template>
    <div>
        <div class="wrapper">
            <SideBar v-if="sidebarVisible" />
            <div class="container mt-4" style="margin-left: 250px;">
                <div class="card">
                    <div class="card-header bg-light">
                        <h5 class="text-primary">Conversa</h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <label for="data" class="form-label">Data:</label>
                                <input id="data" class="form-control" :value="formatDate(conversa.createdAt)"
                                    readonly />
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-12">
                                <label for="messages" class="form-label">Mensagens:</label>
                                <textarea id="messages" class="form-control" rows="5" :value="formatarMensagens()"
                                    readonly></textarea>
                            </div>
                        </div>

                        <div class="button">
                            <button class="apertarBotao" @click="arquivarConversa">Arquivar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container mt-5">
            <h5 class="linha">Linha do tempo</h5>
            <div class="timeline">
                <div v-for="(registro, index) in conversa.registros" :key="registro.id" class="timeline-item"
                    :class="{ 'left': index % 2 === 0, 'right': index % 2 !== 0 }">
                    <div class="timeline-box">
                        <div class="card">
                            <div class="card-body">
                                <a class="card-title" :href="registro.anexos">Anexo</a>
                                <p class="card-text">{{ registro.descricoes }}</p>
                                <span class="text-muted">{{ new Date(registro.data).toLocaleString() }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="timeline-dot"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import axios from 'axios';
import { useAuthStore } from '@/store';
import { formatDate } from '@/utils/dataformatar';
import Swal from 'sweetalert2';
import router from '@/router';

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup() {
        const store = useAuthStore();
        return {
            store
        };
    },
    data() {
        return {
            formatDate,
            sidebarVisible: true,
            conversa: {
                createdAt: '',
                messages: '',
                registros: []
            }
        };
    },
    mounted() {
        console.log("Registros:", this.conversa.registros);
        this.getConversas();
    },
    methods: {
        async getConversas() {
            try {
                const user = this.store.usuario.usuario;
                const email = user.email;
                const token = this.store.token;

                const response = await axios.get(`http://localhost:3000/conversas/${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data && response.data.conversas) {
                    const conversas = response.data.conversas;
                    console.log("Todas as conversas recebidas:", conversas);

                    if (conversas.length > 0) {
                        this.conversa = conversas.find(conversa => conversa.id === this.id) || conversas[0];
                        console.log("Conversa selecionada:", this.conversa);
                        this.formatarMensagens();
                    } else {
                        console.warn('Nenhuma conversa encontrada para o usuário.');
                    }
                } else {
                    console.warn('Resposta da API não contém conversas.');
                }
            } catch (error) {
                console.error('Erro ao buscar conversas:', error);
            }
        },

        formatarMensagens() {
            if (!this.conversa || !this.conversa.messages || this.conversa.messages.length === 0) {
                return "Nenhuma mensagem disponível.";
            }
            console.log("Mensagens da conversa:", this.conversa.messages);
            return this.conversa.messages
                .map(msg => `[${new Date(msg.timestamp).toLocaleString()}] ${msg.from}: ${msg.content}`)
                .join("\n");
        },
        async arquivarConversa() {
            try {
                const token = this.store.token;
                const response = await axios.put('http://localhost:3000/conversas/arquivar', {
                    conversaId: this.conversa.id
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Conversa arquivada com sucesso!',
                    icon: 'success'
                });

                this.conversa.status = "Arquivada";

                router.push('/minhasocorrencias');
            } catch (error) {
                console.error("Erro ao arquivar conversa:", error);
                Swal.fire({
                    title: 'Erro!',
                    text: 'Não foi possível arquivar a conversa.',
                    icon: 'error'
                });
            }
        }
    },
    components: {
        SideBar
    }
};
</script>


<style scoped>
.card {
    min-height: 102%;
    height: 102%;
}

.col-md-6 {
    width: 100%;
    /* Faz a div ocupar toda a largura do container */
}

textarea.form-control {
    min-height: 130%;
    height: 130%;
    max-height: 1000px;
    /* Define um limite máximo */
    overflow-y: auto;
    /* Permite rolagem caso necessário */
}

.wrapper {
    display: flex;
    justify-content: center;
}

.container {
    width: 90%;
    max-width: 1300px;
    background: #FFFFFF;
    margin: 0 auto;
    padding: 20px;
}

.apertarBotao {
    flex: 1;
    padding: 10px 20px;
    background-color: #F5F5F5;
    border: 1px solid #D9D9D9;
    color: #7E7E7E;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    margin-top: 80px;
}

.button {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

@media (min-width: 1024px) {
    .container {
        max-width: 90%;
    }
}

.card-header {
    background: #FFFFFF !important;
    border-bottom: 1px solid #D9D9D9;
}

h5.text-primary {
    color: #9B287B !important;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 30px;
}

.form-label {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: rgba(126, 126, 126, 0.8);
}

.form-control {
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    font-size: 16px;
    color: #333;
}

textarea.form-control {
    height: 111px;
    resize: none;
}

.timeline {
    position: relative;
    max-width: 800px;
    margin: auto;
    padding: 20px 0;
}

.timeline-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-bottom: 30px;
    width: 100%;
}

.timeline-box {
    width: 48%;
    margin: 0 10px;
    box-sizing: border-box;
}

.left .timeline-box {
    order: -1;
    text-align: right;
    /* Coloca os itens à esquerda */
}

.right .timeline-box {
    order: 1;
    text-align: left;
    /* Coloca os itens à direita */
}

.timeline-item .card {
    width: 100%;
}

.timeline-item .card-body {
    padding: 10px 20px;
}

/* Adicionar margem para a linha do tempo centralizada */
.timeline::after {
    content: "";
    position: absolute;
    width: 2px;
    background: #ddd;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -1px;
}

.linha {
    color: #D9D9D9;
    display: flex;
    justify-content: center;
    padding: 15px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 30px;
}
</style>