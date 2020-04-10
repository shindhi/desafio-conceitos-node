const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).send();
  }

  return next();
}

function valdiateRepository(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  request.index = repositoryIndex;

  return next();
}

app.use('/repositories/:id', validateId, valdiateRepository);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find(repository => repository.id === id);

  const newRepo = {
    ...repository,
    title,
    url,
    techs,
  }

  repositories[request.index] = newRepo;

  return response.json(newRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositories.splice(request.index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
