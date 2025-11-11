import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export function handleError(error) {
  let errMsg;
  if (error instanceof HttpErrorResponse) {
    // Handle HTTP errors
    if (error.error && error.error.data) {
      // Error response from PHP with our format
      errMsg = error.error.data;
    } else if (error.error) {
      // Other error response
      errMsg = typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
    } else {
      errMsg = `${error.status} - ${error.statusText || ''}`;
    }
  } else if (error instanceof Response) {
    const body = error.json() || '';
    const err = JSON.stringify(body);
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  } else {
    errMsg = error.message ? error.message : error.toString();
  }
  console.error('Error:', errMsg);
  return throwError(errMsg);
}
