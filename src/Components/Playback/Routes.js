class Routes {
  static port = "7999";
  static init = "http://localhost:" + Routes.port + "/api/init";
  static run = "http://localhost:" + Routes.port + "/api/play/run";
  static createjob = "http://localhost:" + Routes.port + "/api/createjob";
}

export default Routes;
