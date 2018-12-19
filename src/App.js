import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Customers from './Components/Customers';
import Library from './Components/Library';
import Search from './Components/Search';
import StatusBar from './Components/StatusBar';
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.resetState()
  }

  resetState = () => {
    return {
      selectedCustomer: undefined,
      selectedMovie: undefined
    }
  };

 url = "http://localhost:3000/";

 selectMovie = (movie) => {
   console.log(movie);
   this.setState({
     selectedMovie: movie
   });
 };

 selectCustomer = (customer) => {

   this.setState({
     selectedCustomer: customer
   });
 };

 addMovie = (movie) => {

   const addMovieURL = this.url + 'movies';

   axios.post(addMovieURL, {id: movie.external_id})
   .then((response) => {
     console.log(response)
     this.setStatusMessage(`Successfully added ${movie.title} to rental library`);
   })
   .catch((error) => {
     console.log(error)
     this.setStatusMessage(`Cound not add ${movie.title} to rental library`);
   })
 };

 setStatusMessage = (message) => {
   this.setState({status: message});
 }

  checkoutMovie = () => {
    const rentalUrl = this.state.selectedMovie ?
   `${this.url}rentals/${this.state.selectedMovie.title}/check-out?` :
   `${this.url}rentals/:title/check-out`;
    console.log(rentalUrl);

    const customerId = this.state.selectedCustomer ?
    this.state.selectedCustomer.id : 0;
    console.log(customerId);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    console.log(dueDate);

    const movie = this.state.selectedMovie.title;
    const customer = this.state.selectedCustomer.name;

    axios.post(rentalUrl, {customer_id: customerId})
    .then((response) => {
      this.setStatusMessage(`Successfully checked out ${movie} to ${customer}`);
      this.setState(
        this.resetState(),
      )
    })
    .catch((error) => {
      console.log(error)
      this.setStatusMessage(`Unable to check out ${movie} to ${customer}. ${error}`);
    })
  };

  render() {
    console.log(this.state.status);
    return (
      <div className="App">
        <Router>
         <div>
           <div className='top-bar'>
             <ul className='nav-links'>
               <li>
                 <Link to="/search">Search</Link>
               </li>
               <li>
                 <Link to="/library">Library</Link>
               </li>
               <li>
                 <Link to="/customers">Customers</Link>
               </li>
             </ul>

             <section className="rentalDisplay">
               <div>
                 <p>Selected Movie</p>
                 {this.state.selectedMovie && <p>{this.state.selectedMovie.title}</p>}
               </div>
               <div>
                 <p>Selected Customer</p>
                 {this.state.selectedCustomer && <p>{this.state.selectedCustomer.name}</p>}
               </div>
               <div>
                 <button onClick={this.checkoutMovie}>Check Out New Rental</button>
               </div>
             </section>
           </div>

            <div className="status-bar">
              {this.state.status &&
                <StatusBar message={this.state.status}/>}
            </div>

           <Route path="/search"
             render={() => <Search baseUrl={this.url}
             addMovieCallback={this.addMovie}
             setStatusMessageCallback={this.setStatusMessage} />}
             />
           <Route
             path="/library"
             render={() => <Library selectMovieCallback={this.selectMovie}
             baseUrl={this.url} setStatusMessageCallback={this.setStatusMessage}/>}
             />
           <Route
             path="/customers"
             render={() => <Customers selectCustomerCallback={this.selectCustomer}
             baseUrl={this.url} setStatusMessageCallback={this.setStatusMessage}/>}
             />
         </div>
       </Router>



      </div>
    );
  }
}

export default App;
