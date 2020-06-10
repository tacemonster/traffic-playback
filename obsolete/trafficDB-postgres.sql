CREATE DATABASE trafficDB;

USE trafficDB;

CREATE SEQUENCE raw_seq;

CREATE TABLE raw (
    id int DEFAULT NEXTVAL ('raw_seq') PRIMARY KEY,
    utime varchar(16) NOT NULL,
    secure boolean NOT NULL,
    protocol varchar(16) NOT NULL,
    host varchar(64) NOT NULL,
    uri varchar(256) NOT NULL,
    method varchar(16) NOT NULL,
    header text NOT NULL,
    sourceip varchar(40) NOT NULL
);

CREATE SEQUENCE protocols_seq;

CREATE TABLE protocols (
    protocolID int DEFAULT NEXTVAL ('protocols_seq') PRIMARY KEY,
    protocolName varchar(16) NOT NULL UNIQUE
);

CREATE SEQUENCE hosts_seq;

CREATE TABLE hosts (
    hostID int DEFAULT NEXTVAL ('hosts_seq') PRIMARY KEY,
    hostName varchar(64) NOT NULL UNIQUE
);

CREATE SEQUENCE uris_seq;

CREATE TABLE uris (
    uriId int DEFAULT NEXTVAL ('uris_seq') PRIMARY KEY,
    uriName varchar(256) NOT NULL UNIQUE
);

CREATE SEQUENCE methods_seq;

CREATE TABLE methods (
    methodID int DEFAULT NEXTVAL ('methods_seq') PRIMARY KEY,
    methodName varchar(16) NOT NULL UNIQUE
);

CREATE SEQUENCE headers_seq;

CREATE TABLE headers (
    headerID int DEFAULT NEXTVAL ('headers_seq') PRIMARY KEY,
    headerContent text
);

CREATE SEQUENCE sourceips_seq;

CREATE TABLE sourceips (
    sourceipID int DEFAULT NEXTVAL ('sourceips_seq') PRIMARY KEY,
    sourceip varchar(40) NOT NULL UNIQUE
);

CREATE TABLE jobs (
    jobID varchar(32) PRIMARY KEY,
    jobStart timestamp(3) NOT NULL,
    jobStop timestamp(3) NOT NULL,
    protocol int FOREIGN KEY REFERENCES protocols(protocolID);,
    method int FOREIGN KEY REFERENCES methods(methodID)
);

CREATE SEQUENCE records_seq;

CREATE TABLE records (
    recordID int DEFAULT NEXTVAL ('records_seq') PRIMARY KEY,
    utime varchar(16) NOT NULL,
    secure boolean NOT NULL,
    job varchar(32) FOREIGN KEY REFERENCES jobs(jobID);,
    protocol int FOREIGN KEY REFERENCES protocols(protocolID),
    host int FOREIGN KEY REFERENCES hosts(hostID),
    uri int FOREIGN KEY REFERENCES uris(uriID),
    method int FOREIGN KEY REFERENCES methods(methodID),
    header int FOREIGN KEY REFERENCES headers(headerID),
    sourceip int FOREIGN KEY REFERENCES sourceips(sourceipID)
);
