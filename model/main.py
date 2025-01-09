import schedule
import time
from sentiment import sentiment
from locMetrics import update_locmetrics


# schedule.every(30).minutes.do(sentiment)
# schedule.every(1).hours.do(update_locmetrics)


# print("Main.py Running....")
while True:
    # schedule.run_pending()
    sentiment()
    time.sleep(10)
    print("Sentiment Done....")
# print("Script Stopped....")
