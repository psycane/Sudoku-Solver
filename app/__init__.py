from flask import Flask, render_template

app = Flask(__name__)
app.config.from_object('config')

from app import views
app.register_blueprint(views.solver_app)
'''@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404'''
