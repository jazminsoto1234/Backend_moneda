class TransactionHistoryObserver:
    def __init__(self):
        self.history = []

    def notify(self, user_id, operation):
        self.history.append({
            "user_id": user_id,
            "operation": operation
        })

    def get_user_history(self, user_id):
        return [op for op in self.history if op["user_id"] == user_id]
