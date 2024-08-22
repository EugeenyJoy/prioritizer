import { useEffect, useState, React } from 'react';
import './App.css';
import Form from './Form/Form';
import Sidebar from './Sidebar/Sidebar';

function App() {
  const [todos, setTodos] = useState([]);
  const [allTodos, setAllTodos] = useState(0);
  const [allComplete, SetAllComplete] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    console.log('Todos обновлены:', todos);
    SetAllComplete(todos.filter(todo => todo.done === true).length);
  },[todos])

  const putTodo = (value) => {
    console.log('putTodo');
    if (value) {
      let todoId = Date.now();
      setAllTodos(allTodos + 1);
      let keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        keys.push(key);
      }

      keys.sort(function(a, b) {
        let numberA = parseInt(a.substring(5));
        let numberB = parseInt(b.substring(5));
        return numberA - numberB;
      });

      // setTodos([...todos, {id: todoId, text: value, done: false, rate: todoId}]);
      setTodos(prevTodos => [
        ...prevTodos,
        { id: todoId, text: value, done: false, rate: 0 }
      ]);

      localStorage.setItem(todoId , value + `|0|false`);    

    } else {
      alert('Введите текст!');
    }
  }

  const toggleTodo = (id) => {
    console.log('toggleTodo');
    if (!isMouseDown) {
      let value = localStorage.getItem(id);
      if (value && typeof value === 'string') {
        let start = value.substring(0, value.lastIndexOf('|'));
    
        // Получить часть после последнего "|"
        let end = (value.substring(value.lastIndexOf('|') + 1));
        let newEnd = false ;
        if (end === 'true') {newEnd = false;} else {newEnd = true;}
        
        localStorage.setItem(id , start + '|' + newEnd);  
    
        setTodos(todos.map(todo => {
          if (todo.id !== id) return todo;
    
          return {
            ...todo,
            done: !todo.done
          }
        }))
      }
    }
  }
  
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !==id));
    localStorage.removeItem(id);
    setAllTodos(allTodos - 1);
  }

  const clearTodos = () => {
    setTodos([]); // Обновляем состояние todos
    setAllTodos(0);
    localStorage.clear();
  }

   useEffect(() => {
    const firstTodos = () => {
      let initialTodos = [];
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let item = localStorage.getItem(key);
        let text = item.split('|')[0];
        let rate = Number(item.split('|')[1]);
        let done = item.split('|')[2];
        let doneVal = done === 'true'; // Преобразование строки в логическое значение
        initialTodos.push({id: key, text: text, done: doneVal, rate: rate});
      }
      setTodos(initialTodos);
      setAllTodos(localStorage.length);
    }

    firstTodos();
  }, []);

  todos.sort((a, b) => b.rate - a.rate);
  let isHolding = false;
  let holdTimer;

  // const sortedTodos = [...todos].sort((a, b) => b.rate - a.rate);

  const handleMouseDown = () => {
    holdTimer = setTimeout(() => {
        isHolding = true;
    }, 1000); // 1 секунда
  };

  const handleMouseUp = (e, id) => {
    clearTimeout(holdTimer);
    if (isHolding) {
      e.currentTarget.nextElementSibling.classList.remove("hidden");
    } else {
      e.stopPropagation();
        toggleTodo(id);
    }
    isHolding = false; // Сбрасываем флаг
  };

  const handleInputChange = (id, newValue) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newValue } : todo
    ));
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      e.currentTarget.classList.add('hidden');
    }
  };

  const updateTodos = (newTodos) => {
    console.log('updateTodos:', newTodos);
    setTodos(newTodos);
  };
  
  return (
    <>
    <div className='wrapper'>
      <div className='content-wrapper'>
      <div className='help'>
          ?
        </div> 
        <div className='container'>
          <Sidebar rates={todos} updateTodos={updateTodos} />
        </div> 
        <div className='container'>
          <h1 className='title'>Todo List</h1>
          <Form 
            putTodo={putTodo}
          />
          {(todos.length > 0) ? (<div className='btn-container'>
            <button className='btn' onClick={clearTodos}>Очистить всё</button>
          </div>) : ''
          }
          
          <ul className='todos'>
            {
              todos.map(todo => { 
                return (
                  <div key={todo.id} style={{width: '100%'} }>
                    <li className={todo.done === true ? "field todo done" : "field todo"}  
                    onMouseDown={handleMouseDown} onMouseUp={(e) => handleMouseUp(e,todo.id)} 
                    >
                      <div className={'todoText'}> {todo.text} </div>
                      <img src='./delete.svg' alt='delete' className='delete' onClick={e => {
                        e.stopPropagation();
                        removeTodo(todo.id);
                      }
                      } />
                    </li>
                    <input type='text'  maxLength={45} className={`todoInput field hidden`} value={todo.text} 
                      onClick={e => {e.stopPropagation();}}
                      onChange={e => handleInputChange(todo.id, e.target.value)} 
                      onKeyDown={e => handleKeyDown(e, todo.id)} />
                  </div>
                );
              })
            }
            <div className='info field'>
              <span>Всего: {allTodos} </span>
              <span>Выполнено: {allComplete} </span>
            </div>
          </ul>
        </div>
      </div>
    </div>
    <footer> 
      <div className='container'><span>20.08.2024 </span>
        <a href='https://eugeenyjoy.ru/'> EugeenyJoy</a> 
      </div>
    </footer>
    </>
  );
}

export default App;
