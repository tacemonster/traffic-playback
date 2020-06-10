CREATE DATABASE testDB;

USE testDB;

CREATE TABLE raw (
    id int AUTO_INCREMENT PRIMARY KEY,
    utime double NOT NULL,
    secure tinyint NOT NULL,
    protocol varchar(16) NOT NULL,
    host varchar(256) NOT NULL,
    uri varchar(256) NOT NULL,
    method varchar(16) NOT NULL,
	header text NOT NULL,
	jobs text NOT NULL,
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
    jobID int AUTO_INCREMENT PRIMARY KEY,
	jobName varchar(32) NOT NULL UNIQUE,
	active tinyint DEFAULT 1, 
    jobStart double,
    jobStop double,
	secure varchar(16) NOT NULL,
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
	body int,
	FOREIGN KEY (protocol) REFERENCES protocols(protocolID),
	FOREIGN KEY (host) REFERENCES hosts(hostID),
	FOREIGN KEY (uri) REFERENCES uris(uriID),
	FOREIGN KEY (method) REFERENCES methods(methodID),
	FOREIGN KEY (sourceip) REFERENCES sourceips(sourceipID),
	FOREIGN KEY (body) REFERENCES bodies(bodyID)
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


