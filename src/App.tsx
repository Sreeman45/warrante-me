
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Googlesignup from './pages/googlesignup'
import Homepage from './pages/homepage'
import { createContext, useState } from 'react'
interface Contextype{
  nikname:string | null
  setNickname:React.Dispatch<React.SetStateAction<string  | null>>
}
export const name=createContext<Contextype | null >(null)

function App() {
  const [nikname,setNickname]=useState<string | null>(null)
  return (
    <name.Provider value={{nikname,setNickname}}>

    <BrowserRouter>
    <Routes>
      <Route>
        <Route path='/signup'element={<Googlesignup/>}/>
        <Route path='/' element={<Homepage/>}/>
        

      </Route>
    </Routes>
   
    </BrowserRouter>
    </name.Provider>
 
  )
}

export default App
