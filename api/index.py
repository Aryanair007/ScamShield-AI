import os
import sys

# Ensure backend and ml packages can be imported by Vercel serverless runtime
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.app.main import app

# Vercel Serverless ASGI entry point
app = app
