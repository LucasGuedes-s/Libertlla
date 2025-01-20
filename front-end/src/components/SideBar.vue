<template>
    <div class="sidebar">
        <img src="../assets/imagem_sidebar.png" alt="Logo">
        <a href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path
                fill="#fff" d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6z" />
            </svg>
            Dashboard
        </a>
        <a href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 1024 1024"><path fill="#fff" d="M512 244c176.18 0 319 142.82 319 319v233a32 32 0 0 1-32 32H225a32 32 0 0 1-32-32V563c0-176.18 142.82-319 319-319M484 68h56a8 8 0 0 1 8 8v96a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8V76a8 8 0 0 1 8-8M177.25 191.66a8 8 0 0 1 11.32 0l67.88 67.88a8 8 0 0 1 0 11.31l-39.6 39.6a8 8 0 0 1-11.31 0l-67.88-67.88a8 8 0 0 1 0-11.31l39.6-39.6zm669.6 0l39.6 39.6a8 8 0 0 1 0 11.3l-67.88 67.9a8 8 0 0 1-11.32 0l-39.6-39.6a8 8 0 0 1 0-11.32l67.89-67.88a8 8 0 0 1 11.31 0M192 892h640a32 32 0 0 1 32 32v24a8 8 0 0 1-8 8H168a8 8 0 0 1-8-8v-24a32 32 0 0 1 32-32m148-317v253h64V575z"/></svg>
            Ocorrências
        </a>
        <a href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
          <path
            d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
        </svg>
            Profissionais
        </a>
        <a href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="#fff"><rect width="5" height="18" x="16" y="3" rx="2"/><rect width="5" height="12" x="9.5" y="9" rx="2"/><rect width="5" height="5" x="3" y="16" rx="2"/></g></svg>
            Relatórios
        </a>
        <button class="logout-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-coin" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
              <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
            </svg>
            Sair
        </button>
    </div>
</template>

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
    background-color: #5C164E;
    padding-top: 20px;
    text-align: center;
    box-shadow: 0 4px 10px -1px rgba(0, 0, 0, 0.10);
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
    /* Ajusta o espaço entre o ícone e o texto */
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
    /* Alinhamento com flexbox */
    align-items: center;
    /* Alinha verticalmente */
    background-color: transparent;
    /* Sem fundo */
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
</style>

<script>
export default {
  name: "SideBar",
};
</script>