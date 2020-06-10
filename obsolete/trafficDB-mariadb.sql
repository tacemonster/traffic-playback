CREATE DATABASE trafficDB;
 
USE trafficDB;
 
CREATE TABLE raw (
    id int AUTO_INCREMENT(1,1) PRIMARY KEY,
    utime varchar(16) NOT NULL,
    secure tinyint NOT NULL,
    protocol varchar(16) NOT NULL,
    host varchar(64) NOT NULL,
    uri varchar(256) NOT NULL,
    method varchar(16) NOT NULL,
    header longtext NOT NULL,
    sourceip varchar(40) NOT NULL
);

CREATE TABLE protocols (
    protocolID int AUTO_INCREMENT(1,1) PRIMARY KEY,
    protocolName varchar(16) NOT NULL UNIQUE
);

CREATE TABLE hosts (
    hostID int AUTO_INCREMENT(1,1) PRIMARY KEY,
    hostName varchar(64) NOT NULL UNIQUE
);

CREATE TABLE uris (
    uriId int AUTO_INCREMENT(1,1) PRIMARY KEY,
    uriName varchar(256) NOT NULL UNIQUE
);

CREATE TABLE methods (
    methodID int AUTO_INCREMENT(1,1) PRIMARY KEY,
    methodName varchar(16) NOT NULL UNIQUE
);

CREATE TABLE headers (
    headerID int AUTO_INCREMENT(1,1) PRIMARY KEY,
    headerContent longtext
);

CREATE TABLE sourceips (
    sourceipID int AUTO_INCREMENT(1,1) PRIMARY KEY,
    sourceip varchar(40) NOT NULL UNIQUE
);

CREATE TABLE jobs (
    jobID varchar(32) PRIMARY KEY,
    jobStart datetime(3) NOT NULL,
    jobStop datetime(3) NOT NULL,
    protocol int FOREIGN KEY REFERENCES protocols(protocolID);,
    method int FOREIGN KEY REFERENCES methods(methodID)
);

CREATE TABLE records (
    recordID int AUTO_INCREMENT(1,1) PRIMARY KEY,
    utime varchar(16) NOT NULL,
    secure tinyint NOT NULL,
    job varchar(32) FOREIGN KEY REFERENCES jobs(jobID);,
    protocol int FOREIGN KEY REFERENCES protocols(protocolID),
    host int FOREIGN KEY REFERENCES hosts(hostID),
    uri int FOREIGN KEY REFERENCES uris(uriID),
    method int FOREIGN KEY REFERENCES methods(methodID),
    header int FOREIGN KEY REFERENCES headers(headerID),
    sourceip int FOREIGN KEY REFERENCES sourceips(sourceipID)
);