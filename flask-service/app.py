from flask import Flask, request, jsonify
import geopy
from geopy.geocoders import Nominatim

app = Flask(__name__)

@app.route("/find_coordinates", methods=["POST"])
def predict():
    # Get JSON data
    data = request.get_json()
    address = data['address']
    status = data['status']

    if not address or not status:
        return jsonify({"error": "Missing address or status"}), 400

    if status in ['DELIVERED', 'IN-PROGRESS']:
        status = 'ACTIVE'
    else:
        status = 'INACTIVE'

    geolocator = Nominatim(user_agent="thumbworx")
    tries = 0

    while tries < 5:
        try:
            location = geolocator.geocode(address)
            if location:
                return jsonify({
                    "address": address,
                    "latitude": location.latitude,
                    "longitude": location.longitude,
                    "type": "Courier Delivery",
                    "status": status
                }), 200
        except geopy.exc.GeocoderUnavailable:
            tries += 1
    
    return jsonify({
        "Error": "Failed to find location."
    }), 404

if __name__ == "__main__":
    app.run(debug=True)