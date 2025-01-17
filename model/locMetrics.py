import json
import cv2
import time
from functions.brightness import get_brightness_value
from functions.counter_image import count_people_in_image
import requests

SERVER_URL = "https://sentinel-safe-new.onrender.com"

video_file_paths = [
  "C:\\Users\\soude\\OneDrive\\Desktop\\model\\model\\resource\\CrowdVideo.mp4"
]

# Define interval for frame extraction (in seconds)
interval = 5


def extract_frame(video_path, time_passed):
  """Extracts a single frame from the given video file."""
  cap = cv2.VideoCapture(video_path)

  # Calculate the frame to extract based on time_passed and video's FPS
  fps = cap.get(cv2.CAP_PROP_FPS)
  frame_number = int(fps * time_passed)
  cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)

  ret, frame = cap.read()
  if not ret:
    print(f"Error: Could not read frame from {video_path}")
    return None
  cap.release()
  return frame


def save_frame(frame, filename):
  """Saves the extracted frame to a temporary file."""
  cv2.imwrite(filename, frame)


def calculate_area_rating(brightness, people_count, baseline_people_count=30, w1=0.6, w2=0.4):
  brightness_score = max(0, min(1, brightness))
  brightness_score = (brightness_score - 0.3) / (0.6 - 0.3)

  # Logarithmic scaling for people_count
  people_score = people_count + 1 / baseline_people_count + 1
  people_score = min(people_score, 1)  # Cap at 1 for extreme cases

  area_rating = 5 * (w1 * brightness_score + w2 * people_score)

  return round(area_rating, 2)


def main():
  start_time = time.time()

  while True:
    url = SERVER_URL + "/geo"
    payload = {}
    headers = {"authorization": "Bearer admin0"}
    response = requests.request("GET", url, headers=headers, data=payload)
    responseParsed = response.json()

    geoCodes = [item["id"] for item in responseParsed["data"]]

    for geoCode in geoCodes:
      for i, video_path in enumerate(video_file_paths):
        try:
          time_passed = time.time() - start_time
          frame = extract_frame(video_path, time_passed)
          if frame is not None:
            filename = f"temp_frame_{i}.jpg"
            save_frame(frame, filename)

            people_count = count_people_in_image(filename)
            brightness = get_brightness_value(filename)

            area_rating = calculate_area_rating(brightness, people_count)

            print(f"Video {i + 1}:")
            print(f"  People Count: {people_count}")
            print(f"  Brightness: {brightness}")
            print(f"  Area Rating: {area_rating}")
            print("-" * 20)

            url = SERVER_URL + "/metrics"

            payload = {
              "lumen": brightness,
              "peopleCount": people_count,
              "areaRating": area_rating,
              "geoCodesId": geoCode
            }

            payload_json = json.dumps(payload)

            headers = {"authorization": "Bearer admin0",
                       "Content-Type": "application/json"}

            response = requests.request("POST", url, headers=headers, data=payload_json)

            print(response.text)

        except Exception as e:
          print(f"Error processing video {i + 1}: {e}")
          break

    time.sleep(interval)


if __name__ == "__main__":
  main()
