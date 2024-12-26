import { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null); // Store the id of the todo being edited

  // Load todos from localStorage on component mount
  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      setTodos(JSON.parse(todoString)); // Load todos if they exist in localStorage
    }
  }, []);

  // Save todos to localStorage
  const saveToLS = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos)); // Save updated todos
  };

  // Handle editing a todo
  const handleEdit = (e, id) => {
    const todoToEdit = todos.find(i => i.id === id);
    setTodo(todoToEdit.todo);
    setEditId(id); // Store the id of the todo being edited
  };

  // Handle saving the edited todo
  const handleSaveEdit = () => {
    if (editId !== null) {
      const updatedTodos = todos.map(item => 
        item.id === editId ? { ...item, todo: todo } : item
      );
      setTodos(updatedTodos);
      setTodo(""); // Clear input
      setEditId(null); // Reset the editing id
      saveToLS(updatedTodos); // Save updated todos
    }
  };

  // Handle deleting a todo
  const handleDelete = (e, id) => {
    const newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos); // Save updated todos
  };

  // Handle adding a new todo
  const handleAdd = () => {
    if (todo.trim() === "") return;  // Prevent adding empty todos
    const newTodo = { id: uuidv4(), todo, iscompleted: false };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setTodo(""); // Clear input
    saveToLS(updatedTodos); // Save updated todos
  };

  // Handle changing the input field value
  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  // Handle checkbox change (mark completed)
  const handleCheckbox = (e) => {
    const id = e.target.name;
    const index = todos.findIndex(item => item.id === id);
    const newTodos = [...todos];
    newTodos[index].iscompleted = !newTodos[index].iscompleted;
    setTodos(newTodos);
    saveToLS(newTodos); // Save updated todos
  };

  return (
    <>
      <Navbar />
      <div className='container mx-auto my-5 rounded-xl p-5 bg-slate-800 min-h-[80vh] text-white'>
        <div className='addTodo'>
          <h2 className='text-lg font-bold p-2'>Add a Todo</h2>
          <input
            onChange={handleChange}
            value={todo}
            className='text-slate-950 w-80'
            type="text"
          />
          {editId !== null ? (
            <button
              onClick={handleSaveEdit}
              className='font-bold p-2 mx-3 border rounded-md border-white p-2'>
              Save
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className='font-bold p-2 mx-3 border rounded-md border-white p-2'>
              Add
            </button>
          )}
        </div>
        <h1 className="text-xl font-bold">MY- TO DO</h1>
        <div className="todos">
          {todos.map(item => (
            <div key={item.id} className="todo flex w-1/2 justify-between my-3">
              <input
                name={item.id}
                onChange={handleCheckbox}
                type="checkbox"
                checked={item.iscompleted}
              />
              <div className={item.iscompleted ? "line-through" : ""}>
                {item.todo}
              </div>
              <div className="buttons mx-3">
                <button
                  onClick={(e) => handleEdit(e, item.id)}
                  className='mx-3 border rounded-md border-white p-2'>
                  EDIT
                </button>
                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  className='mx-3 border rounded-md border-white p-2'>
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
