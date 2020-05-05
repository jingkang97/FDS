import { BehaviorSubject } from 'rxjs';
import { handleErrors } from '../helpers';

function restaurantSignup(name, min, address) {
    const data = { name: name, min: min, address: address };
    const url = "http://localhost:3000/api/v1/restaurant/auth/signup";
    console.log('data???: ', data);
  
    var request = new Request(url, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
  
    return fetch(request)
      .then(handleErrors)
    //   .then((response) => {
    //     response.json().then((data) => {
    //       console.log("resty sign up donezo!!! :D");
    //       return data;
    //     });
    //   });
  }

function searchRestaurantResults(data) {
    var results = [];
    data.forEach(result => results.push(result.resid));
    return results;
}

function searchRestaurant(searchQuery) {
    const url = 'http://localhost:3000/api/v1/restaurant/search?keywords=' + searchQuery;
    console.log('url ', url);

    var request = new Request(url, {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' })
    });

    return fetch(request)
      .then(handleErrors);
}

function getRestaurant(resid) {
    const data = {resid: resid};
    const url = 'http://localhost:3000/api/v1/restaurant/get';

    var request = new Request(url, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
    });

    return fetch(request)
        .then(handleErrors)
        // .catch((error) => {
        //     console.log('error: ', error);
        // })
}

function editRestaurant(resname, min, id) {
    const data = {resname: resname, min: min, id: id};
    const url = 'http://localhost:3000/api/v1/restaurant/edit';
    console.log('data!!!!: ', data);

    var request = new Request(url, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
    });

    return fetch(request)
      .then(handleErrors)
    //   .then((response) => {
    //       response.json()
    //           .then((data) => {
    //               console.log('edit resty donezo!');
    //           })
    //   })
}

export const restaurantService = {
    restaurantSignup,
    searchRestaurant,
    searchRestaurantResults,
    getRestaurant,
    editRestaurant
}