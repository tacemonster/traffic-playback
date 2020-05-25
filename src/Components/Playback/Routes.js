class Routes {
  static port = "7999";
  static init = "http://localhost:" + Routes.port + "/api/init";
  static run = "http://localhost:" + Routes.port + "/api/play/run";
  static createjob = "http://localhost:" + Routes.port + "/api/createjob";
  static getAllRaw = 'http://localhost:' + Routes.port + '/api/play';
  static getRealtime = 'http://localhost:' + Routes.port + '/api/play/realtime';
  static getPreview = 'http://localhost:' + Routes.port + '/api/preview';
}

export default Routes;
