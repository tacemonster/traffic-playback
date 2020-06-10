DROP VIEW IF EXISTS vTest;
CREATE VIEW vTest AS
SELECT jobID AS JobID, r.recordID AS RecordID, utime AS UTime, secure AS Secure, p.protocolName AS Protocol, h.hostName AS Host, u.uriName AS URI, m.methodName AS Method, s.sourceip AS SourceIP, headers AS Headers, body AS Body
FROM records AS r
	JOIN protocols AS p ON r.protocol = p.protocolID
	JOIN hosts AS h ON r.host = h.hostID
	JOIN uris AS u ON r.uri = u.uriID
	JOIN methods AS m ON r.method = m.methodID
	JOIN sourceips AS s ON r.sourceip = s.sourceipID
	JOIN jobrel AS j ON r.recordID = j.recordID
	JOIN (SELECT myTable.recID AS recID, CONCAT(GROUP_CONCAT(CONCAT(myTable.hName, '\r\n'), myTable.hVal SEPARATOR '\r\n'), '\r\n') AS headers FROM (SELECT h.headerName AS hName, h.headerValue AS hVal, rel.recordID AS recID FROM headers AS h, headerrel AS rel WHERE h.headerID = rel.headerID) AS myTable GROUP BY myTable.recID) AS hr ON r.recordID = hr.recID
;