"""Executar: python testes/contraste-cores.py. Pares opacos do tema de alto contraste."""
def luminancia(hexadecimal):
    canais = [int(hexadecimal[i:i+2], 16) / 255 for i in (1, 3, 5)]
    canais = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in canais]
    return sum(v * peso for v, peso in zip(canais, (0.2126, 0.7152, 0.0722)))

pares = [
    ('Texto e fundo', '#ffffff', '#000000', 4.5),
    ('Botão principal', '#000000', '#ffff00', 4.5),
    ('Botão em hover', '#000000', '#ffffff', 4.5),
    ('Badge e botão secundário', '#ffff00', '#000000', 4.5),
    ('Erro', '#ffb3b3', '#000000', 4.5),
    ('Foco sobre fundo', '#00ffff', '#000000', 3),
]
for nome, texto, fundo, minimo in pares:
    menor, maior = sorted((luminancia(texto), luminancia(fundo)))
    razao = (maior + 0.05) / (menor + 0.05)
    assert razao >= minimo, nome
    print(f'{nome}: {texto} / {fundo} = {razao:.2f}:1')
