document.getElementById("pegarUrl").addEventListener("click", processarUrl, false);

// Função principal de processamento de URL, onde são chamadas as outras funções
async function processarUrl() {
    document.getElementById('tabela').classList.add('invisivel');
    document.getElementById('erro').innerHTML = '';

    try {
        const url = await pegarUrl();
        const conteudoHtml = await carregarConteudo(url);

        const contagemTag = await contarTags(conteudoHtml);
        await armazenarDados(url, contagemTag);
        await consultarDados(url);
    } catch (erro) {
        document.getElementById('erro').innerHTML = 'Erro: Não foi possível acessar essa URL. Tente inserir outro link.';
    }

}

// Função para pegar a URL digitada pelo usuário
async function pegarUrl() {
    const url = document.getElementById('urlInput').value.trim()
    
    if (!validandoUrl(url)) {
        throw new Error('URL inválida: ' + url);
    }

    return url;
}

// Função para carregar o conteudo da URL
async function carregarConteudo(url) {
    const resposta = await fetch(url);
    return await resposta.text();
}

// Realizando a contagem das Tags da URL digitada
async function contarTags(conteudoHtml) {
    const contagemTag = {};

    const parser = new DOMParser();
    const doc = parser.parseFromString(conteudoHtml, 'text/html');

    doc.querySelectorAll('*').forEach((elemento) => {
        const nomeTag = elemento.tagName.toLowerCase();
        contagemTag[nomeTag] = (contagemTag[nomeTag] || 0) + 1;
    });
    return contagemTag;
}

// Armazenando os dados (URL, Tags e quantidades) através da API de banco de dados IndexedDB
async function armazenarDados(url, contagemTag) {
    const request = indexedDB.open('banco_tags', 1);

    request.onupgradeneeded = function (event) {
        const bancoTags = event.target.result;
        bancoTags.createObjectStore('tags_html', {
            keyPath: 'url'
        });
    };

    request.onsuccess = function (event) {
        const bancoTags = event.target.result;
        const transacao = bancoTags.transaction(['tags_html'], 'readwrite');
        const objeto = transacao.objectStore('tags_html');

        const arrayTags = Object.entries(contagemTag).map(([tag, quantidade]) => ({
            tag,
            quantidade
        }));

        objeto.put({
            url,
            tags: arrayTags
        });
    };
}

//Consultando e obtendo os dados armazenados no banco de dados
async function consultarDados(url) {
    const request = indexedDB.open('banco_tags', 1);

    return new Promise((resolve) => {
        request.onsuccess = function (event) {
            const bancoTags = event.target.result;

            const transacao = bancoTags.transaction(['tags_html'], 'readonly');
            const objeto = transacao.objectStore('tags_html');

            const getRequest = objeto.openCursor(IDBKeyRange.only(url));

            getRequest.onsuccess = function (event) {
                const cursor = event.target.result;
                const dados = cursor.value;
                inserirNaTabela(dados);
                resolve(dados)
            };
        };
    });
}

// Inserindo os dados na tabela
function inserirNaTabela(dados) {
    var tabela = document.getElementById('tabela');
    var tbody = tabela.querySelector('tbody');

    tbody.innerHTML = '';

    dados.tags.forEach(function (tags) {
        var tr = document.createElement('tr');
        var tag = document.createElement('td');
        var quantidade = document.createElement('td');

        tag.textContent = tags.tag;
        quantidade.textContent = tags.quantidade;

        tr.appendChild(tag);
        tr.appendChild(quantidade);
        tbody.appendChild(tr);
    });

    tabela.className = tabela.className.replace('invisivel', '');

}

// Função para conferir se a URL digitada é valida
function validandoUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (erro) {
        return false;
    }
}
