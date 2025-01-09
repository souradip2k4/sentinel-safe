import os
import cv2
import numpy as np
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

def get_brightness_value(image_path, threshold=0.4, mode="luma"):
    """
    Determines if an image is light or dark based on specified mode and threshold.

    Args:
        image_path (str): Path to the image file.
        threshold (float): Brightness threshold (0.0 to 1.0).
        mode (str): Method to calculate brightness ('average', 'luma', 'contrast').

    Returns:
        float: Brightness value.
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            logging.error(f"Failed to load image at path: {image_path}")
            return False
        img = cv2.resize(img, (640, 480), interpolation=cv2.INTER_AREA)  # Resizing image for optimized processing

        if mode == "average":
            if len(img.shape) > 2:
                img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            brightness = np.mean(img) / 255
        elif mode == "luma":
            lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
            l, _, _ = cv2.split(lab)
            brightness = np.mean(l) / 255
        elif mode == "contrast":
            if len(img.shape) > 2:
                img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            brightness = np.std(img) / 255
        else:
            raise ValueError(
                f"Invalid mode: {mode}. Valid options are 'average', 'luma', 'contrast'."
            )

        return brightness

    except Exception as e:
        logging.error(f"An error occurred while processing the image: {e}")
        return False
