import Header from './components/Header';
import UUIDList from './components/UUIDList'
function App(){

  return (
    <div 
      className='flex flex-col h-screen w-screen bg-base-100'
    >
      <Header/>
      <UUIDList/>
    </div>
  )
}

export default App
