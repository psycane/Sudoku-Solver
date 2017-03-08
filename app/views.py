from flask import Blueprint, render_template, request
from app import app
import os
from werkzeug import secure_filename
solver = Blueprint('views', __name__)


@solver.route('/', methods=['GET'])
def home():
    return render_template('index.html')


@solver.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'GET':
        return render_template('index.html')
    else:
        file = request.files.get('sudoku_image')
        name, ext = os.path.splitext(secure_filename(file.filename))
        print name, ext
        if file and ext.lower() in ['.jpg', '.jpeg', '.png']:
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.mkdir(app.config['UPLOAD_FOLDER'])
            file.save(os.path.join(
                app.config['UPLOAD_FOLDER'], 'sudoku' + ext))

            # PROCESS SUDOKU HERE

            return 'Uploaded!'
        else:
            error = 'Please select a png or jpg file!'
            return render_template('index.html', error=error)
