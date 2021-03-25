/**
 * EasyHTTP Library
 * Library for making HTTP requests
 *
 * @version 3.0.0
 * @author  Brad Traversy
 * @license MIT
 *
 **/

class EasyHTTP {
  // Make an HTTP GET Request
  async get(url) {
    //make a response Object:
    const response = await fetch(url);

    //convert the response from JSON into JS Object and return it:
    const resData = await response.json();
    return resData;

    // VERSION WITHOUT ASYNC/AWAIT:
    // return new Promise((resolve, reject) => {
    //   fetch(url)
    //     .then((res) => res.json())
    //     .then((data) => resolve(data))
    //     .catch((err) => reject(err));
    // });
  }
}
