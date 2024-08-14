import React, { useState, useEffect } from 'react';
import './Sidebar.css';


    /* функция рамномного выбора 2 сущностей из массива  и копирование в другой */
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

const Sidebar = (props) => { 

  const [rates, setRates] = useState([]);

  useEffect(() => {
    // Инициализация состояния из props
    setRates(props.rates);
  }, [props.rates]);

  /* функция установки рейтинга для сущности */ 
  const setRate = (id) => {
    console.log('setRate');
    let value = localStorage.getItem(id);
    if (value && typeof value === 'string') {
      let text = value.split('|')[0];
      let rate = value.split('|')[1];
      let done = value.split('|')[2];
      
      localStorage.setItem(id ,  `${text}|${+rate+1}|${done}`);  

      // Обновляем состояние
      setRates(prevRates => 
        prevRates.map(rate => 
          rate.id === id ? { ...rate, rate: +rate + 1 } : rate
        )
      );

    }
  }

  if (typeof props.rates[0] == 'undefined' || typeof props.rates[1] == 'undefined') {
    return null; // Если пропсы не переданы, ничего не рендерим
  }
    
	return (  
		<div className='sidebar' >
      {
        getRandomObjects(props.rates, 2).some(prop => prop === undefined) ? (
          <div className='alternative-block'>
            <p>Не достаточно открытых задач.</p>
          </div>
        ) : getRandomObjects(props.rates, 2).map(prop => { console.log('this prop: ', prop); console.log('is undef?: ', prop !== undefined);
          if (prop === undefined) {
            return;
          } else {
            return (
              <div className='field' key={prop.id} onClick={() => setRate(prop.id)} >
                {prop.text}
              </div>
            );
          }
        
        })
      }
		</div>
		);
};

export default Sidebar;