from abc import ABC, abstractmethod

class ExchangeInterface(ABC):
    @abstractmethod
    def get_conversion(self, from_currency: str, to_currency: str, amount: float) -> dict:
        pass
    
    @abstractmethod
    def get_tasa(self, from_currency: str, to_currency: str) -> dict:
        pass

    @abstractmethod
    def get_code(self) -> dict:
        pass