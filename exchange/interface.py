class ExchangeAPI:
    def get_rate(self, from_currency: str, to_currency: str) -> float:
        raise NotImplementedError