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

CREATE OR REPLACE VIEW v_record AS
select r.recordID as id, r.utime as utime, r.secure as secure, p.protocolName as protocol, h.hostName as host, u.uriName as uri, m.methodName as method, headers as header, r.body as reqbody, s.sourceip as sourceip, j.jobID as jobid
from records as r
	join protocols as p on r.protocol = p.protocolID
	join hosts as h on r.host = h.hostID
	join uris as u on r.uri = u.uriID
	join methods as m on r.method = m.methodID
	join sourceips as s on r.sourceip = s.sourceipID
	join jobrel as j on r.recordID = j.recordID
	join (select myTable.recID as recID, CONCAT(GROUP_CONCAT(CONCAT(myTable.hName, '\r\n'), myTable.hVal SEPARATOR '\r\n'), '\r\n') AS headers FROM (select h.headerName as hName, h.headerValue as hVal, rel.recordID as recID from headers as h, headerrel as rel where h.headerID = rel.headerID) AS myTable group by myTable.recID) as hr on r.recordID = hr.recID
	ORDER BY r.utime ASC;


