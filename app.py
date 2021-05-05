from flask import Flask, render_template, request, redirect
import cv2
from keras.models import load_model
import numpy as np
from mtcnn.mtcnn import MTCNN
import time

app = Flask(__name__)

emotion = ""
fileName = ""


@app.route('/')
def index():
    return render_template("MainPage.html")


@app.route('/result')
def result():
    return render_template("Result.html", value=emotion, file=fileName)


@app.route("/getEmotion", methods=['GET', 'POST'])
def getEmotion():
    if request.method == "POST":
        print(request.files)
        img = request.files["fileUpload"]
        img.save('static/file.jpg')
        label_map = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
        emotionCount = [0, 0, 0, 0, 0, 0, 0]
        global emotion
        global fileName
        MTCNNDetector = MTCNN()
        model = load_model('model1.h5')
        image = cv2.imread('static/file.jpg')
        image_copy = image
        faces = MTCNNDetector.detect_faces(image_copy)
        for f in faces:
            x, y, w, h = f['box']
            x1, y1 = x + w, y + h
            cv2.rectangle(image, (x, y), (x1, y1), (0, 0, 255), 2)
            roi = image_copy[y:y + h, x:x + w]
            roi = cv2.resize(roi, (48, 48), interpolation=cv2.INTER_AREA)
            roi = roi.astype('float') / 255.0
            roi = np.expand_dims(roi, axis=0)
            predictionProb = model.predict(roi)
            prediction = np.argmax(predictionProb)
            emotionCount[prediction] += 1
            final_prediction = label_map[prediction]
            print(prediction)
            print(final_prediction)
            emotion = final_prediction
            label_position = (x, y)
            cv2.putText(image, final_prediction, label_position, cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)

        emotion = label_map[np.argmax(emotionCount)]
        print(emotionCount)
        fileName = "images/outputFile_" + str(time.time()) + ".jpg"
        cv2.imwrite("static/"+fileName, image)
        return redirect("/result")
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)
