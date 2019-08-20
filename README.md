# gostack-desafio-01

[Primeiro desafio](https://github.com/Rocketseat/bootcamp-gostack-desafio-01/blob/master/README.md#desafio-01-conceitos-do-nodejs) do Bootcamp 2019 da Rockeseat

**Diversos aprimoramentos foram realizados**

 - Atribuição automática do ID ao projeto sem a necessidade de passar o parâmetro no body da requisição.
 - Middlewares de verificação e validação de títulos e tarefas.
	 - Título é obrigatório.
	 - Impossibilidade de salvar projetos com títulos repetidos.
	 - Impossibilidade de salvar tarefas em array se este não for validado.
 - Possibilidade de adicionar tarefas na requisição de salvamento do projeto.
 - Possibilidade de adicionar/editar tarefas de forma individual como uma `string` ou um `array` de tarefas.