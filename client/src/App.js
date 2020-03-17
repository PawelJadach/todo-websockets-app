import React, { Component } from 'react';
import io from 'socket.io-client';

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
  };

  updateData(tasks){
    this.setState((prevState) => ({
      tasks: tasks,
    }))
  }

  removeTask(id, status ='client'){
    this.setState((prevState) => ({
      tasks: prevState.tasks.filter((task, index) => index !== id),
    }));
    if (status === 'client') this.socket.emit('removeTask', id);
  };

  submitForm = (e) => {
    e.preventDefault();
    const task = this.state.taskName;
    this.addTask(task);
    this.setState((prevState) => ({
      taskName: '',
    }));
    this.socket.emit('addTask', task);
  }

  addTask = (task) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.concat(task),
    }));
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
            {this.state.tasks.map((task, index) => <li key={index} className="task">{task}<button onClick={() => this.removeTask(index)} className="btn btn--red">Remove</button></li>)}
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
