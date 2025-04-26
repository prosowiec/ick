import pandas as pd
from sqlalchemy import create_engine

# 1. Utwórz połączenie z bazą SQLite
engine = create_engine('sqlite:///data/website.db')

# 2. Wczytaj pliki CSV
otomoto_df = pd.read_csv('data/otomoto.csv')

columns_auto = ["make", "model", "year", "price", "currency", "mileage", "mileage_unit", "power", "power_unit", "fuel_type", "date"]
autoscout_df = pd.read_csv('data/autoscout24.csv',on_bad_lines='skip', header=None, names=columns_auto)
autoscout_df = autoscout_df.fillna('')
# 3. Zapisywanie do tabel w bazie danych
otomoto_df.to_sql('otomoto', engine, if_exists='replace', index=False)
autoscout_df.to_sql('autoscout', engine, if_exists='replace', index=False)

print("✅ Dane zostały załadowane do SQLite!")
