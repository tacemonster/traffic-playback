CREATE DATABASE trafficDB;

ALTER SESSION SET CURRENT_SCHEMA = trafficDB;

CREATE TABLE raw (
    id number(10)  PRIMARY KEY,
    utime varchar2(16) NOT NULL,
    secure number(1) NOT NULL,
    protocol varchar2(16) NOT NULL,
    host varchar2(64) NOT NULL,
    uri varchar2(256) NOT NULL,
    method varchar2(16) NOT NULL,
    header varchar(MAX) NOT NULL,
    sourceip varchar2(40) NOT NULL
);

-- Generate ID using sequence and trigger
CREATE SEQUENCE raw_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER raw_seq_tr
 BEFORE INSERT ON raw FOR EACH ROW
 WHEN (NEW.id IS NULL)
BEGIN
 SELECT raw_seq.NEXTVAL INTO :NEW.id FROM DUAL;
END;
/

CREATE TABLE protocols (
    protocolID number(10)  PRIMARY KEY,
    protocolName varchar2(16) NOT NULL UNIQUE
);

-- Generate ID using sequence and trigger
CREATE SEQUENCE protocols_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER protocols_seq_tr
 BEFORE INSERT ON protocols FOR EACH ROW
 WHEN (NEW.protocolID IS NULL)
BEGIN
 SELECT protocols_seq.NEXTVAL INTO :NEW.protocolID FROM DUAL;
END;
/

CREATE TABLE hosts (
    hostID number(10)  PRIMARY KEY,
    hostName varchar2(64) NOT NULL UNIQUE
);

-- Generate ID using sequence and trigger
CREATE SEQUENCE hosts_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER hosts_seq_tr
 BEFORE INSERT ON hosts FOR EACH ROW
 WHEN (NEW.hostID IS NULL)
BEGIN
 SELECT hosts_seq.NEXTVAL INTO :NEW.hostID FROM DUAL;
END;
/

CREATE TABLE uris (
    uriId number(10)  PRIMARY KEY,
    uriName varchar2(256) NOT NULL UNIQUE
);

-- Generate ID using sequence and trigger
CREATE SEQUENCE uris_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER uris_seq_tr
 BEFORE INSERT ON uris FOR EACH ROW
 WHEN (NEW.uriId IS NULL)
BEGIN
 SELECT uris_seq.NEXTVAL INTO :NEW.uriId FROM DUAL;
END;
/

CREATE TABLE methods (
    methodID number(10)  PRIMARY KEY,
    methodName varchar2(16) NOT NULL UNIQUE
);

-- Generate ID using sequence and trigger
CREATE SEQUENCE methods_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER methods_seq_tr
 BEFORE INSERT ON methods FOR EACH ROW
 WHEN (NEW.methodID IS NULL)
BEGIN
 SELECT methods_seq.NEXTVAL INTO :NEW.methodID FROM DUAL;
END;
/

CREATE TABLE headers (
    headerID number(10)  PRIMARY KEY,
    headerContent varchar(MAX)
);

-- Generate ID using sequence and trigger
CREATE SEQUENCE headers_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER headers_seq_tr
 BEFORE INSERT ON headers FOR EACH ROW
 WHEN (NEW.headerID IS NULL)
BEGIN
 SELECT headers_seq.NEXTVAL INTO :NEW.headerID FROM DUAL;
END;
/

CREATE TABLE sourceips (
    sourceipID number(10)  PRIMARY KEY,
    sourceip varchar2(40) NOT NULL UNIQUE
);

-- Generate ID using sequence and trigger
CREATE SEQUENCE sourceips_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER sourceips_seq_tr
 BEFORE INSERT ON sourceips FOR EACH ROW
 WHEN (NEW.sourceipID IS NULL)
BEGIN
 SELECT sourceips_seq.NEXTVAL INTO :NEW.sourceipID FROM DUAL;
END;
/

CREATE TABLE jobs (
    jobID varchar2(32) PRIMARY KEY,
    jobStart timestamp(3) NOT NULL,
    jobStop timestamp(3) NOT NULL,
    protocol number(10) FOREIGN KEY REFERENCES protocols(protocolID);,
    method int FOREIGN KEY REFERENCES methods(methodID)
);

CREATE TABLE records (
    recordID number(10)  PRIMARY KEY,
    utime varchar2(16) NOT NULL,
    secure number(1) NOT NULL,
    job varchar2(32) FOREIGN KEY REFERENCES jobs(jobID);

-- Generate ID using sequence and trigger
CREATE SEQUENCE records_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER records_seq_tr
 BEFORE INSERT ON records FOR EACH ROW
 WHEN (NEW.recordID IS NULL)
BEGIN
 SELECT records_seq.NEXTVAL INTO :NEW.recordID FROM DUAL;
END;
/,
    protocol int FOREIGN KEY REFERENCES protocols(protocolID),
    host int FOREIGN KEY REFERENCES hosts(hostID),
    uri int FOREIGN KEY REFERENCES uris(uriID),
    method int FOREIGN KEY REFERENCES methods(methodID),
    header int FOREIGN KEY REFERENCES headers(headerID),
    sourceip int FOREIGN KEY REFERENCES sourceips(sourceipID)
);