from machine import Pin, SPI, RTC
import utime
from gc9a01 import GC9A01
import vga1_8x8 as font
import ubluetooth
import math

# --- Inicializa SPI e pinos ---
spi = SPI(0, baudrate=40000000, polarity=1, phase=1, sck=Pin(18), mosi=Pin(19))
dc = Pin(8, Pin.OUT)
cs = Pin(9, Pin.OUT)
rst = Pin(4, Pin.OUT)

# --- Inicializa display ---
oled = GC9A01(spi=spi, dc=dc, cs=cs, reset=rst)
oled.fill(0x0000)

# --- Desenha borda ---
BORD_COLOR = 0xF81F  # magenta
CENTER_X = 120
CENTER_Y = 120
RADIUS = (240 // 2) - 10

def desenhar_borda():
    passo_angulo = 5
    pontos = []
    for ang in range(0, 361, passo_angulo):
        rad = math.radians(ang)
        x = int(CENTER_X + RADIUS * math.cos(rad))
        y = int(CENTER_Y + RADIUS * math.sin(rad))
        pontos.append((x, y))
    for i in range(len(pontos)-1):
        x1, y1 = pontos[i]
        x2, y2 = pontos[i+1]
        oled.line(x1, y1, x2, y2, BORD_COLOR)

desenhar_borda()

led_green = Pin(11, Pin.OUT)
botao_panico = Pin(5, Pin.IN, Pin.PULL_UP)

rtc = RTC()
relogio_ativo = False

ultima_mensagem = 0
tempo_ultimo = utime.ticks_ms()
pontos = 1

# === UUIDs BLE ===
_SERVICE_UUID = ubluetooth.UUID(0x181A)
_CHAR_UUID = ubluetooth.UUID(0x2A6E)

_FLAG_READ = ubluetooth.FLAG_READ
_FLAG_NOTIFY = ubluetooth.FLAG_NOTIFY
_FLAG_WRITE = ubluetooth.FLAG_WRITE

class BLEConexao:
    def __init__(self):
        self.ble = ubluetooth.BLE()
        self.ble.active(True)
        self.ble.config(gap_name="Relogio_Maria")
        self.conectado = False
        self.ble.irq(self._irq)
        self._connections = set()

        self._service = (
            _SERVICE_UUID,
            (
                (_CHAR_UUID, _FLAG_READ | _FLAG_NOTIFY | _FLAG_WRITE),
            ),
        )

        ((self._char_handle,),) = self.ble.gatts_register_services((self._service,))
        self._payload = self._advertise_payload(name="Relogio_Maria", services=[_SERVICE_UUID])
        self.advertise()

    def _irq(self, event, data):
        global relogio_ativo

        if event == 1:
            conn_handle, _, _ = data
            self._connections.add(conn_handle)
            self.conectado = True
            led_green.value(1)

        elif event == 2:
            conn_handle, _, _ = data
            self._connections.discard(conn_handle)
            self.conectado = False
            led_green.value(0)
            self.advertise()

        elif event == 3:
            conn_handle, attr_handle = data
            if attr_handle == self._char_handle:
                valor = self.ble.gatts_read(self._char_handle).decode().strip()
                print("Recebido:", valor)
                try:
                    partes = valor.split(":")
                    horas = int(partes[0])
                    minutos = int(partes[1])
                    segundos = int(partes[2])
                    rtc.datetime((2025, 1, 1, 0, horas, minutos, segundos, 0))
                    relogio_ativo = True
                    print(f"Hora definida: {horas:02d}:{minutos:02d}:{segundos:02d}")
                except Exception as e:
                    print("Erro ao interpretar hora:", e)

    def advertise(self):
        self.ble.gap_advertise(0)
        utime.sleep_ms(100)
        print("Payload:", [hex(b) for b in self._payload])
        self.ble.gap_advertise(100_000, self._payload)

    def _advertise_payload(self, name=None, services=None):
        payload = bytearray()
        if name:
            name_bytes = name.encode()
            payload += bytes((len(name_bytes) + 1, 0x09)) + name_bytes
        if services:
            for uuid in services:
                b = bytes(uuid)
                payload += bytes((len(b) + 1, 0x03)) + b
        return payload

    def enviar_mensagem(self, mensagem):
        for conn_handle in self._connections:
            self.ble.gatts_notify(conn_handle, self._char_handle, mensagem.encode())

# === Inicializa BLE ===
ble = BLEConexao()

# === Loop principal ===
while True:
    agora = utime.ticks_ms()

    if not ble.conectado:
        if utime.ticks_diff(agora, tempo_ultimo) >= 500:
            texto = "Esperando BLE" + "." * pontos
            x = (240 - len(texto) * 8) // 2
            oled.fill_rect(0, 110, 240, 30, 0x0000)
            oled.text(font, texto, x, 120, 0xFFFF, 0x0000)
            pontos = pontos + 1 if pontos < 3 else 1
            tempo_ultimo = agora

    else:
        if relogio_ativo:
            _, _, _, _, horas, minutos, segundos, _ = rtc.datetime()
            texto1 = "Hora atual"
            x1 = (240 - len(texto1) * 8) // 2
            oled.fill_rect(0, 100, 240, 30, 0x0000)
            oled.text(font, texto1, x1, 110, 0xFFFF, 0x0000)

            hora_formatada = "{:02d}:{:02d}:{:02d}".format(horas, minutos, segundos)
            x2 = (240 - len(hora_formatada) * 8) // 2
            oled.text(font, hora_formatada, x2, 120, 0xFFFF, 0x0000)

        else:
            texto2 = "Aguardando hora"
            x3 = (240 - len(texto2) * 8) // 2
            oled.fill_rect(0, 100, 240, 30, 0x0000)
            oled.text(font, texto2, x3, 110, 0xFFFF, 0x0000)

        if botao_panico.value() == 0 and utime.ticks_diff(agora, ultima_mensagem) > 3000:
            print("Botao do panico pressionado!")
            ble.enviar_mensagem("ALERTA")
            ultima_mensagem = agora

    utime.sleep_ms(100)
