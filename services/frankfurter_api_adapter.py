import requests
from interfaces.exchange_interface import ExchangeInterface

class FrankfurterAPIAdapter(ExchangeInterface):
    def get_conversion(self, from_currency, to_currency, amount):
        url = f"https://api.frankfurter.app/latest?amount={amount}&from={from_currency}&to={to_currency}"
        res = requests.get(url).json()
        return {
            "rate": res["rates"][to_currency],
            "result": float(res["rates"][to_currency]) * float(amount)
        }
    
    def get_tasa(self, from_currency, to_currency):
        url = f"https://api.frankfurter.app/latest?symbols={from_currency},{to_currency}"
        res = requests.get(url).json()
        return {
            "rate": res["rates"][to_currency]
        }
    
    def get_code(self):
        url = f"https://api.frankfurter.app/currencies"
        res = requests.get(url).json()
        return {
            "currencies": list(res.keys())  # Devuelve ['USD', 'EUR', 'PEN', ...]
        }