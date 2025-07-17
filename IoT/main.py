from machine import Pin, SoftI2C, RTC
from ssd1306 import SSD1306_I2C
import ubluetooth
import utime

# === Display OLED Setup ===
i2c = SoftI2C(scl=Pin(15), sda=Pin(14))
oled = SSD1306_I2C(128, 64, i2c)

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
            # Central conectou
            conn_handle, _, _ = data
            self._connections.add(conn_handle)
            self.conectado = True
            led_green.value(1)

        elif event == 2:
            # Central desconectou
            conn_handle, _, _ = data
            self._connections.discard(conn_handle)
            self.conectado = False
            led_green.value(0)
            self.advertise()

        elif event == 3:
            # Dados recebidos via BLE
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
            oled.fill(0)
            oled.text("Esperando BLE" + "." * pontos, 0, 20)
            oled.show()
            pontos = pontos + 1 if pontos < 3 else 1
            tempo_ultimo = agora
    else:
        oled.fill(0)
        if relogio_ativo:
            _, _, _, _, horas, minutos, segundos, _ = rtc.datetime()
            oled.text("Hora atual", 20, 0)
            oled.text("{:02d}:{:02d}:{:02d}".format(horas, minutos, segundos), 0, 25)
        else:
            oled.text("Aguardando hora", 0, 25)
        oled.show()

        # Verifica botão de pânico
        if botao_panico.value() == 0 and utime.ticks_diff(agora, ultima_mensagem) > 3000:
            print("Botao do panico pressionado!")
            ble.enviar_mensagem("ALERTA")
            ultima_mensagem = agora

    utime.sleep_ms(100)
