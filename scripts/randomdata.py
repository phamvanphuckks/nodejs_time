import pymysql
from datetime import datetime
from time import sleep
import pytz

FOOD = 0
WATER = 0

try:
	db = pymysql.connect("localhost","Phuckks_User","Phuckks_Pass", "Phuckks_DB")
	cursor = db.cursor()
	print "Connected to mysql"
except:
	print "Connect error to mysql"
	exit(0)
try:
	while 1:
		sleep(1)
		table = "Food_Water"
        	sql = " " 
		FOOD = FOOD+1
		WATER  = WATER + 2
		now = datetime.now(pytz.utc)
		now = str(now.astimezone(pytz.timezone('Asia/Ho_Chi_Minh'))).split("+")[0]
		sql = "INSERT INTO "+ table +"(NAME_PET, FOOD, WATER, TIME) VALUES('%s','%s','%s','%s')" %("dog", str(FOOD), str(WATER), now)
		print "Running: %s...." %sql,
		try:
			cursor.execute(sql)
			db.commit()
			print "100%"
		except:
			print "Error"
except KeyboardInterrupt:
	print "OK finally"
	db.close()
	print "Close Database"
