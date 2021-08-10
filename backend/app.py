from flask import Flask,request
from flask_cors import CORS
import os
app = Flask(__name__)

CORS(app)

@app.post('/code')
def code():
    data = request.get_json()
    f = open("temp.js",'w')
    f.write(data['code'])
    f.close()
    return_value = os.popen("./node_modules/.bin/eslint temp.js").read()
    print("받아온 값",return_value)
    return {
        'status':return_value
    }

if __name__ == '__main__':
    app.run(debug=True)