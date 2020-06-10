# SQL Documentation
---
> note: numbers on the left are representative of the line number where the item can be referenced

## setup_mysql.sql

### Database creation
 1. Removes the trafficDB database if it already exists (this allows the script to reset the database back to the original state).
 2. Creates the trafficDB database.
 3. Creates a user that the software will use to interact with the database. 
*this is where you will modify the values if you would prefer a custom user for the database actions*
 4. Grants access to the database for the new user. 
*be sure to update here if you changed the name in line 3*
 6. Sets the new database as the current database to run the following commands.

### Tables creation
8. protocols – Holds the unique protocols captured into the database
| Field Name | Field Type | Field Parameters |
| -------- | -------- | -------- | 
| protocolID | int | AUTO, PRIMARY KEY | 
| protocolName | varchar(16) | NOT NULL, UNIQUE | 

13. hosts 
| Field Name | Field Type | Field Parameters |
| -------- | -------- | -------- | 
| hostID | int | AUTO, PRIMARY KEY | 
| hostName | varchar(256) | NOT NULL, UNIQUE | 

18. uris 
| Field Name | Field Type | Field Parameters |
| -------- | -------- | -------- | 
| uriID | int | AUTO, PRIMARY KEY |
| uriName | varchar(256) | NOT NULL, UNIQUE |

23. methods 
| Field Name | Field Type | Field Parameters |
| -------- | -------- | -------- | 
| methodID | int | AUTO, PRIMARY KEY |
| methodName | varchar(16) | NOT NULL, UNIQUE |

28. headers 
| Field Name | Field Type | Field Parameters |
| -------- | -------- | -------- | 
| headerID | int | AUTO, PRIMARY KEY |
| headerName | text | |
| headerValue | text | |

34. sourceips 
| Field Name | Field Type | Field Parameters |
| -------- | -------- | -------- | 
| sourceipID | int | AUTO, PRIMARY KEY |
| sourceip | varchar(40) | NOT NULL, UNIQUE |

39. jobs 
| Field Name | Field Type | Field Parameters |
| -------- | -------- | -------- | 
| jobID | int | AUTO, PRIMARY KEY | 
| jobName | varchar(32) | NOT NULL, UNIQUE | 
| active | tinyint | DEFAULT 1 |  
| jobStart | double |  | 
| jobStop | double |  |  
| secure | varchar(16) |  | 
| protocol | varchar(512) |  |  
| host | varchar(512) |  | 
| uri | varchar(512) |  | 
| method | varchar(512) |  |  
| sourceip | varchar(512) |  | 

53. records 
| Field Name | Field Type | Field Parameters |
| -------- | -------- | -------- | 
| recordID | int | AUTO, PRIMARY KEY | 
| utime | double | NOT NULL | 
| secure | tinyint | NOT NULL | 
| protocol | int | FK to protocols(protocolID) |  
| host | int | FK to hosts(hostID) | 
| uri | int | FK to uris(uriID) | 
| method | int | FK to methods(methodID) |  
| sourceip | int | FK to sourceips(sourceipID) | 
| body | longblob | | 

70. jobrel 
| Field Name | Field Type | Field Parameters |
| -------- | -------- | -------- | 
| jobID | int | NOT NULL, FK to jobs(jobID) | 
| recordID | int | NOT NULL, FK to records(recordID) | 

77. headerrel 
| Field Name | Field Type | Field Parameters |
| -------- | -------- | -------- | 
| recordID | int | FK to records(recordID) | 
| headerID | int | FK to headers(headerID) |

84. v_record 
	This view joins the other tables with the records table using the ID values and the relational (jobrel, headerrel) tables. It allows for viewing all the captured data as if it were all stored in a single table, while allowing the star schema design to save space by eliminating duplicate values. 
| Field Name | Referenced Field | Notes |
| -------- | -------- | -------- | 
| id | records.recordID |  |
| utime | records.utime |  |
| secure | records.secure |  |
| protocol | protocols.protocolName |  |
| host | hosts.hostName |  |
| uri | uris.recordID |  |
| method | methods.recordID | 
| header | headers.header[^1] |  consists of nested `CONCAT` commands to combine the Name/Value pairs for each header and then the multiple headers for each record. | 
| reqbody | records.body |  |
| sourceip | sourceips.recordID |  |
| jobid | jobrel.jobID |  |

[^1]: the data is compiled from the headers table, but the data is heavily concatenated. 
