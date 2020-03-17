const express = require('express');
const socket = require('socket.io');

const app = express();
const port = process.env.PORT || 8000;

const tasks = [];

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const server = app.listen(port, () => console.log(`Server start on port ${port}`));
const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (id) => {
    tasks.splice(tasks.findIndex(task => task.id === id), 1);
    socket.broadcast.emit('removeTask', id);
  });

  socket.on('editTask', (newName, id) => {
    tasks[tasks.findIndex(task => task.id === id)].name = newName;
    socket.broadcast.emit('editTask', newName, id);
  });

  // socket.on('disconnect', () => {
  //   const user =  users[users.findIndex(user => user.id === socket.id)];
  //   io.emit('message', {author: 'Chat Bot', content: `${user.userName} has left the conversation... :(`});
  //   users.splice(users.findIndex(user => user.id === socket.id), 1);
  // });
});