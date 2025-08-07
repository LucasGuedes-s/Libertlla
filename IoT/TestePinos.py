from machine import Pin, SPI
import gc9a01py
import time

spi = SPI(1, baudrate=40000000, polarity=1, phase=0, sck=Pin(10), mosi=Pin(11))

# Cria o display passando os pinos em ordem correta
display = gc9a01py.GC9A01(
    spi,
    reset=Pin(12),
    dc=Pin(8),
    cs=Pin(9),
    rotation=0
)

# Se não tiver método init(), comente esta linha
try:
    display.__init__()
except:
    pass

# Preenche a tela com branco
display.fill(0xFFFF)
