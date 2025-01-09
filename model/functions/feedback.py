from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

tokenizer = AutoTokenizer.from_pretrained(
    "nlptown/bert-base-multilingual-uncased-sentiment"
)
model = AutoModelForSequenceClassification.from_pretrained(
    "nlptown/bert-base-multilingual-uncased-sentiment"
)


def sentiment_scores(review):
    tokens = tokenizer.encode(
        review, return_tensors="pt", max_length=512, truncation=True
    )
    result = model(tokens)
    score = int(torch.argmax(result.logits)) + 1
    return score
