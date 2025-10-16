import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import OnSale from './pages/OnSale';
import Cardio from './pages/Cardio';
import Strength from './pages/Strength';
import FreeWeights from './pages/FreeWeights';
import Functional from './pages/Functional';
import Combat from './pages/Combat';
import ShopAll from './pages/ShopAll';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import './styles/theme.css';

const App = () => (
  <Router>
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/on-sale" component={OnSale} />
        <Route path="/cardio" component={Cardio} />
        <Route path="/strength" component={Strength} />
        <Route path="/free-weights" component={FreeWeights} />
        <Route path="/functional" component={Functional} />
        <Route path="/combat" component={Combat} />
        <Route path="/shop-all" component={ShopAll} />
        <Route path="/contact" component={Contact} />
        <Route path="/cart" component={Cart} />
        <Route path="/wishlist" component={Wishlist} />
      </Switch>
      <Footer />
    </div>
  </Router>
);

export default App;
