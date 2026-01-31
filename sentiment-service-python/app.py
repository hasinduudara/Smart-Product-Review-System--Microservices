from flask import Flask, request, jsonify
from textblob import TextBlob

app = Flask(__name__)

# Sentiment Analysis 
@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    # Get the review text from the request
    review_text = data.get('review', '')

    # Sentiment analysis using TextBlob
    analysis = TextBlob(review_text)
    polarity = analysis.sentiment.polarity

    # Determine the result
    if polarity > 0:
        sentiment = "Positive"
    elif polarity < 0:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    # Return the response as JSON
    return jsonify({
        'review': review_text,
        'sentiment': sentiment,
        'score': polarity
    })

if __name__ == '__main__':
    # Since Spring Boot runs on 8080, we'll run this on 5001
    app.run(port=5001, debug=True)