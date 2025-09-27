import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ShuffleProvider } from './contexts/ShuffleContext';
import { SearchProvider } from './contexts/SearchContext';
import App from './App.tsx'
import './main.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <SearchProvider>
  <ShuffleProvider>
  <FavoritesProvider>
      <App />
  </FavoritesProvider>
  </ShuffleProvider>
  </SearchProvider>
  </StrictMode>

)
