import React, { useState, useEffect } from 'react';
import './Sidebar.css';


/* функция случайного выбора 2 сущностей из массива  и копирование в другой */
const getRandomObjects = (sourceArray, count) => {
  const randomObjects = [];
  const sourceCopy = sourceArray.filter(obj => obj.done === false);

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * sourceCopy.length); 
    const randomObject = sourceCopy.splice(randomIndex, 1)[0];
    randomObjects.push(randomObject);
  }
  
  return randomObjects;

};

const selectedIds = []; // Массив для хранения выбранных id

const Sidebar = (props) => { 

  const [rates, setRates] = useState([]);
  const [randomObjects, setRandomObjects] = useState(getRandomObjects(props.rates, 2));

  useEffect(() => {
    // Инициализация состояния из props
    setRates(props.rates);
  }, [props.rates]);

  /* функция установки рейтинга для сущности */ 
  const setRate = (id, selectedIds) => {
    console.log('setRate');
    let value = localStorage.getItem(id);
    if (value && typeof value === 'string') {
      let text = value.split('|')[0];
      let rate = value.split('|')[1];
      let done = value.split('|')[2];
      
      localStorage.setItem(id ,  `${text}|${+rate+1}|${done}`);  

      for (let selected of selectedIds ) {
        if( selected !== id) {
          let value2 = localStorage.getItem(selected);
          let text2 = value2.split('|')[0];
          let rate2 = value2.split('|')[1];
          let done2 = value2.split('|')[2];
          if(parseInt(rate2) > 0) {
            localStorage.setItem(selected ,  `${text2}|${+rate2-0.3}|${done2}`);
          }
          
        }
      }

      // Обновляем состояние
      setRates(prevRates => 
        prevRates.map(rate => 
          rate.id === id ? { ...rate, rate: +rate + 1 } : rate
        )
      );

    }
  }

  const handleReload = () => {
    const newRandomObjects = getRandomObjects(props.rates, 2);
    setRandomObjects(newRandomObjects); // Обновляем состояние с новыми случайными объектами
};

  if (typeof props.rates[0] == 'undefined' || typeof props.rates[1] == 'undefined') {
    return null; // Если пропсы не переданы, ничего не рендерим
  }
  const selectedIds = []; // Массив для хранения выбранных id

	return (  
		<div className='sidebar' >
      <div className='priorHeader'>
        <h3>Выбрать приоритет</h3>
        <span className='reload' onClick={handleReload}>&#x21bb;</span>
      </div>
      {
        getRandomObjects(props.rates, 2).some(prop => prop === undefined) ? (
          <div className='alternative-block'>
            <p>Не достаточно открытых задач.</p>
          </div>
        ) : getRandomObjects(props.rates, 2).map(prop => { 
          if (prop === undefined) {
            return;
          } else {
            selectedIds.push(prop.id);
            return (
              <div className='field' key={prop.id} onClick={() => {
                  setRate(prop.id, selectedIds);
                  selectedIds.length = 0; // Очищаем массив после передачи
                  
                  }
                } >
                <div className='todoText'>{prop.text}</div>
              </div>
            );
          }
        })
      }
		</div>
		);
};

export default Sidebar;