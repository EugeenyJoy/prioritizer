import { useEffect, useState, React } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Form from './Form/Form';
import Sidebar from './Sidebar/Sidebar';
import HelpPage from './HelpPage/HelpPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [todos, setTodos] = useState([]);
  const [allTodos, setAllTodos] = useState(0);
  const [allComplete, SetAllComplete] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const colors = ['#99FF33', '#FFFF33', '#33CCCC', '#0099FF', '#6600FF', '#9900CC', '#FF00FF', '#FF6600', '#FF0066', '#ff3399'];
  console.log('currentPage', currentPage);
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
  
  const setColorByRate = (rate) => {
    if (rate < 2) {
      return colors[0]; 
    } else if (rate < 4) {
      return colors[1]; 
    } else if (rate < 6) {
      return colors[2]; 
    } else if (rate < 8) {
      return colors[3]; 
    } else if (rate < 10) {
      return colors[4]; 
    } else if (rate < 12) {
      return colors[5]; 
    } else if (rate < 14) {
      return colors[6]; 
    } else if (rate < 16) {
      return colors[7]; 
    } else if (rate <= 18) {
      return colors[8]; 
    } else {
      return colors[9]; 
    }

  };

  return (
    <Router>
    <div className='wrapper'>
      <Routes>
        <Route path="/" element={
          <div className='content-wrapper'>
            <div className='container help'>
              <Link to="/help" className='help-inner'>?</Link>
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
                        style={{boxShadow: '2px 2px 10px 0 ' + setColorByRate(todo.rate)} } >
                          <div className={'todoText'} style={{color: setColorByRate(todo.rate)} }> {todo.text} </div>
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
        } />
        <Route path="/help" element={<div className='content-wrapper'>
          <div className='container '>
              <Link to="/" style={{fontStyle: 'italic', textDecoration: 'overline '} }>ВЕРНУТЬСЯ</Link>
            </div>
            <HelpPage />
        </div>} />
          
      </Routes>

      <footer> 
        <div className='container'><span>20.08.2024 </span>
          <a href='https://eugeenyjoy.ru/'> EugeenyJoy</a> 
        </div>
      </footer>
    </div>
    </Router>
  );
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker зарегистрирован с областью:', registration.scope);
      })
      .catch((error) => {
        console.error('Ошибка регистрации Service Worker:', error);
      });
  });
}

export default App;
