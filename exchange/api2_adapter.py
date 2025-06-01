import requests
from .interface import ExchangeAPI

class API2Adapter(ExchangeAPI):
    def get_rate(self, from_currency, to_currency):
        url = f"https://api.frankfurter.app/latest?from={from_currency}&to={to_currency}"
        res = requests.get(url).json()
        return res["rates"][to_currency]