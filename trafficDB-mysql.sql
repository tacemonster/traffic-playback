CREATE DATABASE trafficDB;

USE trafficDB;

CREATE TABLE raw (
    id int AUTO_INCREMENT PRIMARY KEY,
    utime double NOT NULL,
    secure tinyint NOT NULL,
    protocol varchar(16) NOT NULL,
    host varchar(256) NOT NULL,
    uri varchar(256) NOT NULL,
    method varchar(16) NOT NULL,
	header text NOT NULL,
	reqbody longblob,
    sourceip varchar(40) NOT NULL
);

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

CREATE TABLE bodies (
    bodyID int AUTO_INCREMENT PRIMARY KEY,
    bodyContent blob
);

CREATE TABLE sourceips (
    sourceipID int AUTO_INCREMENT PRIMARY KEY,
    sourceip varchar(40) NOT NULL UNIQUE
);

CREATE TABLE jobs (
    jobID varchar(32) PRIMARY KEY,
    jobStart datetime(3) NOT NULL,
    jobStop datetime(3) NOT NULL,
    protocol int, 
	method int, 
	FOREIGN KEY (protocol) REFERENCES protocols(protocolID),    
	FOREIGN KEY (method) REFERENCES methods(methodID)
);

CREATE TABLE records (
    recordID int AUTO_INCREMENT PRIMARY KEY,
    utime double NOT NULL,
    secure tinyint NOT NULL,
    job varchar(32), 
    protocol int, 
    host int, 
    uri int, 
    method int, 
    sourceip int, 
	FOREIGN KEY (job) REFERENCES jobs(jobID),
	FOREIGN KEY (protocol) REFERENCES protocols(protocolID),
	FOREIGN KEY (host) REFERENCES hosts(hostID),
	FOREIGN KEY (uri) REFERENCES uris(uriID),
	FOREIGN KEY (method) REFERENCES methods(methodID),
	FOREIGN KEY (sourceip) REFERENCES sourceips(sourceipID)
);

CREATE TABLE headerrel (
	recordID int, 
	headerID int, 
	FOREIGN KEY (recordID) REFERENCES records(recordID),
	FOREIGN KEY (headerID) REFERENCES headers(headerID)
);


