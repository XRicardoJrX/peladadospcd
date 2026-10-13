// admin.js

let dados = {
    jogadores: [],
    partidas: []
};

document.addEventListener("DOMContentLoaded", () => {
    carregarDadosLocais();
});

function carregarDadosLocais() {
    const dadosSalvos = localStorage.getItem('estatisticas_futebol');
    if (dadosSalvos) {
        dados = JSON.parse(dadosSalvos);
    }
    atualizarTabelaJogadores();
    atualizarTabelaDesempenho();
}

function salvarDadosLocais() {
    localStorage.setItem('estatisticas_futebol', JSON.stringify(dados));
}

function adicionarJogador() {
    const nome = document.getElementById('nomeJogador').value.trim();
    const isGoleiro = document.getElementById('isGoleiro').checked;

    if (!nome) {
        alert("O nome do jogador é obrigatório.");
        return;
    }

    const novoId = dados.jogadores.length > 0 ? Math.max(...dados.jogadores.map(j => j.id)) + 1 : 1;
    
    dados.jogadores.push({
        id: novoId,
        nome: nome,
        goleiro: isGoleiro
    });

    document.getElementById('nomeJogador').value = '';
    document.getElementById('isGoleiro').checked = false;

    salvarDadosLocais();
    atualizarTabelaJogadores();
    atualizarTabelaDesempenho();
}

function removerJogador(id) {
    dados.jogadores = dados.jogadores.filter(j => j.id !== id);
    salvarDadosLocais();
    atualizarTabelaJogadores();
    atualizarTabelaDesempenho();
}

function atualizarTabelaJogadores() {
    const tbody = document.querySelector("#tabelaJogadores tbody");
    tbody.innerHTML = "";

    dados.jogadores.forEach(jogador => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${jogador.id}</td>
            <td>${jogador.nome}</td>
            <td>${jogador.goleiro ? 'Goleiro' : 'Linha'}</td>
            <td><button class="btn-danger" onclick="removerJogador(${jogador.id})">Remover</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarTabelaDesempenho() {
    const tbody = document.querySelector("#tabelaDesempenho tbody");
    tbody.innerHTML = "";

    dados.jogadores.forEach(jogador => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${jogador.nome}</td>
            <td><input type="number" id="gol_${jogador.id}" value="0" min="0"></td>
            <td><input type="number" id="assist_${jogador.id}" value="0" min="0"></td>
            <td><input type="number" id="defesa_${jogador.id}" value="0" min="0" ${!jogador.goleiro ? 'disabled' : ''}></td>
            <td><input type="number" id="nota_${jogador.id}" value="0" step="0.5" min="0" max="10"></td>
        `;
        tbody.appendChild(tr);
    });
}

function salvarPartida() {
    const dataPartida = document.getElementById('dataPartida').value;
    if (!dataPartida) {
        alert("A definição da data da partida é obrigatória.");
        return;
    }

    const desempenho = [];

    dados.jogadores.forEach(jogador => {
        const gols = parseInt(document.getElementById(`gol_${jogador.id}`).value) || 0;
        const assistencias = parseInt(document.getElementById(`assist_${jogador.id}`).value) || 0;
        const defesas = parseInt(document.getElementById(`defesa_${jogador.id}`).value) || 0;
        const nota = parseFloat(document.getElementById(`nota_${jogador.id}`).value) || 0;

        if (gols > 0 || assistencias > 0 || defesas > 0 || nota > 0) {
            desempenho.push({
                id_jogador: jogador.id,
                gols: gols,
                assistencias: assistencias,
                defesas: defesas,
                nota: nota
            });
        }
    });

    dados.partidas.push({
        data: dataPartida,
        desempenho: desempenho
    });

    salvarDadosLocais();
    alert("Dados da partida armazenados com sucesso.");
    atualizarTabelaDesempenho(); 
}

function exportarJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dados, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dados.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function limparDadosLocais() {
    if (confirm("Aviso: Esta operação removerá todos os dados do LocalStorage. Prossiga apenas se o arquivo dados.json já houver sido exportado. Confirmar?")) {
        localStorage.removeItem('estatisticas_futebol');
        dados = { jogadores: [], partidas: [] };
        atualizarTabelaJogadores();
        atualizarTabelaDesempenho();
    }
}
