
DELIMITER $$
CREATE TRIGGER parse_raw_data AFTER INSERT ON raw FOR EACH ROW  
BEGIN 

INSERT IGNORE INTO protocols (protocolName) VALUES (NEW.protocol);
INSERT IGNORE INTO hosts (hostName) VALUES (NEW.host);
INSERT IGNORE INTO uris (uriName) VALUES (NEW.uri);
INSERT IGNORE INTO methods (methodName) VALUES (NEW.method);
INSERT INTO bodies (bodyContent) VALUES (NEW.reqbody);
INSERT IGNORE INTO sourceips (sourceip) VALUES (NEW.sourceip);
INSERT INTO records (utime, secure, protocol, host, uri, method, body, sourceip)
SELECT NEW.utime, NEW.secure, p.protocolID, h.hostID, u.uriID, m.methodID, b.bodyID, s.sourceipID
FROM NEW, protocols AS p, hosts AS h, uris AS u, methods AS m, bodies AS b, sourceips AS s
WHERE p.protocolName = NEW.protocol
	AND h.hostName = NEW.host
	AND u.uriName = NEW.uri
	AND m.methodName = NEW.method
	AND b.bodyContent = NEW.reqbody
	AND s.sourceip = NEW.sourceip;
	
END$$    
DELIMITER ;

