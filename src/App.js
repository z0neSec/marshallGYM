import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cardio from './pages/Cardio';
import Strength from './pages/Strength';
import FreeWeights from './pages/FreeWeights';
import Functional from './pages/Functional';
import Combat from './pages/Combat';
import ShopAll from './pages/ShopAll';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import ProductList from './pages/admin/ProductList';
import AdminLogin from './pages/admin/AdminLogin';
import PrivateRoute from './components/PrivateRoute';
import { setAuthToken } from './services/api';
import './styles/theme.css';
import './styles/toast.css'; 
import ProductDetail from './pages/ProductDetail';

// set token on app load if exists
const token = localStorage.getItem('admin_token');
if (token) setAuthToken(token);

const App = () => (
  <Router>
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/cardio" component={Cardio} />
        <Route path="/strength" component={Strength} />
        <Route path="/free-weights" component={FreeWeights} />
        <Route path="/functional" component={Functional} />
        <Route path="/combat" component={Combat} />
        <Route path="/shop-all" component={ShopAll} />
        <Route path="/contact" component={Contact} />
        <Route path="/cart" component={Cart} />
        <Route path="/product/:id" component={ProductDetail} />

        {/* admin routes */}
        <Route path="/admin/login" component={AdminLogin} />
        <PrivateRoute exact path="/admin" component={AdminDashboard} />
        <PrivateRoute exact path="/admin/add" component={AddProduct} />
        <PrivateRoute exact path="/admin/products" component={ProductList} />
        <PrivateRoute exact path="/admin/edit/:id" component={AddProduct} />
      </Switch>
      <Footer />
    </div>
  </Router>
);

export default App;
