export default class HTTPError extends Error {
  /**
   * 
   * @param {String} message 
   * @param {Number} status 
   */
  constructor(message, status, responseBody) {
    super(message);
    this.name = "HTTPError";
    this.status = status;
    this.body = responseBody
  }
}