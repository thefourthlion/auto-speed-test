# install packages
pip install watchdog

# run as script
watchmedo auto-restart --patterns="*.py" --recursive -- python main.py
