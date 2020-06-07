DROP DATABASE IF EXISTS trafficDB;
CREATE DATABASE trafficDB;
CREATE USER 'tdbUser'@'localhost' IDENTIFIED BY 'SecurePassword2.0';
GRANT ALL PRIVILEGES ON trafficDB.* TO 'tdbUser'@'localhost';

USE trafficDB;

CREATE TABLE protocols (
    protocolID int AUTO_INCREMENT PRIMARY KEY,
    protocolName varchar(16) NOT NULL UNIQUE
);

CREATE TABLE hosts (
    hostID int AUTO_INCREMENT PRIMARY KEY,
    hostName varchar(256) NOT NULL UNIQUE
);

CREATE TABLE uris (
    uriID int AUTO_INCREMENT PRIMARY KEY,
    uriName varchar(256) NOT NULL UNIQUE
);

CREATE TABLE methods (
    methodID int AUTO_INCREMENT PRIMARY KEY,
    methodName varchar(16) NOT NULL UNIQUE
);

CREATE TABLE headers (
    headerID int AUTO_INCREMENT PRIMARY KEY,
    headerName text,
    headerValue text
);

CREATE TABLE sourceips (
    sourceipID int AUTO_INCREMENT PRIMARY KEY,
    sourceip varchar(40) NOT NULL UNIQUE
);

CREATE TABLE jobs (
    jobID int AUTO_INCREMENT PRIMARY KEY,
	jobName varchar(32) NOT NULL UNIQUE,
	active tinyint DEFAULT 1, 
    jobStart double,
    jobStop double,
	secure varchar(16),
    protocol varchar(512), 
	host varchar(512),
	uri varchar(512),
	method varchar(512), 
	sourceip varchar(512)
);

CREATE TABLE records (
    recordID int AUTO_INCREMENT PRIMARY KEY,
    utime double NOT NULL,
    secure tinyint NOT NULL,
    protocol int, 
    host int, 
    uri int, 
    method int, 
    sourceip int, 
	body longblob,
	FOREIGN KEY (protocol) REFERENCES protocols(protocolID),
	FOREIGN KEY (host) REFERENCES hosts(hostID),
	FOREIGN KEY (uri) REFERENCES uris(uriID),
	FOREIGN KEY (method) REFERENCES methods(methodID),
	FOREIGN KEY (sourceip) REFERENCES sourceips(sourceipID)
);

CREATE TABLE jobrel (
	jobID int NOT NULL,
	recordID int NOT NULL,
	FOREIGN KEY (jobID) REFERENCES jobs(jobID),
	FOREIGN KEY (recordID) REFERENCES records(recordID)
);

CREATE TABLE headerrel (
	recordID int, 
	headerID int, 
	FOREIGN KEY (recordID) REFERENCES records(recordID),
	FOREIGN KEY (headerID) REFERENCES headers(headerID)
);

CREATE VIEW v_record AS
SELECT r.recordID, utime, secure, protocol, host, uri, method, r.sourceip, headers, jobID
FROM records AS r
	JOIN protocols AS p ON r.protocol = p.protocolID
	JOIN hosts AS h ON r.host = h.hostID
	JOIN uris AS u ON r.uri = u.uriID
	JOIN methods AS m ON r.method = m.methodID
	JOIN sourceips AS s ON r.sourceip = s.sourceipID
	JOIN jobrel AS j ON r.recordID = j.recordID
	JOIN (SELECT myTable.recID AS recID, CONCAT(GROUP_CONCAT(CONCAT(myTable.hName, '\r\n'), myTable.hVal SEPARATOR '\r\n'), '\r\n') AS headers FROM (SELECT h.headerName AS hName, h.headerValue AS hVal, rel.recordID AS recID FROM headers AS h, headerrel AS rel WHERE h.headerID = rel.headerID) AS myTable GROUP BY myTable.recID) AS hr ON r.recordID = hr.recID
;


