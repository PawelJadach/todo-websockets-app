import React, { Component } from 'react';



class Task extends Component {
  state = {
    clicked: true,
    name: this.props.task.name,
  };

  handleClick = (e) => {
    this.setState((prevState) => ({
      clicked: !prevState.clicked,
    }));
  }

  onChange = (e) => {
    this.setState({
      name: e.target.value,
    })
  };


  render(){
    const { task, removeTask, editTask } = this.props;
     return (
      this.state.clicked ? 
      (<li key={task.id} onClick={this.handleClick} className="task">{task.name}<button onClick={() => removeTask(task.id)} className="btn btn--red">Remove</button></li>) :
      (<form id="edit-task-form" onSubmit={(e) => {
          e.preventDefault();
          this.handleClick();
          editTask(this.state.name, task.id);
        }}>
        <input onChange={this.onChange} autoFocus className="text-input edit" autoComplete="off" type="text" value={this.state.name} id="task-name" />
        <button className="btn btn--green" type="submit">Edit</button>
      </form>)
    )
  }
}

export default Task;