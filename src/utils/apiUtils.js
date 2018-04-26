import 'isomorphic-fetch';
import jwt_decode from 'jwt-decode';

export function checkStatus(response) {
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
  return response;
}

export function parseJSON(response) {
  return response.json();
}


export function formatDate(timeStamp) {
  if (!timeStamp) return false;
  let newDate =  new Date(timeStamp);
  let dd = newDate.getDate();
  let mm = newDate.getMonth()+1; //January is 0!

  const yyyy = newDate.getFullYear();
  if(dd <10){
      dd ='0'+dd;
  } 
  if(mm <10){
      mm ='0'+mm;
  } 
  newDate = dd+'/'+mm+'/'+yyyy;
  return newDate;
}

export function calculateTax(total) {
   return((total / 119 ) * 19);
}

const sumUpTotals = (transactions, fieldName) => {
  return Object.values(transactions || {}).reduce((a, b) => {
    transactions = 
      ((b && b[fieldName] && parseFloat(b[fieldName].replace( /,/g, ''))) || 0);
    a +=   transactions;
    return a;
  }, 0);
}

const sumUpCorrTotals = (transactions) => {
  return Object.values(transactions || {}).reduce((a, b) => {
    const formattedTotal = parseFloat(b.total) || 0;
    return a += formattedTotal;
  }, 0);
}

export function calculateATotals(guests, corrections, type) {  
  const sumGuests = sumUpTotals(guests, 'Auszahlung an Kunde');
  const sumCorrA = sumUpCorrTotals(corrections)
  
  const sumCorr = sumCorrA;
  const total = sumGuests + sumCorr;
  return total.toFixed(2) ;
}

export function calculateRTotals(guests, corrections, type) {
  const sumGuests = sumUpTotals(guests, 'Gesamtumsatz Airgreets');
  const sumCorrR = sumUpCorrTotals(corrections)
  const sumCorrA = type === 'Auszahlungskorrektur in €' ? sumUpCorrTotals(corrections) : 0;
  return (sumGuests + sumCorrR + sumCorrA).toFixed(2) ;
}

export function calculateTaxTotals(type, guests, corrections) {
  const key1 = type === 'Auszahlung' ? 'Auszahlung an Kunde' : 'Gesamtumsatz Airgreets';
  const sumGuests = calculateTax(sumUpTotals(guests, key1));
  const corrR = Object.values(corrections).filter(t => t.type === 'Rechnungskorrektur');
  const corrTax = corrR.reduce((p,c) => {
    const tax = Number(c["Ust-Korrektur"]|| 0) !== 0 ?  calculateTax(c.total) : 0;
    return p += tax;
  },0);
  const total = sumGuests + corrTax;
  return total.toFixed(2);
}

export function calculateTotals(type, guests, corrections) {
  const key1 = type === 'Auszahlung' ? 'Auszahlung an Kunde' : 'Gesamtumsatz Airgreets';
  const key2 = type === 'Auszahlung' ? 'Auszahlungskorrektur in €' : 'Rechnungskorrektur in €';  
  const sumGuests = sumUpTotals(guests, key1);
  const sumCorr = sumUpTotals(corrections, key2);
  
  return (sumGuests + sumCorr).toFixed(2) ;
}

/**
 * A utility to call a restful service.
 *
 * @param url The restful service end point.
 * @param config The config object of the call. Can be null.
 * @param request The request action.
 * @param onRequestSuccess The callback function to create request success action.
 *                 The function expects response json payload as its argument.
 * @param onRequestFailure The callback function to create request failure action.
 *                 The function expects error as its argument.
 */

export function callApi(
  url,
  config,
  request,
  onRequestSuccess,
  onRequestFailure
) {
  return dispatch => {
    dispatch(request);
    return fetch(url, config)
      .then(checkStatus)
      .then(parseJSON)
      .then(json => {
        dispatch(onRequestSuccess(json));
      })
      .catch(error => {
        console.log(error);
        const response = error.response;
        if (response === undefined) {
          dispatch(onRequestFailure(error));
        } else {
          error.status = response.status;
          error.statusText = response.statusText;
          response.text().then(text => {
            try {
              const json = JSON.parse(text);
              error.message = json.message;
            } catch (ex) {
              error.message = text;
            }
            dispatch(onRequestFailure(error));
          });
        }
      });
  };
}

export const ID_TOKEN = "id_token"; // this will be hidden and somewhere in production. 

export function setIdToken(idToken) {
  localStorage.setItem(ID_TOKEN, idToken);
}

export function removeIdToken() {
  localStorage.removeItem(ID_TOKEN);
}

export function loadIdToken() {
  return localStorage.getItem(ID_TOKEN);
}

export function decodeUserProfile(idToken) {
  try {
    return jwt_decode(idToken);
  } catch (err) {
    return null;
  }
}

export function loadUserProfile() {
  try {
    const idToken = localStorage.getItem(ID_TOKEN);
    const userProfile = jwt_decode(idToken);
    const now = new Date().getTime() / 1000; // Date().getTime() returns milliseconds.
    // So divide by 1000 to get seconds
    if (now > userProfile.exp) {
      // user profile has expired.
      removeIdToken();
      return null;
    }
    return userProfile;
  } catch (err) {
    return null;
  }
}
