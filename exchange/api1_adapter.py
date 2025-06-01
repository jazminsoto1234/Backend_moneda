import requests
from .interface import ExchangeAPI

class API1Adapter(ExchangeAPI):
    def get_rate(self, from_currency, to_currency):
        url = f"https://api.exchangerate.host/convert?from={from_currency}&to={to_currency}"
        res = requests.get(url).json()
        return res["info"]["rate"]