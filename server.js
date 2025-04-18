const http = require('http');
const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

const PORT = 3001;
const todosFile = path.join(__dirname, 'todos.json');
const logFile = path.join(__dirname, 'logs.txt');

const logger = new EventEmitter();

logger.on('log', (message) => {
  const timestamp = new Date().toISOString();
  fs.appendFile(logFile, `${timestamp} - ${message}\n`, (err) => {
    if (err) console.error('Logging failed:', err);
  });
});

const readTodos = () => {
  try {
    const data = fs.readFileSync(todosFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeTodos = (todos) => {
  fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
};

const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;
  const id = url.pathname.split('/')[2];

  logger.emit('log', `${method} ${url.pathname}`);

  if (url.pathname === '/todos' && method === 'GET') {
    let todos = readTodos();

    const completed = url.searchParams.get('completed');
    if (completed !== null) {
      todos = todos.filter(todo => todo.completed === (completed === 'true'));
    }

    sendResponse(res, 200, todos);

  } else if (url.pathname.match(/^\/todos\/\d+$/) && method === 'GET') {
    const todos = readTodos();
    const todo = todos.find(t => t.id === parseInt(id));
    if (!todo) return sendResponse(res, 404, { message: 'Todo not found' });
    sendResponse(res, 200, todo);

  } else if (url.pathname === '/todos' && method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.title) return sendResponse(res, 400, { message: 'Title is required' });

        const todos = readTodos();
        const newTodo = {
          id: todos.length ? todos[todos.length - 1].id + 1 : 1,
          title: data.title,
          completed: data.completed ?? false,
        };

        todos.push(newTodo);
        writeTodos(todos);
        sendResponse(res, 200, newTodo);
      } catch (err) {
        sendResponse(res, 400, { message: 'Invalid JSON' });
      }
    });

  } else if (url.pathname.match(/^\/todos\/\d+$/) && method === 'PUT') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const todos = readTodos();
        const index = todos.findIndex(t => t.id === parseInt(id));

        if (index === -1) return sendResponse(res, 404, { message: 'Todo not found' });

        if (!data.title) return sendResponse(res, 400, { message: 'Title is required' });

        todos[index] = {
          ...todos[index],
          title: data.title,
          completed: data.completed ?? todos[index].completed,
        };

        writeTodos(todos);
        sendResponse(res, 200, todos[index]);
      } catch (err) {
        sendResponse(res, 400, { message: 'Invalid JSON' });
      }
    });

  } else if (url.pathname.match(/^\/todos\/\d+$/) && method === 'DELETE') {
    const todos = readTodos();
    const index = todos.findIndex(t => t.id === parseInt(id));
    if (index === -1) return sendResponse(res, 404, { message: 'Todo not found' });

    const deleted = todos.splice(index, 1)[0];
    writeTodos(todos);
    sendResponse(res, 200, deleted);

  } else {
    sendResponse(res, 404, { message: 'Route not found' });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
