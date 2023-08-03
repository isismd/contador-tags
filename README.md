# Contador de Tags

## 🚀 Sobre
Esse projeto foi criado como solução para o teste prático. 

### Descrição do problema
Criar um programa para identificar as tags HTML existentes nas páginas que forem carregadas por meio de uma lista de URL informada. Além disso, deve ser contado quantas vezes cada tag aparece em cada página.

É necessário mostrar as informações coletadas para possibilitar verificar os dados da URL informada. Assim, as URL, tags e as respectivas contagens devem ser armazenadas em um banco de dados.

### Solução
Para solucionar o problema proposto foram divididas as etapas por partes: 
- Processar a URL inserida e contar as tags:

Para processar a URL foi usada a requisição `fetch()` que retorna uma resposta, que depois é convertida para texto. Em seguida, foi utilizado o `DOMParser` para analisar o conteúdo HTML e logo após o método `querySelectorAll('*')` para selecionar todos os elementos. Através de um laço `forEach()` é contado quantas vezes cada tag HTML aparece no documento.

- Armazenar os dados em um banco:

A fim de realizar esse armazenamento foi escolhido o indexedDB como banco de dados, nele foram registradas a url inserida, os nomes das tags e suas respectivas contagens. Para cada url digitada, é criado um novo objeto `.objectStore('tags_html')` com as informações necessárias.

> Esse banco pode ser consultado através da aba 'Aplicações' no Inspecionar Elemento do site. Nessa aba constará uma seção IndexedDB, clicando nela aparecerá o banco 'tags_html' que está armazenando todas as URLs digitadas. 


- Consultar o banco de dados para visualizar as informações na tela:

Com o objetivo de realizar essa consulta, foi utilizado a função `.openCursor(IDBKeyRange.only(URL))` que abre um cursor para percorrer todos os objetos do banco e encontrar o objeto que possui a exata URL informada. Quando é encontrado, os dados desse objetos são passados para uma função `inserirNaTabela()` que, através de um loop, cria linhas na tabela com os nomes e quantidades das tags da URL.

#### Adicionais

A fim de prevenir erros, a aplicação não aceita URLs inválidas e URLs cujo código possui um bloqueio de segurança e não pode ser acessado.

Essa verificação foi feita através da declaração `try... catch`, onde no `catch()` será recebido qualquer erro ou exceção e retornará uma mensagem de erro. Para a validação de URLs utilizou-se uma função onde uma string é passada para o construtor `new URL()` que retornará uma URL caso a string seja válida.


## 🔭 Pré-visualização

<img src="src/images/img_tela.png" alt="Tela do Site">

> URL do site: https://contador-tags.vercel.app

## 👩🏻‍💻 Construído com:
- HTML
- CSS
- JavaScript

## 🔍 Sites para testar
Alguns sites não permitem que o código seja acessado para requisições, então não é possível realizar a contagem das tags. Para testar foram usados sites que permitem esse acesso, como por exemplo:
- https://sistemas.ufmt.br/ufmt.portalsistemas
- https://jsonplaceholder.typicode.com
- https://www.jsonplaceholder.org
- https://isismd.github.io/sunnyside-agency-landing-page/
- https://isismd.github.io/get-coffee/
