import random

def generar_nro_cuenta():
    """Genera un número de cuenta aleatorio con el formato XX-XXXXX-XX"""
    return f"{random.randint(10, 99)}-{random.randint(10000, 99999)}-{random.randint(10, 99)}"
