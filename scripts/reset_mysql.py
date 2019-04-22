#import pymysql
import pymysql
from time import sleep

# db = pymysql.connect("localhost", "Phuckks_User", "Phuckks_Pass", "Phuckks_DB")
# require user for mysql.  "Phuckks_User"@"localhost" -> pass: "Phuckks_pass"
# CREATE user "Phuckks_User"@"%" identified by password "Phuckks_Pass"

db = pymysql.connect("localhost", "Phuckks_User", "Phuckks_Pass", "Phuckks_DB")
cursor = db.cursor()

try:
        print "1. Drop table"
        print "Running: DROP TABLE Food_Water....",
        try:
                cursor.execute("DROP table Food_Water")
                db.commit()
                print "100%"
        except:
                print "Error"

        print "2. Create table"
        table = "Food_Water"
        sql = ""
        sql = "CREATE TABLE " + table + "(ID INT(10) PRIMARY KEY AUTO_INCREMENT, NAME_PET VARCHAR(255) NOT NULL, ML INT(15) NOT NULL, G INT(15) NOT NULL, TIME DATETIME NOT NULL)"
        print "Running: %s...." %sql,
        try:
                cursor.execute(sql)
                db.commit()
                print "100%"
        except:
                print "Error"
        


except:
        print "Close DB"
        db.close()
print "Close DB"
db.close()
