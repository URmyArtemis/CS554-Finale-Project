const yelp = require('yelp-fusion');
const apiKey = 't0fVoVqzvxnLr24kh-D9tyOgSChqAblbdiYT79jivXb-RON1SR8CgOjp7wHeJHy_bv8OucEwe7cHe66AO7EyK1soEsnbEQJzrCBzCg8EO2DO8-hZglzKJnZP3CGaX3Yx';
const yelpclient = yelp.client(apiKey);

const s = async () => {
    try {
        const response = await yelpclient.search({ term: 'barber', location: 'nj' });
        // console.log(response.body.businesses);
        // console.log(typeof response.jsonBody);
        const { businesses } = response.jsonBody;
        console.log(businesses[0]);
    } catch (e) {
        console.log(e);
    }
};

const c = async () => {
    try {
        const response = await yelpclient.reviews('the-cuban-restaurant-and-bar-hoboken-2');
        console.log(response.jsonBody.reviews);
    } catch (e) {
        console.log(e);
    }
}

c();

// const myDate = new Date();
// console.log(myDate.toLocaleDateString());
// console.log(myDate.toLocaleTimeString());
// console.log(myDate.toLocaleString());
// console.log(typeof myDate.toLocaleString());
// console.log(new Date().toLocaleString());
