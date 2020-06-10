DELIMITER $$


DROP PROCEDURE IF EXISTS `splitHeader` $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `splitHeader`()
BEGIN

DECLARE my_delimiter CHAR(1);
DECLARE splitHeader varchar(255);
DECLARE done INT;
DECLARE occurance INT;
DECLARE i INT;
DECLARE split_id INT;
DECLARE ins_query VARCHAR(500);
DECLARE splitter_cur CURSOR FOR
SELECT id,cat from tmp;

DECLARE CONTINUE HANDLER FOR NOT FOUND SET done=1;

DROP TEMPORARY TABLE IF EXISTS `my_splits`;
CREATE TEMPORARY TABLE `my_splits` (
`splitted_column` varchar(45) NOT NULL,
`id` int(10) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

OPEN splitter_cur;
splitter_loop:LOOP
FETCH splitter_cur INTO split_id,splitHeader;

SET my_delimiter=’;’;
SET occurance=length(splitHeader)-length(replace(splitHeader,my_delimiter,”))+1;
IF done=1 THEN
LEAVE splitter_loop;
END IF;
#  select occurance;
IF occurance > 0 then
#select occurance;
set i=1;
while i <= occurance do
#        select concat(“SUBSTRING_INDEX(SUBSTRING_INDEX( ‘”,splitHeader ,”‘, ‘”,my_delimiter,”‘, “,i, “),'”,my_delimiter,”‘,-1);”);
SET ins_query=concat(“insert into my_splits(splitted_column,id) values(“, concat(“SUBSTRING_INDEX(SUBSTRING_INDEX( ‘”,splitHeader ,”‘, ‘”,my_delimiter,”‘, “,i, “),'”,my_delimiter,”‘,-1),”,split_id,”);”));
#    select ins_query;
set @ins_query=ins_query;
PREPARE ins_query from @ins_query;
EXECUTE ins_query;
set i=i+1;
end while;
ELSE
set ins_query=concat(“insert into my_splits(splitted_column,id) values(“,splitHeader,”‘,”,split_id,”);”);
set @ins_query=ins_query;
PREPARE ins_query from @ins_query;
EXECUTE ins_query;
END IF;
set occurance=0;
END LOOP;

CLOSE splitter_cur;

END $$

DELIMITER ;