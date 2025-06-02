from abc import ABC, abstractmethod

class ExchangeInterface(ABC):
    @abstractmethod
    def get_conversion(self, from_currency: str, to_currency: str, amount: float) -> dict:
        pass