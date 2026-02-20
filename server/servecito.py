from flask import Flask, request
from datetime import datetime

app = Flask(__name__)

@app.route("/collect", methods=["POST"])
def collect():
    try:
        data = request.json
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"\n[{timestamp}]  Data received from extension:")
        print(f"   Matches: {data}")
        print(f"   Count: {len(data) if isinstance(data, list) else 'N/A'}")
        return "OK", 200
    except Exception as e:
        print(f"\n Error processing request: {e}")
        return "Error", 400

@app.route("/ping", methods=["GET"])
def ping():
    print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 🔔 Ping received - Server is alive")
    return '{"status": "alive"}', 200

if __name__ == "__main__":
    print("\n Server starting on http://localhost:4000")
    print(" Endpoint: POST http://localhost:4000/collect")
    print(" Waiting for extension data (every 10 seconds)...\n")
    app.run(host="0.0.0.0", port=4000, debug=False)
