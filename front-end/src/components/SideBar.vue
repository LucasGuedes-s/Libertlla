<template>
    <div>
        <button class="button-sidebar d-block d-md-none" :class="{ hidden: !sidebarVisible }" @click="toggleSidebar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list"
                viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
            </svg>
        </button>

        <div v-if="sidebarVisible" class="sidebar">
            <img src="../assets/imagem_sidebar.png" alt="Logo">
            <a href="/dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#fff" d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6z" />
                </svg>
                Dashboard
            </a>
            <a href="/minhasocorrencias">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor"
                    class="bi bi-folder-fill" viewBox="0 0 16 16">
                    <path
                        d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12q.322-.119.684-.12h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981z" />
                </svg>
                Ocorrências
            </a>
            <a href="/cadastrarprofissional">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                    class="bi bi-people-fill" viewBox="0 0 16 16">
                    <path
                        d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                </svg>
                Profissionais
            </a>
            <a href="/relatorios">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <g fill="#fff">
                        <rect width="5" height="18" x="16" y="3" rx="2" />
                        <rect width="5" height="12" x="9.5" y="9" rx="2" />
                        <rect width="5" height="5" x="3" y="16" rx="2" />
                    </g>
                </svg>
                Relatórios
            </a>
            <a href="/denunciasbotaodepanico">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2c-.55 0-1 .45-1 1v1.07c-2.28.46-4 2.48-4 4.93v3h10v-3c0-2.45-1.72-4.47-4-4.93V3c0-.55-.45-1-1-1zm-6 9v2H4v3h16v-3h-2v-2H6zm6 8a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2z"/>
    </svg>
                Bot. Pânico
            </a>
            <button class="logout-button" @click="logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-coin"
                    viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                    <path fill-rule="evenodd"
                        d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                </svg>
                Sair
            </button>
        </div>
    </div>
</template>
<script>
import { useAuthStore } from '@/store.js';
import router from '@/router';

export default {
    name: "SideBar",
    setup() {
        const authStore = useAuthStore();

        return { authStore }; 
    },
    data() {
        return {
            sidebarVisible: true,
            isMobile: false, 
        };
    },
    mounted() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize(); 
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        toggleSidebar() {
            if (this.isMobile) {   // Controla o estado do sidebar apenas quando o botão for clicado
                this.sidebarVisible = !this.sidebarVisible;
            } else {
                this.sidebarVisible = true; // No desktop, o sidebar permanece visível
            }
        },
        logout() {
            window.location.href = '/login';
        },
        handleResize() {
            if (window.innerWidth <= 768) {
                this.isMobile = true;
                if (!this.sidebarVisible) {
                    this.sidebarVisible = false; // Oculta o sidebar no modo responsivo se estiver fechado
                }
            } else {
                this.isMobile = false;
                this.sidebarVisible = true; // No desktop, o sidebar deve estar sempre visível
            }
        }
    },
};
</script>

<style>
body {
    margin: 0;
    font-family: 'Montserrat', sans-serif;
    background-color: white;
}

.sidebar {
    height: 100%;
    width: 250px;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #54123F;
    padding-top: 20px;
    text-align: center;
    box-shadow: 0 4px 10px -1px rgba(0, 0, 0, 0.10);
    z-index: 100;
}

.sidebar img {
    width: 170px;
    margin-top: 20px;
    margin-bottom: 30px;
    border: 1px solid #FF00AE;
}

.sidebar a {
    padding: 20px 15px;
    text-decoration: none;
    font-size: 16px;
    text-align: left;
    color: white;
    display: block;
    margin-left: 30px;
}

.sidebar a svg {
    margin-right: 6px;
    vertical-align: middle;
}

.sidebar a:hover {
    color: #FF00AE;
}

.logout-button {
    justify-content: center;
    position: absolute;
    bottom: 35px;
    font-size: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    background-color: transparent;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    width: 80%;
    text-align: center;
    font-family: 'Montserrat', sans-serif;
}

.logout-button svg {
    margin-right: 8px;
}

.logout-button:hover {
    color: #FF00AE;
}

.button-sidebar {
    position: fixed;
    top: -4px;
    left: -3px;
    font-size: 7px;
    padding: 10px 14px;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    z-index: 1000;
    cursor: pointer;
    background: transparent;
    color: rgb(240, 231, 231);
}

.button-sidebar.hidden {
    color: #9B287B;
}

@media (max-width: 768px) {
  .button-sidebar {
    top: 5px; /* Desce o botão apenas no modo mobile */
    left: -5px;
  }
}

</style>