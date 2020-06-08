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
	;
	