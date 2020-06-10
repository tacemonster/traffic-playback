DROP DATABASE IF EXISTS [trafficDB];
CREATE DATABASE trafficDB;

GO

USE trafficDB;

GO

CREATE TABLE raw (
    id int IDENTITY(1,1) PRIMARY KEY, 
    utime float NOT NULL,
    secure bit NOT NULL,
    protocol varchar(16) NOT NULL,
    host varchar(256) NOT NULL,
    uri varchar(256) NOT NULL,
    method varchar(16) NOT NULL,
    header text NOT NULL,
	jobs text NOT NULL,
	reqbody varbinary(MAX),
    sourceip varchar(40) NOT NULL
);

CREATE TABLE protocols (
    protocolID int IDENTITY(1,1) PRIMARY KEY,
    protocolName varchar(16) NOT NULL UNIQUE
);

CREATE TABLE hosts (
    hostID int IDENTITY(1,1) PRIMARY KEY,
    hostName varchar(256) NOT NULL UNIQUE
);

CREATE TABLE uris (
    uriId int IDENTITY(1,1) PRIMARY KEY,
    uriName varchar(256) NOT NULL UNIQUE
);

CREATE TABLE methods (
    methodID int IDENTITY(1,1) PRIMARY KEY,
    methodName varchar(16) NOT NULL UNIQUE
);

CREATE TABLE headers (
    headerID int IDENTITY(1,1) PRIMARY KEY,
    headerContent text
);

CREATE TABLE bodies (
    bodyID int IDENTITY(1,1) PRIMARY KEY,
    bodyContent varbinary(MAX)
);

CREATE TABLE sourceips (
    sourceipID int IDENTITY(1,1) PRIMARY KEY,
    sourceip varchar(40) NOT NULL UNIQUE
);

CREATE TABLE jobs (
    jobID int IDENTITY(1,1) PRIMARY KEY,
	jobName varchar(32) NOT NULL,
	active bit DEFAULT 1,
    jobStart datetime NOT NULL,
    jobStop datetime NOT NULL,
	secure varchar(16),
	protocol varchar(512),
	host varchar(512),
	uri varchar(512),
	method varchar(512),
	sourceip varchar(512)
);

CREATE TABLE records (
    recordID int IDENTITY(1,1) PRIMARY KEY,
    utime varchar(16) NOT NULL,
    secure bit NOT NULL,
    job int FOREIGN KEY REFERENCES jobs(jobID),
    protocol int FOREIGN KEY REFERENCES protocols(protocolID),
    host int FOREIGN KEY REFERENCES hosts(hostID),
    uri int FOREIGN KEY REFERENCES uris(uriID),
    method int FOREIGN KEY REFERENCES methods(methodID),
    header int FOREIGN KEY REFERENCES headers(headerID),
    sourceip int FOREIGN KEY REFERENCES sourceips(sourceipID)
);

CREATE TABLE jobrel (
	jobID int NOT NULL FOREIGN KEY REFERENCES jobs(jobID),
	recordID int NOT NULL FOREIGN KEY REFERENCES records(recordID)
);

CREATE TABLE headerrel (
	recordID int, 
	headerID int, 
	FOREIGN KEY (recordID) REFERENCES records(recordID),
	FOREIGN KEY (headerID) REFERENCES headers(headerID)
);