import requests
from interfaces.exchange_interface import ExchangeInterface

class ExchangeRateAPIAdapter(ExchangeInterface):
    def __init__(self, api_key):
        self.api_key = api_key

    def get_conversion(self, from_currency, to_currency, amount):
        url = f"https://v6.exchangerate-api.com/v6/{self.api_key}/pair/{from_currency}/{to_currency}/{amount}"
        res = requests.get(url).json()
        return {
            "rate": res["conversion_rate"],
            "result": res["conversion_result"]
        }