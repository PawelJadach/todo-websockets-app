import React, { Component } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import Task from './Task';

class App extends Component {

  state = {
    tasks: [],
    taskName: '',
  };

  componentDidMount(){
    this.socket = io('http://localhost:8000');
    this.socket.on('updateData', (tasks) => this.updateData(tasks));
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (id) => this.removeTask(id, 'serwer'));
    this.socket.on('editTask', (newName, id) => this.editTask(newName, id, 'serwer'));
  };

  updateData(tasks){
    this.setState((prevState) => ({
      tasks: tasks,
    }))
  }

  removeTask = (id, status = 'client') => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.filter((task) => id !== task.id),
    }));
    if (status === 'client') this.socket.emit('removeTask', id);
  };

  submitForm = (e) => {
    e.preventDefault();
    if(this.state.taskName !== ''){
      const newTask = {
        id: uuidv4(),
        name: this.state.taskName,
      }
      this.addTask(newTask);
      this.setState((prevState) => ({
        taskName: '',
      }));
      this.socket.emit('addTask', newTask);
    } else alert('Wpisz coś!')
  }

  addTask = (task) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.concat(task),
    }));
  }

  editTask = (newName, id, status = 'client') => {
    if(newName !== ''){
      this.setState((prevState) => ({
        tasks: prevState.tasks.map(task => {
          if(task.id === id){
            task.name = newName;
            return task;
          } else return task;
        }),
      }));
      if(status === 'client')this.socket.emit('editTask', newName, id);
    } else alert('Wpisz coś!')
  }

  onChange = (e) => {
    this.setState({
      taskName: e.target.value,
    });
  }

  render(){
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>
  
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
  
          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map((task) => <Task key={task.id} editTask={this.editTask} task={task} removeTask={this.removeTask}/>)}
          </ul>
  
          <form id="add-task-form" onSubmit={this.submitForm}>
            <input onChange={this.onChange} className="text-input" autoComplete="off" type="text" placeholder="Type your description" value={this.state.taskName} id="task-name" />
            <button className="btn" type="submit">Add</button>
          </form>
  
        </section>
      </div>
    );
  };
};

export default App;
