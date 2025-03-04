from fastapi import FastAPI, UploadFile, File
import os
import shutil
import uuid
import cv2
import face_recognition
import numpy as np
from sklearn.cluster import DBSCAN
from imutils import build_montages
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


app = FastAPI()
app.mount("/static", StaticFiles(directory="results"), name="static")

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
RESULTS_DIR = "results"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

def process_images():
    print("Processing images...")
    data = []
    image_paths = [os.path.join(UPLOAD_DIR, f) for f in os.listdir(UPLOAD_DIR) if f.endswith((".png", ".jpg", ".jpeg"))]
    
    for path in image_paths:
        image = cv2.imread(path)
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        boxes = face_recognition.face_locations(rgb, model="cnn")
        encodings = face_recognition.face_encodings(rgb, boxes)
        d = [{"imagePath": path, "loc": box, "encoding": enc} for (box, enc) in zip(boxes, encodings)]
        data.extend(d)
    
    if not data:
        print("No faces found.")
        return
    
    encodings_arr = [item["encoding"] for item in data]
    cluster = DBSCAN(min_samples=3)
    cluster.fit(encodings_arr)
    
    labelIDs = np.unique(cluster.labels_)
    for labelID in labelIDs:
        if labelID == -1:
            continue
        
        dir_name = os.path.join(RESULTS_DIR, f'face_{labelID}')
        os.makedirs(dir_name, exist_ok=True)
        
        idxs = np.where(cluster.labels_ == labelID)[0]
        faces = []
        
        for i in idxs:
            img_path = data[i]["imagePath"]
            image = cv2.imread(img_path)
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            (top, right, bottom, left) = data[i]["loc"]
            face = rgb_image[top:bottom, left:right]
            face = cv2.resize(face, (96, 96))
            faces.append(face)
            cv2.imwrite(os.path.join(dir_name, f'image_{i}.jpg'), image)
        
        montage = build_montages(faces, (96, 96), (2, 2))[0]
        cv2.imwrite(os.path.join(dir_name, "montage.jpg"), cv2.cvtColor(montage, cv2.COLOR_RGB2BGR))
    
    print("Processing complete!")

@app.post("/upload/")
async def upload_images(files: list[UploadFile] = File(...)):
    for file in files:
        file_ext = file.filename.split(".")[-1]
        file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.{file_ext}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
    process_images()
    return {"message": "Upload successful! Processing started."}

@app.get("/results/")
def get_results():
    results = {}
    for folder in os.listdir(RESULTS_DIR):
        folder_path = os.path.join(RESULTS_DIR, folder)
        if os.path.isdir(folder_path):
            results[folder] = [f"/static/{folder}/{file}" for file in os.listdir(folder_path) if file.endswith(".jpg")]
    return results

