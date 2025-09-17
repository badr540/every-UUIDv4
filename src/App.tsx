import Header from './components/Header';
import UUIDList from './components/UUIDList'
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ShuffleProvider } from './contexts/ShuffleContext';

function App(){
  return (
    <>
      <ShuffleProvider>
      <FavoritesProvider>
        <div className='flex flex-col h-screen w-screen bg-base-100'>
          <Header/>
          <UUIDList/>
        </div>
      </FavoritesProvider>
      </ShuffleProvider>
    </>
  )
}

export default App
