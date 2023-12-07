--
-- adds two users to the database, one for read-only access and
-- another for read-write access:
--
-- NOTE: do NOT change the user names, and do NOT change the pwds.
-- These need to remain as is for grading purposes.
--
-- ref: https://dev.mysql.com/doc/refman/8.0/en/create-user.html
--

USE tennishub;

DROP USER IF EXISTS 'tennishub-read-only';
DROP USER IF EXISTS 'tennishub-read-write';

CREATE USER 'tennishub-read-only' IDENTIFIED BY 'abc123!!';
CREATE USER 'tennishub-read-write' IDENTIFIED BY 'def456!!';

GRANT SELECT, SHOW VIEW ON tennishub.* 
      TO 'tennishub-read-only';
GRANT SELECT, SHOW VIEW, INSERT, UPDATE, DELETE ON tennishub.* 
      TO 'tennishub-read-write';
      
FLUSH PRIVILEGES;