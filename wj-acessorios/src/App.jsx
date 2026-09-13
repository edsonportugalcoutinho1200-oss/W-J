import ProductList from './components/ProductList';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__brand-w">W/J</span>
          <span className="app__brand-name">ACESSÓRIOS</span>
        </div>
      </header>
      <main className="app__main">
        <h1 className="app__title">Nossos produtos</h1>
        <ProductList />
      </main>
    </div>
  );
}

export default App;