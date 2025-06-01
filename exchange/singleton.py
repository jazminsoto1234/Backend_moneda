class ExchangeRateProvider:
    _instance = None
    _api = None

    def __new__(cls, api):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._api = api
        return cls._instance

    def get_rate(self, from_currency, to_currency):
        return self._api.get_rate(from_currency, to_currency)