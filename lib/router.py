import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__),"../"))

def getPath( store='root' ):
    if store == 'root':
        return ROOT_DIR
    elif  store == 'universe':
        return os.path.join(ROOT_DIR, 'data', 'universe')
    elif  store == 'stage':
        return os.path.join(ROOT_DIR, 'data', 'stage')
    elif  store == 'master':
        return os.path.join(ROOT_DIR, 'data', 'master')
    elif  store == 'notebook-output':
        return os.path.join(ROOT_DIR, 'notebook-output')
    elif  store == 'notebooks':
        return os.path.join(ROOT_DIR, 'notebooks')
    elif  store == 'notebook-utils':
        return os.path.join(ROOT_DIR, 'notebook-utils')
    elif  store == 'tasks':
        return os.path.join(ROOT_DIR, 'tasks')
    else:
        raise Exception('Router: Not a valid directory')