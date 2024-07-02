import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Index from './indexpage';
import AddData from './AddData';
import DetailData from './DetailData';

function App() {
  const [index, setIndex] = useState(0)
  const [games, setGames] = useState([]);
  const [route, setRoute] = useState("index");

  return (
    <>
      {route === "index" && <Index games={games} setGames={setGames} index={index} setIndex={setIndex} setRoute={setRoute}/>}
      {route === "add" && <AddData games={games} setGames={setGames} setRoute={setRoute}/>}
      {route === "details" && <DetailData games={games} setGames={setGames} index={index} setIndex={setIndex} setRoute={setRoute}/>}
    </>
  )
}

export default App