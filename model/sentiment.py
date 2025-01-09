import numpy as np
from firebase.getDocument import (
    getAllCollections,
    getAllDocuments,
    updateDocument,
)
import os
import requests
from dotenv import load_dotenv

load_dotenv()

from function.feedback import sentiment_scores


def sentiment():
    allCollections = getAllCollections()
    totalScore = []
    for i in allCollections:  # For each Campus name
        print(i)
        allDoc = getAllDocuments(i)
        for doc in allDoc:
            print(doc.to_dict().get("review")[:15])
            rev = sentiment_scores(doc.to_dict().get("review"))
            totalScore.append(rev)
            print(rev)
            updateDocument(i, doc.id, {"sentiment": rev})
        r = requests.patch(
            f"{os.getenv('SERVER_URL')}/locmetrics/c/{i}",
            json={"sentiment": np.around(np.mean(totalScore))},
        )
        print(r.json())
        print()


# This script will, generate sentiment scores for each review in each campus and update the sentiment score in the database.
# This will also update the sentiment score for all Campuses ( indetified by the campus name) in the database.
# Status : Done and Dusted
