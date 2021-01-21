import React from 'react';
import axios from 'axios';
import './App.css';
import { Switch, Route, Link, useHistory } from 'react-router-dom'

const Step1 = ({choseBuilding}) => {
  return (
    <div className='form'>
      <p className='step'>Шаг 1</p>
      <div className='form-container'>
        <div className='step-title'>
          <span>Что будем строить ?</span>
        </div>
        <ol>
          <Link to="/step2"><li onClick={()=>choseBuilding('1')}>Жилой дом</li></Link>
          <Link to="/step3"><li onClick={()=>choseBuilding('2')}>Гараж</li></Link>
        </ol>
      </div>
      <Link to="/"><button>Отмена</button></Link>
      <Link to="/step2"><button onClick={()=>choseBuilding('1')}><span>Далее</span></button></Link>
    </div>
  )
}

const Step2 = ({handleSetHeight}) => {
  const [flow, setflow] = React.useState('0')
  console.log(flow)
  return (
    <div className='form'>
    <p className='step'>Шаг 2</p>
      <div className='form-container'>
        <div className='step-title'>
          <span>Количество этажей (число)</span>
        </div>    
        <input type='text' onChange={e=>setflow(e.target.value)} />
      </div>
      <Link to="/"><button>Отмена</button></Link>
      <Link to="/step3"><button onClick={()=>handleSetHeight(flow)}>Далее</button></Link>
    </div>
  )
}

const Step3 = ({handleSetMaterial, building}) => {
  return (
    <div className='form'>
      <p className='step'>Шаг 3</p>
      <div className='form-container'>
        <div className='step-title'>
          <span>Материал стен</span>
        </div> 
        {building === '1' ?
        <ol>
          <Link to="/step4"><li onClick={()=>handleSetMaterial('1')}>Кирпич</li></Link>
          <Link to="/step4"><li onClick={()=>handleSetMaterial('2')}>Шлакоблок</li></Link>
          <Link to="/step4"><li onClick={()=>handleSetMaterial('3')}>Деревянный брус</li></Link>
        </ol> :
        <ol>
          <Link to="/step4"><li onClick={()=>handleSetMaterial('2')}>Шлакоблок</li></Link>
          <Link to="/step4"><li onClick={()=>handleSetMaterial('4')}>Mеталл</li></Link>
          <Link to="/step4"><li onClick={()=>handleSetMaterial('5')}>Cендвич-панели</li></Link>
        </ol>}
      </div>
      <Link to="/"><button>Отмена</button></Link>
      <Link to="/step4"><button onClick={()=>handleSetMaterial('1')}>Далее</button></Link>
    </div>
  )
}

const Step4 = ({setX, setY, fetchData}) => {
  return (
    <div className='form'>
      <p className='step'>Шаг 4</p>
      <div className='form-container'>
        <div className='step-title'>
          <span>Материал стен</span>
        </div>
        <span>Длина стен (в метрах)</span>
        <div className='input-form'>
          <input type='text' onChange={e=>setX(e.target.value)} />
          <span>X</span>
          <input type='text' onChange={e=>setY(e.target.value)} />
        </div>        
      </div>
      <Link to="/"><button>Отмена</button></Link>
      <button onClick={fetchData}>Рассчитать</button>
    </div>
  )
}
const Success = ({result}) => {
  return (
    <div className='form'>
      <p className='step'>Результат расчета</p>
      <div className='form-container'>
        <div className='step-title'>
          <span>Успешно</span>
        </div>
        <span className='result'>{result}</span>
      </div>
      <Link to="/"><button className="neweval-but">Новый расчет</button></Link>
    </div>
  )
}

const Error = ({result}) => {
  return (
    <div className='form'>
      <p className='step'>Результат расчета</p>
      <div className='form-container'>
        <div className='step-title'>
          <span>Ошибка</span>
        </div>
        <span className='result'>{result}</span>
      </div>
      <Link to="/"><button className="neweval-but">Новый расчет</button></Link>
    </div>
  )
}

function App() {
  const history = useHistory();
  const [building, setBuilding] = React.useState('0') // 1 - жилой дом, 2 - гараж
  const [height, setHeight] = React.useState('0') // для гаражей игнорируется
  const [material, setMaterial] = React.useState('0') // 1 - кирпич, 2 - шлакоблок, 3 - деревянный брус, 4 - металл, 5 - сендвич-панели
  const [sizeX, setSizeX] = React.useState('0')
  const [sizeY, setSizeY] = React.useState('0')
  const [result, setResult] = React.useState('')

  const url = `https://data.techart.ru/lab/json/?building=${building}&height=${height}&material=${material}&sizex=${sizeX}&sizey=${sizeY}`
  const choseBuilding = num => {
    setBuilding(num)
    setHeight(0)
    setMaterial(0)
    setSizeX('0')
    setSizeY('0')
    setResult('')
  }
  const handleSetHeight = flow => setHeight(flow)  
  const handleSetMaterial = material => setMaterial(material)
  const handleSetSizeX = x => setSizeX(x)
  const handleSetSizeY = y => setSizeY(y)
  const fetchData = async () => {
    const data = await axios(url)
    setResult(data.data.message)
    history.push(`${data.data.result === 'error'? 'error': 'success'}`)
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>Калькулятор цены конструкций</p>
      </header>
      <Switch>
        <Route exact path='/' render={props => <Step1 choseBuilding={choseBuilding} />} />
        <Route path='/step2' render={props =><Step2 handleSetHeight={handleSetHeight} />} />
        <Route path='/step3' render={props =><Step3 handleSetMaterial={handleSetMaterial} building={building} />} />
        <Route path='/step4' render={props =><Step4 setX={handleSetSizeX} setY={handleSetSizeY} fetchData={fetchData} />} />
        <Route path='/success' render={props =><Success result={result} />}  />
        <Route path='/error' render={props =><Error result={result} />} />
      </Switch>
    </div>
  );
}

export default App;
