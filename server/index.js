const express = require('express');
const server = express();
const Projects = require('../data/projects.json');

var countReq = 0;

// ############
// MIDDLEWARES
// ############

/* utilizar json no express */
server.use(express.json());

/* contagem de requisições */
server.use((req, res, next) => {
  countReq++;
  console.time('Time');
  console.log(`Request Número: ${countReq}`);
  next();
  console.timeEnd('Time');
});

/* verificar existencia de projetos */
const verifyProjects = (req, res, next) => {
  if (Array.isArray(Projects) && !Projects.length) {
    return res.json({
      message: 'Lista de projetos vazia'
    });
  }

  return next();
};

/* verifica se um projeto existe pelo ID */
const verifyProjectIDExist = (req, res, next) => {
  const { id } = req.params;
  const project = Projects.find(project => project.id === id);

  if (!project) {
    return res.status(400).json({
      message: `Projeto com 'ID' requisitado não existe`
    });
  }

  req.project = project;

  return next();
};

/* verifica se um projeto existe pelo título */
/* permite editar caso o título seja do id requisitado */
const verifyProjectTitleExist = (req, res, next) => {
  const { title } = req.body;
  const { id } = req.params;

  if (!title) {
    return res.status(400).json({
      error: `Parâmetro TITLE é obrigatório`
    });
  }

  const project = Projects.find(
    project => project.title.toLowerCase() === title.toLowerCase()
  );

  if (project && project.id !== id) {
    return res.status(400).json({
      message: `Projeto '${title}' já existe na lista`
    });
  }

  return next();
};

/* verificar se a lista de taferas requisitada é um array válido */
const verifyProjectTasksArray = (req, res, next) => {
  const { tasks } = req.body;
  const { id } = req.params;
  if (Array.isArray(tasks) && !tasks.every(task => typeof task == 'string')) {
    return res.status(400).json({
      message: `Tasks não é um array válido`
    });
  }
  if (tasks && typeof tasks == 'string' && !id) {
    req.body.tasks = [];
    req.body.tasks.push(tasks);
  }
  if (!tasks) {
    req.body.tasks = [];
  }
  return next();
};

/* verificar se título de uma task é uma string */
const verifyTaskTitle = (req, res, next) => {
  const { tasktitle } = req.body;
  if (tasktitle && typeof tasktitle == 'string') {
    return next();
  } else {
    return res.status(400).json({
      message: 'O título da task precisa ser uma string'
    });
  }
};

/* adicionar um ID automático na lista salva */
const assignProjectID = (req, res, next) => {
  const lastProjectID = Projects[Projects.length - 1].id;

  req.body.id = parseInt(lastProjectID) + 1;

  return next();
};

// ############
// ROUTES
// ############

/* listar todos os projetos */
server.get('/projects', verifyProjects, (req, res) => {
  return res.json(Projects);
});

/* retornar um projeto específico */
server.get('/projects/:id', verifyProjectIDExist, (req, res) => {
  return res.json(req.project);
});

/* salvar um novo projeto */
server.post(
  '/projects',
  assignProjectID,
  verifyProjectTitleExist,
  verifyProjectTasksArray,
  (req, res) => {
    Projects.push(req.body);
    return res.json(Projects);
  }
);

/* adicionar uma task em um projeto existente */
server.post(
  '/projects/:id/tasks',
  verifyProjectIDExist,
  verifyTaskTitle,
  (req, res) => {
    const { tasktitle } = req.body;
    req.project.tasks.push(tasktitle);
    return res.json(req.project);
  }
);

/* atualizar um projeto */
server.put(
  '/projects/:id',
  verifyProjectIDExist,
  verifyProjectTitleExist,
  verifyProjectTasksArray,
  (req, res) => {
    const { tasks } = req.body;
    req.project.title = req.body.title;
    if (tasks && typeof tasks == 'string') {
      req.project.tasks.push(tasks);
    } else {
      req.project.tasks = [...req.project.tasks, ...tasks];
    }
    return res.json(req.project);
  }
);

// ############
// RUN SERVER
// ############

server.listen(3000);
