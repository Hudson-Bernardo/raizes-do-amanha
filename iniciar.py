"""Servidor local: executa os módulos ES sem depender de serviços externos."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from functools import partial
import webbrowser

if __name__ == '__main__':
    raiz = Path(__file__).resolve().parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(raiz))
    try:
        servidor = ThreadingHTTPServer(('127.0.0.1', 8000), handler)
    except OSError:
        raise SystemExit('A porta 8000 está ocupada. Feche o servidor anterior e tente novamente.')
    url = 'http://127.0.0.1:8000/html/index.html'
    print(f'Abra {url}\nPara encerrar, pressione Ctrl+C.', flush=True)
    webbrowser.open(url)
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        servidor.server_close()
