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
    def get_tasa(self, from_currency, to_currency):
        url = f"https://v6.exchangerate-api.com/v6/{self.api_key}/pair/{from_currency}/{to_currency}"
        res = requests.get(url).json()
        return {
            
            "message": res["result"],
            "to_code": res["target_code"],
	        "from_code": res["base_code"],
            "rate": res["conversion_rate"]
        }
    
    def get_code(self):
        url = f"https://v6.exchangerate-api.com/v6/{self.api_key}/codes"
        res = requests.get(url).json()
        return {
            
            "message": res["result"],
            "codes": res["supported_codes"]
        }