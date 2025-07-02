from machine import Pin, SoftI2C
from ssd1306 import SSD1306_I2C
import ubluetooth
import utime

# === Display OLED Setup ===
i2c = SoftI2C(scl=Pin(15), sda=Pin(14))
oled = SSD1306_I2C(128, 64, i2c)

led_green = Pin(11, Pin.OUT)
botao_panico = Pin(5, Pin.IN, Pin.PULL_UP)

ultima_mensagem = 0

# === UUIDs BLE ===
_SERVICE_UUID = ubluetooth.UUID("12345678-1234-5678-1234-56789abcdef0")
_CHAR_UUID = ubluetooth.UUID("12345678-1234-5678-1234-56789abcdef1")

_FLAG_READ = ubluetooth.FLAG_READ
_FLAG_NOTIFY = ubluetooth.FLAG_NOTIFY

class BLEConexao:
    def __init__(self):
        self.ble = ubluetooth.BLE()
        self.ble.active(True)
        self.ble.irq(self._irq)
        self._connections = set()
        self.conectado = False

        self._service = (
            _SERVICE_UUID,
            (
                (_CHAR_UUID, _FLAG_READ | _FLAG_NOTIFY),
            ),
        )

        ((self._char_handle,),) = self.ble.gatts_register_services((self._service,))
        self._payload = self._advertise_payload(name=b"PicoBLE_JP", services=[_SERVICE_UUID])
        self.advertise()

    def _irq(self, event, data):
        if event == 1:  # Central conectada
            conn_handle, _, _ = data
            self._connections.add(conn_handle)
            self.conectado = True
            led_green.value(1)
        elif event == 2:  # Central desconectada
            conn_handle, _, _ = data
            self._connections.discard(conn_handle)
            self.conectado = False
            led_green.value(0)
            self.advertise()

    def advertise(self):
        self.ble.gap_advertise(100_000, adv_data=self._payload)

    def _advertise_payload(self, name=None, services=None):
        payload = bytearray()

        if name:
            payload += bytes((len(name) + 1, 0x09)) + name

        if services:
            for uuid in services:
                b = bytes(uuid)
                payload += bytes((len(b) + 1, 0x07)) + b  # 0x07 = Complete List of 128-bit UUIDs

        return payload

    def enviar_mensagem(self, mensagem: str):
        for conn_handle in self._connections:
            self.ble.gatts_notify(conn_handle, self._char_handle, mensagem.encode())

ble = BLEConexao()

# === Loop principal ===
tempo_ultimo = utime.ticks_ms()
pontos = 1

while True:
    agora = utime.ticks_ms()

    if not ble.conectado:
        if utime.ticks_diff(agora, tempo_ultimo) >= 500:
            oled.fill(0)
            oled.text("Esperando BLE" + "." * pontos, 0, 20)
            oled.show()
            pontos = pontos + 1 if pontos < 3 else 1
            tempo_ultimo = agora
    else:
        oled.fill(0)
        oled.text("Conectado ao BLE", 0, 25)
        oled.show()
        if botao_panico.value() == 0 and utime.ticks_diff(agora, ultima_mensagem) > 3000:
            print("Botao do panico pressionado!")
            ble.enviar_mensagem("ALERTA")
            ultima_mensagem = agora

    utime.sleep_ms(100)
