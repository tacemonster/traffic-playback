DELIMITER $$
DROP TRIGGER IF EXISTS parse_raw_data;
CREATE TRIGGER parse_raw_data AFTER INSERT ON raw FOR EACH ROW  
BEGIN 
DECLARE delim CHAR(2);
DECLARE splitHeader text;
DECLARE hName text;
DECLARE hValue text;
DECLARE recID int;
DECLARE headID int;
INSERT IGNORE INTO protocols (protocolName) VALUES (NEW.protocol);
INSERT IGNORE INTO hosts (hostName) VALUES (NEW.host);
INSERT IGNORE INTO uris (uriName) VALUES (NEW.uri);
INSERT IGNORE INTO methods (methodName) VALUES (NEW.method);
INSERT INTO bodies (bodyContent) VALUES (NEW.reqbody);
INSERT IGNORE INTO sourceips (sourceip) VALUES (NEW.sourceip);
INSERT INTO records (utime, secure, protocol, host, uri, method, body, sourceip)
SELECT NEW.utime, NEW.secure, p.protocolID, h.hostID, u.uriID, m.methodID, b.bodyID, s.sourceipID
FROM protocols AS p, hosts AS h, uris AS u, methods AS m, bodies AS b, sourceips AS s
WHERE p.protocolName = NEW.protocol
	AND h.hostName = NEW.host
	AND u.uriName = NEW.uri
	AND m.methodName = NEW.method
	AND b.bodyContent = NEW.reqbody
	AND s.sourceip = NEW.sourceip;
SET delim='\r\n';
SET splitHeader = NEW.header;
SET recID = (SELECT MAX(recordID) FROM records);
splitting: LOOP
	SET hName = SUBSTRING_INDEX(splitHeader,delim,1);
	SET splitHeader = (SELECT TRIM(LEADING CONCAT(hName,delim) FROM splitHeader));
	SET hValue = SUBSTRING_INDEX(splitHeader,delim,1);
	SET splitHeader = (SELECT TRIM(LEADING CONCAT(hValue,delim) FROM splitHeader));
	INSERT IGNORE INTO headers(headerName, headerValue)
		VALUES (hName, hValue);
	SET headID = (SELECT headerID FROM headers WHERE headerName = hName AND headerValue = hValue LIMIT 1);
	INSERT INTO headerrel (recordID, headerID)
	VALUES (recID, headID);
	IF LENGTH(splitHeader) > 0 THEN
		ITERATE splitting;
	END IF;
	LEAVE splitting;
END LOOP splitting;
INSERT INTO jobrel (jobID, recordID)
SELECT MAX(r.recordID), j.jobID
FROM records AS r, jobs AS j
WHERE (NEW.jobs LIKE CONCAT('^',TO_CHAR(j.jobID),',%')
	OR NEW.jobs LIKE CONCAT('%,',TO_CHAR(j.jobID),',%')
	OR NEW.jobs LIKE CONCAT('%,',TO_CHAR(j.jobID),'$')
	);
END$$    
DELIMITER ;

