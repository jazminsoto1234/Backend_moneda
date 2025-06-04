
class ExchangeManager:
    _instance = None
    _adapter = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ExchangeManager, cls).__new__(cls)
        return cls._instance

    def set_adapter(self, adapter):
        self._adapter = adapter

    def convert(self, from_currency, to_currency, amount):
        if not self._adapter:
            raise Exception("No adapter configured")
        return self._adapter.get_conversion(from_currency, to_currency, amount)
    
    def tasa(self, from_currency, to_currency):
        if not self._adapter:
            raise Exception("No adapter configured")
        return self._adapter.get_tasa(from_currency, to_currency)

    def code(self):
        if not self._adapter:
            raise Exception("No adapter configured")
        return self._adapter.get_code()
